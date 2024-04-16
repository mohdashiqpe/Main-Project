from itertools import zip_longest
from django.http import JsonResponse
from django.shortcuts import render, redirect, HttpResponse
from LandingApp.models import UserAuth, UserLoca
from TesterApp.models import TesterData
from AdminApp.models import Brand, SubCategory, MainCategory
from django.core.serializers import serialize
from .models import *
from datetime import datetime
from django.db.models import Max
from django.db.models import Q, Subquery
from django.db.models import Case, When, BooleanField, OuterRef
from DeliveryApp.models import *
from django.contrib import messages

def addproductview(request): 
    # Product.objects.all().delete()
    # DeliveryLocation.objects.all().delete()
    context = {
        "corresponding_data": False,
        "userinaddproduct": True,
        "userprod": Product.objects.filter(userauth_id=request.user.email)
    }
    corresponding_data = request.session.get('corresponding_data')
    if corresponding_data is None:
        print("Nothing")
    else:
        context['corresponding_data'] = corresponding_data
        del request.session['corresponding_data']
    # Product.objects.all().delete()
    return render(request, "pages/productpages/addproduct.html", context)
 
def loadBrand(request):
     data = {
          "brands": False
     }
     catid = request.GET['id']
     print(catid)
     if Brand.objects.filter(subcategory_id = catid).exists():
          sscat = Brand.objects.filter(subcategory_id = request.GET['id']).values()
          data['brands'] = list(sscat)
     return JsonResponse(data)

def loadLocation(request):
    userloca_data = UserLoca.objects.filter(userauth_id=request.user.email).values()
    userloca_list = list(userloca_data)
    data = {
        "userloca": userloca_list
    }
    return JsonResponse(data, safe=False) 
    
def addProductForm(request):
    maincategory = request.POST['category']
    subcategory = request.POST['scategory']
    brand = request.POST['subcategory']
    productname = request.POST['pname']
    expectedprice = request.POST['expPrice']
    biddingtype = request.POST['membershipRadios']
    accidentremark = request.POST['accremark']
    description = request.POST['description']
    dateofman = request.POST['date']

    productlocation = request.POST['productLoca']
    images = request.FILES.getlist('img[]')

    productlocation = UserLoca.objects.get(id=productlocation)
    productloca = UserLoca()
    productloca = productlocation
    productloca.is_productloca = True
    productloca.save()

    product = Product()
    product.userauth_id = request.user.email
    product.loca = productloca
    product.maincat_id = maincategory
    product.subcat_id = subcategory
    product.brand_id = brand
    product.YearOfMan = dateofman
    product.name = productname
    if len(accidentremark) == 0:
        product.accidents = 'None'
    else:
        product.accidents = accidentremark
    product.description = description
    product.baseprice = expectedprice
    if biddingtype == '1':
        product.autobidding = True
        endBidTime_string = request.POST['enddatetime']
        endBidTime_object = datetime.strptime(endBidTime_string, '%Y-%m-%dT%H:%M')
        product.enddatetime = endBidTime_object
    else:
        product.autobidding = False
    product.save()

    for image in images:
        productimage = ProductImages()
        productimage.product = product
        productimage.images = image
        productimage.save()

    return redirect('addproduct')

def productinfoview(request, product_id):
    product = Product.objects.get(pk=product_id)
    user_has_bid = BiddingPrice.objects.filter(product=product, userauth=request.user).exists()
    context = {
        'product': product,
        'user_has_bid': user_has_bid,
        'productdetials': True
    }
    return render(request, "pages/productpages/productdetail.html", context)

def bidbyuser(request, productid):
    if not request.user.is_authenticated:
        return redirect('login')
    price = request.POST['price']
    product = Product.objects.get(id=productid)
    biddingprice = BiddingPrice()
    biddingprice.product = product
    biddingprice.userauth = request.user
    biddingprice.bidding_price = price
    biddingprice.save()
    # return HttpResponse(f'You Have Reached with id {price}')
    return redirect(f'/productinfoview/{productid}')


def my_products_view(request):
    products = Product.objects.filter(userauth_id=request.user.email)
    for product in products:
        highest_bid = product.biddingprice_set.aggregate(Max('bidding_price'))['bidding_price__max']
        product.highest_bid = highest_bid if highest_bid is not None else 0
        if product.is_sold:
            try:
                product.delivery_chart = DeliveryChart.objects.get(order__product=product)
            except DeliveryChart.DoesNotExist:
                product.delivery_chart = None

    context = {
        "myproducts": True,
        "products": products
    }
    return render(request, "pages/productpages/myproducts.html", context)


def product_bidding_view(request):
    ownedProducts = request.user.product.all()
    
    final_bidder = False
    biddedProducts = []
    for item in ownedProducts:
        if BiddingPrice.objects.filter(product_id=item.id).exists():
            bidding_price = BiddingPrice.objects.filter(product_id=item.id)
            if bidding_price.filter(is_final=True).exists:
                biddedProducts.append(bidding_price.filter(is_final=True).order_by('-bidding_price').first())
            else:
                biddedProducts.append(bidding_price.order_by('-bidding_price').first())

    for item in ownedProducts:
        ownedProductBids = item.biddingprice_set.all()
        if ownedProductBids.filter(is_final=True).exists():
            item.highestBidder = ownedProductBids.filter(is_final=True).first()
        else:
            item.highestBidder = ownedProductBids.order_by('-bidding_price').first()

    print(biddedProducts)

    mybidds = request.user.biddingprice_set.all()

    finalised_bids = set(
        BiddingPrice.objects.filter(is_final=True).values_list('product_id', flat=True)
    )

    for bid in mybidds:
        bid.is_sold_to_others = bid.product_id in finalised_bids

    context = {
        'bidding': True,
        'combined': ownedProducts, 
        'bids': mybidds,
    }
    return render(request, "pages/productpages/productbidding.html", context)

import pandas as pd
def load_data_from_excel():
    # Read Excel file
    df = pd.read_excel('D:/Data Excel/Users.xlsx')

    # Iterate over rows and save to database
    for index, row in df.iterrows():
        # print(row)
        userauth = UserAuth()
        userauth.username = row['Username']  # Assuming 'Username' is the column name in Excel
        userauth.first_name = row['first_name']
        userauth.last_name = row['last_name']
        userauth.email = row['email']
        userauth.gender = row['gender']
        userauth.set_password(row['Password'])
        userauth.save()
        # obj = YourModel(field1=row['Column1'], field2=row['Column2'], ...)  # Adjust fields accordingly
        # obj.save()

def removedata():
    df = pd.read_excel('D:/Data Excel/Users.xlsx')

    for index, row in df.iterrows():
        UserAuth.objects.get(email=row['email']).delete()

def updatePassword():
     df = pd.read_excel('D:/Data Excel/Users.xlsx')
     for index, row in df.iterrows():
         userauth=UserAuth.objects.get(email=row['email'])
         userauth.set_password("Abcd@123")
         userauth.save()


