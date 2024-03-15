from django.shortcuts import render, HttpResponse, redirect
from django.contrib import messages
from django.contrib.auth import login
from ProductApp.models import Product, ProductImages, BiddingPrice
from LandingApp.models import *
from django.db.models import Q
from .models import *
from django.views.decorators.csrf import csrf_exempt
import razorpay
from datetime import datetime

# Create your views here.
def checkoutview(request, product_id):
    if not UserLoca.objects.filter(userauth_id=request.user.email).exists():
        messages.warning(request, "You need to set your location first.")
        return redirect('userSettings')
    product = Product.objects.get(id=product_id)
    context = {
        "paymentid": False,
        "userincheckout": True,
        "product": product,
        "bidprice": BiddingPrice.objects.get(Q(is_final=True) & Q(userauth_id=request.user.email) & Q(product_id=product_id))
    }

    client = razorpay.Client(auth=("rzp_test_l4eDblehZr7MDi", "ymaImOTAtnz4VoWMZHK9qwOQ"))
    DATA = {
        "amount": 3999900,
        "currency": "INR",
        "receipt": "receipt#",
    }
    payment = client.order.create(data=DATA)
    context["paymentid"] = payment['id']
    return render(request, "pages/cart&checkout/checkout.html", context)

def add_address(request, product_id):
    userloca = UserLoca()
    userloca.country = request.POST['selectedCountry'] 
    userloca.state = request.POST['selectedState']
    userloca.city = request.POST['selectedCity']
    userloca.address = request.POST['address']
    userloca.street = request.POST['street']
    userloca.userauth = request.user
    userloca.save()
    return redirect(f"/checkoutview/{product_id}")


def autobidder_view(request):
    return HttpResponse("Auto Bidder View")

def mannualbidder_view(request, product_id):
    biddingprices = BiddingPrice.objects.filter(product_id=product_id).order_by('-bidding_price').first()
    biddingprices.is_final = True
    biddingprices.save()
    # return HttpResponse(f"Mannual Bidder View {biddingprices.bidding_price} of Product {biddingprices.product.name}")
    return redirect('productbidding')


def usercart_view(request):
    context = {
        "usercart": True
    }
    return render(request, "pages/cart&checkout/usercart.html", context)

@csrf_exempt
def successPage(request):
    userloca_id = request.POST['userlocaid']
    product_id = request.POST['productID']
    bidprice = request.POST['bidprice']
    emailid = request.POST['emailid']
    paymentId = request.POST['razorpay_payment_id']
    userauth = UserAuth.objects.get(email=emailid)
    login(request, userauth)
    print(f"Successfully Logged in as {request.user.first_name} {request.user.last_name}")
    client = razorpay.Client(auth=("rzp_test_l4eDblehZr7MDi", "ymaImOTAtnz4VoWMZHK9qwOQ"))
    payment_details = client.payment.fetch(paymentId)
    print(payment_details)
    order = Orders()
    product = Product.objects.get(id=product_id)
    order.product = product
    order.userloca = UserLoca.objects.get(id=userloca_id)
    order.amount = float(bidprice)
    order.save()
    product.is_sold = True
    product.sold_to = request.user
    product.sold_at_datetime = datetime.now()
    product.save()
    # print(f"Product Id: {product_id} at Location Id: {userloca_id}")
    # return HttpResponse("Success")
    context = {
        "atSuccessPage": True,
        "paymentId": payment_details,
        'order': order,
        "netamount": float(order.amount)+30
    }
    return render(request, "pages/cart&checkout/ordersuccess.html", context)

def myOrders_view(request):
    context = {
        "myorders": True,
        "products": Product.objects.filter(sold_to_id=request.user.email)
    }
    return render(request, "pages/cart&checkout/myorders.html", context)
