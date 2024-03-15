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
from django.db.models import Q

def addproductview(request): 
    # Product.objects.filter(id=1).delete()
    context = {
        "userinaddproduct": True,
        "userprod": Product.objects.filter(userauth_id=request.user.email)
    }
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
    price = request.POST['price']
    product = Product.objects.get(id=productid)
    biddingprice = BiddingPrice()
    biddingprice.product = product
    biddingprice.userauth = request.user
    biddingprice.bidding_price = price
    biddingprice.save()
    if product.autobidding:
        if float(product.baseprice) > float(biddingprice.bidding_price):
            return HttpResponse(f'Auto Bidding Done for {product.name}')
    # return HttpResponse(f'You Have Reached with id {price}')
    return redirect(f'/productinfoview/{productid}')


def my_products_view(request):
    products = Product.objects.filter(userauth_id=request.user.email)
    for product in products:
        highest_bid = product.biddingprice_set.aggregate(Max('bidding_price'))['bidding_price__max']
        product.highest_bid = highest_bid if highest_bid is not None else 0

    context = {
        "myproducts": True,
        "products": products
    }
    return render(request, "pages/productpages/myproducts.html", context)


def product_bidding_view(request):
    ownedProducts = Product.objects.filter(userauth_id=request.user.email)

    biddedProducts = []
    for item in ownedProducts:
        print(item)
        if BiddingPrice.objects.filter(product_id=item.id).exists():
            biddedProducts.append(BiddingPrice.objects.filter(product_id=item.id).order_by('-bidding_price').first())

    # products = Product.objects.filter(userauth_id=request.user.email)
    # for product in products:
    #     highest_bid = product.biddingprice_set.aggregate(Max('bidding_price'))['bidding_price__max']
    #     if highest_bid is not None:
    #         highest_bidder_price = product.biddingprice_set.filter(bidding_price=highest_bid).first()
    #         highest_bidder = highest_bidder_price.userauth if highest_bidder_price else None
    #     else:
    #         highest_bidder = None

    #     product.highest_bid = highest_bid if highest_bid is not None else 0
    #     product.highest_bidder = highest_bidder
    
    product_ids = BiddingPrice.objects.filter(userauth=request.user).values_list('product', flat=True).distinct()
    max_bidding_prices = []
    for product_id in product_ids:
        max_bid = BiddingPrice.objects.filter(product_id=product_id).order_by('-bidding_price').first()
        max_bidding_prices.append(max_bid)

    context = {
        'bidding': True,
        'combined': zip_longest(ownedProducts, biddedProducts),
        'bids': max_bidding_prices
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


