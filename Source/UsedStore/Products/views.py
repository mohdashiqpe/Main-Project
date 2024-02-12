from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.views.decorators.cache import never_cache
from .models import Carts, Main_Category, Category, Product, ProductImages, Sub_Category, UserCart
from AuthApp.models import UserAuth, UserData, UserLoca
from datetime import datetime
from django.contrib.auth import login, logout, authenticate
# from .models import *
from django.db.models import Q, F

@login_required
@never_cache
def addCategoryView(request):
        userdata = UserData.objects.get(email = request.user.email)
        data = {
             "userdata": userdata,
             "mainCat": False,
             "cats": False,
             "scat": False
             }
        if request.method == 'POST':
            if 'mainCat' in request.POST:
                mainCat = request.POST['mainCat']
                mainCat = Main_Category(name=mainCat)
                mainCat.save()
            elif 'cat' in request.POST:
                cat = request.POST['cat']
                mcat = Main_Category.objects.get(id=request.POST['mcatid'])
                mcat.count += 1
                cat = Category(mcategoryId=mcat, name=cat)
                mcat.save()
                cat.save()
            elif 'subCat' in request.POST:
                 scat = request.POST['subCat']
                 cat = Category.objects.get(id=request.POST['catid'])
                 cat.count += 1
                 scat = Sub_Category(categoryId=cat, name=scat)
                 cat.save()
                 scat.save()
            return redirect('addCategory')
        if Main_Category.objects.exists():
             data['mainCat'] = Main_Category.objects.all()
        if Category.objects.exists():
             data['cats'] = Category.objects.all()
        if Sub_Category.objects.exists():
             data['scat'] = Sub_Category.objects.all()
        return render(request, 'addCategory.html', data)
    

def loadCategories(request):
    data = {
        "cat": False
    }
    if Main_Category.objects.all().exists():
        main_categories = Main_Category.objects.values()
        data['cat'] = list(main_categories)
    return JsonResponse(data)

def loadSubCategory(request):
     data = { 
          "scat": False
     }
     mcatId = request.GET['id']
     mcat = Main_Category.objects.get(id=mcatId)

     if Category.objects.filter(mcategoryId=mcat).exists():
        data['scat'] = list(Category.objects.filter(mcategoryId=mcat).values())
     return JsonResponse(data)

def loadSubSUbCategory(request):
     data = {
          "sscat": False
     }
     catid = request.GET['id']
     if Sub_Category.objects.filter(categoryId_id = catid).exists():
          sscat = Sub_Category.objects.filter(categoryId_id = request.GET['id']).values()
          data['sscat'] = list(sscat)
     return JsonResponse(data)


def removeCat(request):
    catId = request.GET.get('id')  # Using get() to handle the case where 'id' is not present
    if Main_Category.objects.filter(id=catId).exists():
        Main_Category.objects.get(id=catId).delete()
    elif Category.objects.filter(id=catId).exists():
        cat = Category.objects.get(id=catId)
        mid = cat.mcategoryId.id  # Get the ID directly to avoid fetching the whole object
        mcat = Main_Category.objects.get(id=mid)
        mcat.count -= 1
        mcat.save()
        cat.delete()
    elif Sub_Category.objects.filter(id=catId).exists():
        scat = Sub_Category.objects.get(id=catId)
        cat = Category.objects.get(id=scat.categoryId.id)
        cat.count -= 1
        cat.save()
        scat.delete()
    return redirect('addCategory')

def checkCatExists(request):
    data = {
        "exists": False
    }
    checkData = request.GET.get('cat')
    if Main_Category.objects.filter(name=checkData).exists():
         data['exists'] = True
    if Category.objects.filter(name=checkData).exists():
         data['exists'] = True
    if Sub_Category.objects.filter(name=checkData).exists():
         data['exists'] = True
    return JsonResponse(data)

