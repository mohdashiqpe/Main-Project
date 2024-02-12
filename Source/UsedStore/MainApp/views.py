import os
from django.shortcuts import redirect, render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from AuthApp.models import *
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
# from Products.models import Products, Category
from django.db.models import Q
import json
from Products.models import Carts, Category, Main_Category, Product, UserCart
from django.core.serializers import serialize
from TesterApp.models import TesterInfo

@never_cache
def showIndex(request):
    for i in Carts.objects.filter(payment_id__isnull=False):
        i.delete()
    if request.user.is_authenticated and request.user.userRole == 3:
        return redirect('testerPanel')
    # elif request.user.is_authenticated and request.user.userRole == 1:
    #     return redirect('adminPy')

    if request.user.is_authenticated:
        products = Product.objects.filter(Q(TesterId__isnull=False)&~Q(ownerId_id=request.user.email))
    else:
        # Product.objects.all().delete()
        products = Product.objects.filter(TesterId__isnull=False)

    if 'main_category' in request.POST and request.POST['main_category'] != "":
        products = products.filter(mainCategory_id=request.POST['main_category'])

    if 'category' in request.POST and request.POST['category'] != "":
        products = products.filter(category_id=request.POST['category'])

    if 'sub_category' in request.POST and request.POST['sub_category'] != "":
        products = products.filter(subCategory_id=request.POST['sub_category'])

    if 'price_min' in request.POST and request.POST['price_min'] != "":
        range = request.POST['price_min']
        if range == 1:
            products = products.filter(price__lte=1000)
        elif range == 2:
            products = products.filter(Q(price__gte=1000)&Q(price__lte=5000))
        elif range == 3:
            products = products.filter(Q(price__gte=5000)&Q(price__lte=15000))
        elif range == 4:
            products = products.filter(Q(price__gte=15000)&Q(price__lte=100000))
        elif range == 5:
            products = products.filter(price__gte=100000)

    if 'rating_min' in request.POST and request.POST['rating_min'] != "":
        products = products.filter(tester_rating__lte=request.POST['rating_min'])

    context = {
        "products": products,
        "categories": Main_Category.objects.all(),
        "userdata": False,
        "usercart": False,
        "cartcount": False
    }

    if request.user.is_authenticated:
        context['userdata'] = UserData.objects.get(email_id=request.user.email) 
        if Carts.objects.filter(cartUser_id=request.user.email).exists():
            context['usercart'] = Carts.objects.get(cartUser_id=request.user.email)

    return render(request, 'User_Page.html', context)

@login_required
@never_cache
def showSettings(request):
    if request.method == 'POST':
        if 'img' in request.FILES:
            if request.user.userRole == 3:
                userdata = TesterInfo.objects.get(tester_id=request.user.email)
            else:
                userdata = UserData.objects.get(email=request.user.email)
            if userdata.profileImage:
                image_path = os.path.join('media/', userdata.profileImage.name)
                if os.path.exists(image_path):
                    os.remove(image_path)
            photo = request.FILES["img"]
            userdata.profileImage = photo
            userdata.save()
            return redirect('settings')
        else:
            if request.user.userRole == 3:
                userauth = UserAuth.objects.get(email=request.user.email)
                userdata = TesterInfo.objects.get(tester_id=request.user.email)
            else:
                userauth = UserAuth.objects.get(email=request.user.email)
                userdata = UserData.objects.get(email=request.user.email)
            if UserLoca.objects.filter(email=request.user.email).exists():
                userloca = UserLoca.objects.get(email=request.user.email)
                username = request.POST['Username']
                userauth.username = username
                fullname = request.POST['fullname']
                userdata.fullname = fullname
                email = request.POST['email']
                userauth.email = email
                phoneNo = request.POST['number']
                userdata.phoneNumber = phoneNo
                gender = request.POST['gender']
                userdata.gender = gender
                country = request.POST['country']
                userloca.country = country
                state = request.POST['state']
                userloca.state = state
                city = request.POST['city']
                userloca.city = city
                street = request.POST['streetName']
                userloca.street = street
                address = request.POST['address']
                userloca.address = address
                if request.user.userRole == 3:
                    userdata.tester_loca = userloca
                userauth.save()
                userdata.save()
            else:
                username = request.POST['Username']
                userauth.username = username
                email = request.POST['email']
                userauth.email = email
                userauth.save()

                fullname = request.POST['fullname']
                userdata.fullname = fullname
                phoneNo = request.POST['number']
                userdata.phoneNumber = phoneNo
                gender = request.POST['gender']
                userdata.gender = gender
                userdata.save()

                country = request.POST['country']
                state = request.POST['state']
                city = request.POST['city']

                userloca = UserLoca(email=userauth, country=country, state=state, city=city)
                if request.user.userRole == 3:
                    userdata.tester_loca = userloca

            userloca.save()
            return redirect('settings')
    else:
        context = {
                    "userauth": False,
                    "userdata": False,
                    "userloca": False
                }
        if request.user.userRole == 3:
            userauth = UserAuth.objects.get(email=request.user.email)
            userdata = TesterInfo.objects.get(tester_id=request.user.email)
        else:
            userauth = UserAuth.objects.get(email=request.user.email)
            userdata = UserData.objects.get(email=request.user.email)
        if UserLoca.objects.filter(email_id= userauth.email).exists():
            userloca = UserLoca.objects.get(Q(email=userauth)&Q(address_mode=1))
            context['userloca'] = userloca
        context['userauth'] = userauth
        context['userdata'] = userdata
        return render(request, 'settings.html', context)
    
def removeProfilePic(request):
    if request.user.userRole == 3:
        userdata = TesterInfo.objects.get(tester_id=request.user.email)
    else:
        userdata = UserData.objects.get(email=request.user.email)
    image_path = os.path.join('media/', userdata.profileImage.name)
    if os.path.exists(image_path):
        os.remove(image_path)
        userdata.profileImage = None
        userdata.save()
    return redirect('settings')


def validatePassword(request):
    currentPassword = request.GET['password']
    dBData = request.user.password
    passwords_match = check_password(currentPassword, dBData)
    if passwords_match:
        data = {
            'exists': True
        }
    else:
        data = {
            'exists': False
        }
    return JsonResponse(data)

@csrf_exempt
def updatePassword(request):
    if (request.method == 'POST'):
        try:
            data = json.loads(request.body)
            newPassword = data.get('key1')
            userauth = UserAuth.objects.get(email=request.user.email)
            userauth.set_password(newPassword)
            userauth.save()
            login(request, userauth)

            data = {
                'done': True
            }
            return JsonResponse(data)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

# End
# Custom Function Python
# def sortCat(id):
#     catData = {}
#     if Category.objects.filter(Q(catCount__gt=0)&Q(id=id)).exists():
#         cate=Category.objects.filter(Q(catCount__gt=0)&Q(id=id))
#         catData[cate.categoryName] = sortCat(cate[id])
    

# API Fetch for data
# def get_products(request):
#     products = Product.objects.filter(TesterId__isnull=False).values()

#     data = {
#         'products': list(products)
#     }

#     return JsonResponse(data, safe=False)
