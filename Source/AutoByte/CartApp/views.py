import threading
import time
from django.shortcuts import render, HttpResponse, redirect
from django.contrib import messages
from django.contrib.auth import login
from ProductApp.models import Product, ProductImages, BiddingPrice
from LandingApp.models import *
from django.db.models import Q
from .models import *
from django.views.decorators.csrf import csrf_exempt
import razorpay
from datetime import datetime, timedelta
import schedule
from django.utils import timezone
from DeliveryApp.models import *

from django.template.loader import get_template
from .models import Orders
from xhtml2pdf import pisa

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


def autobidder_view(request, product_id):
    biddingprices = BiddingPrice.objects.filter(product_id=product_id).order_by('-bidding_price').first()

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
    # Getting Data from Hidden Inputs
    userloca_id = request.POST['userlocaid']
    product_id = request.POST['productID']
    bidprice = request.POST['bidprice']
    emailid = request.POST['emailid']
    paymentId = request.POST['razorpay_payment_id']

    # Initialising User Object for Logging in
    userauth = UserAuth.objects.get(email=emailid)
    login(request, userauth)
    print(f"Successfully Logged in as {request.user.first_name} {request.user.last_name}")

    # Retrieving Payment Details
    client = razorpay.Client(auth=("rzp_test_l4eDblehZr7MDi", "ymaImOTAtnz4VoWMZHK9qwOQ"))
    payment_details = client.payment.fetch(paymentId)
    print(payment_details)

    # Creating Order
    order = Orders()
    product = Product.objects.get(id=product_id)
    order.product = product
    order.userloca = UserLoca.objects.get(id=userloca_id)
    order.amount = float(bidprice)
    order.buyer = request.user
    order.save()

    create_delivery_chart(order)

    # Updating Product DB
    product.is_sold = True
    product.sold_to = request.user
    product.sold_at_datetime = datetime.now()
    product.save()

    context = {
        "atSuccessPage": True,
        "paymentId": payment_details,
        'order': order,
        "netamount": float(order.amount)+30
    }
    return render(request, "pages/cart&checkout/ordersuccess.html", context)

def myOrders_view(request): 
    user_orders = Orders.objects.filter(buyer=request.user)
    context = {
        "myorders": True,
        "products": user_orders,
        "selectedDate": False 
    }
    if request.method == 'POST':
        filterdate = request.POST['filterdate']
        if len(filterdate) != 0:
            filter_datetime = datetime.strptime(filterdate, '%Y-%m-%d').date()
            context['products'] = user_orders.filter(orderdatetime__date=filter_datetime)
            context['selectedDate'] = filter_datetime
    return render(request, "pages/cart&checkout/myorders.html", context)


def checkProductStatus(): 
    product = Product.objects.filter(Q(is_sold=False) & Q(autobidding=True))
    for i in product:
        if i.enddatetime is not None:
            if i.enddatetime >= timezone.now():
                auto_Update_Bid(i.id)
            else:
                print("Time Not Yet Reached")
        else:
            print("No Date is Found")


def auto_Update_Bid(product_id):
    product = Product.objects.get(id=product_id)
    if product.biddingprice_set.all().count() >= 1:
        highest_bidder = BiddingPrice.objects.filter(product_id=product.id).order_by('-bidding_price').first()
        if product.baseprice < highest_bidder.bidding_price:
            print(f'Product with ID: {product_id} and Name: {product.name} has been Completed Bidding with Highest Bidder {highest_bidder.userauth.username}')
            bid_instance = BiddingPrice.objects.get(id=highest_bidder.id)
            bid_instance.is_final = True
            bid_instance.save()
        else:
            print(f'Product Has no Better Bidding')
            if product.auto_sell_type == 1:
                highest_bidder.is_final = True
                highest_bidder.save()
            elif product.auto_sell_type == 2:
                product.is_active = False
                product.save()
    else:
        print(f'No Bidding Available For {product.name}')

def manuallySelectedBid(request, bid_id):
    bid_instance = BiddingPrice.objects.get(id=bid_id)
    bid_instance.is_final = True
    bid_instance.save()
    return redirect('productbidding')

def create_delivery_chart(order):
    delivery_loca1 = DeliveryLocation()
    delivery_loca1.country = order.userloca.country
    delivery_loca1.state = order.userloca.state
    delivery_loca1.city = order.userloca.city
    delivery_loca1.latitude = order.userloca.latitude
    delivery_loca1.longitude = order.userloca.longitude
    delivery_loca1.contact_number = order.userloca.contact_number
    delivery_loca1.save()
    print(f"Lat: {delivery_loca1.latitude}, Lng: {delivery_loca1.longitude}")
    print(f"Username: {order.buyer.username}")


    delivery_loca2 = DeliveryLocation()
    delivery_loca2.country = order.product.loca.country
    delivery_loca2.state = order.product.loca.state
    delivery_loca2.city = order.product.loca.city
    delivery_loca2.latitude = order.product.loca.latitude
    delivery_loca2.longitude = order.product.loca.longitude
    delivery_loca2.contact_number = order.product.loca.contact_number
    delivery_loca2.save()
    print(f"Lat: {delivery_loca2.latitude}, Lng: {delivery_loca2.longitude}")
    print(f"Username: {order.userloca.userauth.username}")

    delivery_chart = DeliveryChart()
    delivery_chart.source_loc = delivery_loca2
    delivery_chart.destination_loc = delivery_loca1
    delivery_chart.order = order
    delivery_chart.save()

def generate_filtered_orders_pdf(request):
    dateFilter = request.GET['date']
    if dateFilter == "False":
        filtered_orders = Orders.objects.filter(buyer=request.user)
        print(f"Given Date: {dateFilter}")
    else:
        # Parse the date string into a datetime object
        filter_date = datetime.strptime(dateFilter, '%B %d, %Y')
        print(filter_date)
        # Format the datetime object into the "YYYY-MM-DD" format
        formatted_date = filter_date.strftime('%Y-%m-%d')
        # filter_date = datetime.strptime(date_string, '%B %d, %Y')
        filtered_orders = Orders.objects.filter(Q(buyer=request.user) & Q(orderdatetime__date=formatted_date))
    # Filter orders based on your criteria

    # Create a context dictionary with the filtered orders
    context = {
        'filtered_orders': filtered_orders,
    }
    print(filtered_orders)
    # Get the custom HTML template for the filtered orders
    template = get_template('pdf_print.html')
    
    # Render the template with the context data
    html_content = template.render(context)

    # Create a PDF response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="filtered_orders.pdf"'

    # Generate PDF from HTML content
    pisa.CreatePDF(html_content, dest=response)

    return response