@login_required
@never_cache
def addProductsView(request):
    if request.method == 'POST':
        mainCategory = request.POST['category']
        category = request.POST['scategory']
        productName = request.POST['pname']
        eprice = request.POST['expPrice']
        stockCount = request.POST['stockcount']
        dateInString = request.POST['date']
        description = request.POST['description']
        # datetime.strptime("2022-01-01", "%Y-%m-%d").date()
        productLoca = request.POST['productLoca']
        images = request.FILES.getlist('img[]')
        newProduct = Product(
                mainCategory_id = mainCategory,
                category_id = category,
                name = productName,
                price = eprice,
                stock = stockCount,
                description = description,
                yearOfMan = datetime.strptime(dateInString, "%Y-%m-%d").date(),
                productLoca_id = productLoca,
                ownerId_id = request.user.email,
                availability = stockCount
            )
        if request.POST['accremark'] != '':
            accRemark = request.POST['accremark']
            newProduct.Acc_remarks = accRemark
        if 'subcategory' in request.POST:
            subCategory = request.POST['subcategory']
            newProduct.subCategory_id = subCategory
        newProduct.save()
        for image in images:
            ProductImages.objects.create(product=newProduct, images=image)
        return redirect('addProducts')
    else:
        userauth = UserAuth.objects.get(email=request.user.email)
        userdata = UserData.objects.get(email=request.user.email)
        locaAvail = UserLoca.objects.filter(email=request.user.email).exists()
        prodAvail = Product.objects.filter(ownerId_id = request.user.email).exists()
        context = {
                    "userauth": userauth,
                    "userdata": userdata,
                    "userloca": False,
                    "userprod": False,
                    "testers": False
                }
        if locaAvail:
                userloca = UserLoca.objects.filter(email=request.user.email)
                context['userloca'] = list(userloca)
        if prodAvail:
            products = Product.objects.filter(ownerId_id=request.user.email)
            context['userprod'] = list(products)
        return render(request, 'addProducts.html', context)


from django.core.serializers import serialize
def loadLocation(request):
    userloca_data = UserLoca.objects.filter(email_id=request.user.email).values()
    userloca_list = list(userloca_data)
    
    data = {
        "userloca": userloca_list
    }

    return JsonResponse(data, safe=False)


import razorpay
@login_required
def checkOutPage(request, id):
    if request.method == 'POST' and "address" in request.POST:
        new_address = request.POST['address']
        new_street = request.POST['street']
        new_country = request.POST['selectedCountry']
        new_state = request.POST['selectedState']
        new_city = request.POST['selectedCity']
        new_userLoca = UserLoca(
            email_id = request.user.email,
            country = new_country,
            state = new_state,
            city = new_city,
            street = new_street,
            address = new_address,
            address_mode = UserLoca.objects.filter(email_id=request.user.email).last().address_mode + 1
        )
        new_userLoca.save()
        request.session['newActive'] = new_userLoca.address_mode
        return redirect(reverse('checkOut', kwargs={'id': id}))
    productDetails = Product.objects.get(id=id)
    client = razorpay.Client(auth=("rzp_test_l4eDblehZr7MDi", "ymaImOTAtnz4VoWMZHK9qwOQ"))
    DATA = {
        "amount": 3999900,
        "currency": "INR",
        "receipt": "receipt#1",
        "notes": {
            "key1": "value3",
            "key2": "value2"
        }
    }
    payment = client.order.create(data=DATA)
    if "newActive" in request.session:
         userLoca = UserLoca.objects.get(Q(email_id=request.user.email)&Q(address_mode=request.session.get('newActive')))
         del request.session['newActive']
    else:
         userLoca = UserLoca.objects.get(Q(email_id=request.user.email)&Q(address_mode=1))
    data = {
        "paymentid":payment['id'],
        "data": productDetails,
        "userloca": userLoca,
        "proImages": ProductImages.objects.filter(product=productDetails).first(),
        "userLocas": UserLoca.objects.filter(email_id=request.user.email),
        "userdata": UserData.objects.get(email_id=request.user.email),
    }
    request.session['mailAuth'] = request.user.email
    return render(request, "check_Out_Page.html", data) 


from django.views.decorators.csrf import csrf_exempt 

@login_required
def cartPage(request):
     if "id" in request.GET:
          pid = request.GET['id']
          product = Product.objects.get(id=pid)
          if Carts.objects.filter(cartUser_id=request.user.email).exists():
               carts = Carts.objects.get(cartUser_id=request.user.email)
               usercart = UserCart.objects.create(product=product, usercart=carts)
               carts.cartcount += 1
               carts.totalAmount += product.price
               carts.save()
          else:
            carts = Carts(
                cartcount = 1,
                cartUser_id = request.user.email,
                totalAmount = product.price,
            )
            carts.save()
            usercart = UserCart(product=product, usercart=carts)
            usercart.save()
          return redirect('cart')
     else:
          data = {
                "mycart": False,
                "products": False,
                "userdata": UserData.objects.get(email_id=request.user.email)
          }
          if Carts.objects.filter(Q(cartUser_id=request.user.email)).exists():
            data['mycart'] = Carts.objects.get(Q(cartUser_id=request.user.email))
            data['products'] = UserCart.objects.filter(usercart=data['mycart'])
          print(data['mycart'])  
        #   cart = Carts.objects.get(cartUser_id=request.user.email)
        #   cart.cartcount = cart.cartcount - 1
        #   cart.save()
          return render(request, "cartPage.html", data)


@login_required
def productDetailsPage(request, id):
     productDetails = Product.objects.get(id=id)
     data = {
          'data': productDetails,
          "userdata": UserData.objects.get(email_id=request.user.email),
     }
     return render(request, "productDetails.html", data)

def pdfGenHtml(request):
     return render(request, "pdfGenHtml.html")

@csrf_exempt
def successFullOrder(request):
     if request.method == 'POST':
          payId = request.POST['razorpay_payment_id']
          client = razorpay.Client(auth=("rzp_test_l4eDblehZr7MDi", "ymaImOTAtnz4VoWMZHK9qwOQ"))
          payment_details = client.payment.fetch(payId)

          print(payment_details) 
          print(request.POST)

          payment_info = {
            'orderId': payment_details['order_id'],
            'amount': payment_details['amount'],
            'currency': payment_details['currency'],
            'status': payment_details['status'],
            "product": False,
            "cart": False,
            "totalCost": False,
            "userloca": False
          }

          if request.POST['cartID'] == "":
               productDetails = Product.objects.get(id=request.POST['productID'])

               new_cart = Carts(
                   cartcount = 1,
                   cartUser_id = request.POST['useEmail'],
                   totalAmount = productDetails.price,
                   payment_id = payId,
                   deliveryLoca = UserLoca.objects.get(Q(email_id=request.POST['useEmail'])&Q(address_mode=request.POST['userLocaSize']))
               )
               usercart = UserCart(
                   product = productDetails,
                   usercart = new_cart,
                   )
               productDetails.availability -= 1
               new_cart.save()
               usercart.save()
               productDetails.save()
               payment_info['product'] = productDetails
               payment_info['cart'] = new_cart
               payment_info['totalCost'] = new_cart.totalAmount + 120
               payment_info['userloca'] = new_cart.deliveryLoca
          else:
               cartDetails = Carts.objects.get(id=request.POST['cartID'])
               cartDetails.payment_id = payId
               cartDetails.deliveryLoca = UserLoca.objects.get(Q(email_id=request.POST['useEmail'])&Q(address_mode=request.POST['userLocaSize']))
               for i in cartDetails.usercart_set.all():
                    i.product.availability -= 1
                    i.save()
               cartDetails.save()
               payment_info['cart'] = cartDetails
               payment_info['totalCost'] = cartDetails.totalAmount
               payment_info['userloca'] = cartDetails.deliveryLoca
     return render(request, "successFullOrder.html", payment_info)

def cartCheckOut(request, id):
     client = razorpay.Client(auth=("rzp_test_l4eDblehZr7MDi", "ymaImOTAtnz4VoWMZHK9qwOQ"))
     DATA = {
         "amount": 3999900,
         "currency": "INR",
         "receipt": "receipt#1",
         "notes": {
             "key1": "value3",
             "key2": "value2"
         }
     }
     payment = client.order.create(data=DATA)
     if "newActive" in request.session:
         userLoca = UserLoca.objects.get(Q(email_id=request.user.email)&Q(address_mode=request.session.get('newActive')))
         del request.session['newActive']
     else:
         userLoca = UserLoca.objects.get(Q(email_id=request.user.email)&Q(address_mode=1))
     data = {
        "paymentid":payment['id'],
        "data": Carts.objects.get(id=id),
        "userloca": userLoca,
        "userLocas": UserLoca.objects.filter(email_id=request.user.email),
        "userdata": UserData.objects.get(email_id=request.user.email),
    }
     return render(request, "cartCheckOut.html", data)

def removeFromCart(request):
     if "id" in request.GET:
          cid = request.GET['id']
          usercart = UserCart.objects.get(id=cid)
          usercart.delete()
          cart = Carts.objects.get(cartUser_id=request.user.email)
          if cart.cartcount == 1:
               cart.delete()
          else:
               cart.cartcount -= 1
               cart.save()
     return redirect('cart')


def manageProductsPage(request):
     context = {
          "userdata": UserData.objects.get(email_id=request.user.email),
          "unsold_products": Product.objects.filter(Q(ownerId_id=request.user.email)&Q(availability__gt=0)),
          "sold_products": Product.objects.filter(Q(ownerId_id=request.user.email)&~Q(availability=F('stock')))
     }

     return render(request, "manageProducts.html", context)