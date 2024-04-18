import json
import os
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render, redirect
from .models import UserAuth, UserLoca
from .extraFunctions import *
from ProductApp.models import *
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
from django.core.serializers import serialize
from django.db.models import Q
from ProductApp.views import load_data_from_excel

def homePage(request):
    products = Product.objects.filter(
        is_tested=True,
        is_sold=False,
    ).exclude(biddingprice__is_final=True)

    context = {
        "userinindex": True,
        "products": products,
        "filters": SubCategory.objects.all(),
        "category": '',
        "brand": '',
        "checks": ''
    }
    if request.user.is_authenticated:
        if request.user.UserRole == 1:
            return redirect('adminView')
        elif request.user.UserRole == 3 and not request.user.testerdata.registered_tester:
            return redirect('testerInitial')
        elif request.user.UserRole == 3:
            return redirect('testerdashboard')
        elif request.user.UserRole == 2:
            context['products'] = products.exclude(userauth_id=request.user.email)
        elif request.user.UserRole == 4:
            return redirect('deliveryhubindex')
        
    if request.method == 'POST':
        category = request.POST['category']
        brand = request.POST['brand']
        selected_checkboxes = []
        for key, value in request.POST.items():
            if key.startswith('rating'):
                selected_checkboxes.append(value)

        print(f"POST Category: {category}, {brand}")
        print(f"Checks :{selected_checkboxes}")
        if selected_checkboxes:
            products = products.filter(testerrating__in=selected_checkboxes)
            context['checks'] = selected_checkboxes
        if category != 'all':
            products = products.filter(subcat_id=category)
            context['category'] = category
        if brand != 'all':
            products = products.filter(brand_id=brand)
            context['brand'] = brand

        context['products'] = products
            
    return render(request, "pages/index.html", context)

def register(request):
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        userauth = UserAuth()
        userauth.first_name = request.POST['fname']
        userauth.last_name = request.POST['lname']
        userauth.email = request.POST['email']
        userauth.set_password(request.POST['password'])
        userauth.save()
        login(request, userauth)
        request.method = None
        return redirect('register1')
    else:
        return render(request, "pages/authpages/register.html")
    
def register1(request):
    if request.method == 'POST':
        username_val = request.POST['uname']
        userauth = UserAuth.objects.get(email=request.user.email)
        userauth.username = username_val
        userauth.save()
        login(request, userauth)
        return redirect('home')
    else:
        return render(request, "pages/authpages/register1.html")

def login_view(request):
    # user = UserAuth.objects.get(email="stephinjhonson@gmail.com")
    # user.set_password("Abcd@123")
    # user.save()
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        username_value = request.POST['username']
        password_value = request.POST['password']
        userauth = authenticate(request, username=username_value, password=password_value)
        if userauth is not None:
            login(request, userauth)
            return redirect('home')
        else:
            context = {
                'invalid_credential':'wrong',
                'username': username_value,
                'password': password_value,
            }
            return render(request, 'pages/authpages/login.html', context)
    else:
        return render(request, "pages/authpages/login.html")

def check_user_exists(request):
    customerMail = request.GET.get('email')  # You can also use 'email' if you're checking by email
    data = {
        'exists': UserAuth.objects.filter(email=customerMail).exists()
    }
    return JsonResponse(data)

def check_username_exists(request):
    custUsername = request.GET.get('username')
    data = {
        'exists': UserAuth.objects.filter(username=custUsername).exists()
    }
    return JsonResponse(data)

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def user_Settings(request):
    context = {
        'userinsettings': True,
    }
    return render(request, "pages/authpages/settings.html", context)

def validateSettingsEmail(request):
    customerMail = request.GET.get('email')  # You can also use 'email' if you're checking by email
    excludedData = UserAuth.objects.exclude(email=request.user.email)
    excludedData.filter(email=customerMail).exists()
    data = {
        'exists': excludedData.filter(email=customerMail).exists()
    }
    return JsonResponse(data)

def settingsForm1(request):
    if request.method == 'POST':
        fname = request.POST['fname']
        lname = request.POST['lname']
        email_id = request.POST['email']
        gender = request.POST['gender']
        username = request.POST['username']
        userauth = UserAuth.objects.get(email=request.user.email)
        userauth.first_name = fname
        userauth.last_name = lname
        userauth.email = email_id
        userauth.gender = gender
        userauth.username = username
        userauth.save()
        return redirect('userSettings')
    else:
        return HttpResponse('404 - Server Error')

def settingsForm2(request):
    if request.method == 'POST':
        country = request.POST['country']
        state = request.POST['state']
        city = request.POST['city']
        street = request.POST['streetName']
        address = request.POST['address']
        contact = request.POST['number']

        userloca = UserLoca() # New User Address 
        userloca.userauth = request.user
        userloca.country = country
        userloca.state = state
        userloca.city = city
        userloca.street = street
        userloca.address = address
        userloca.contact_number = contact
        userloca.save()
        return redirect('userSettings')
    else:
        return HttpResponse('4013 - Invalid Request')
    
def settingsForm3(request):
    country = request.POST['country']
    state = request.POST['state']
    city = request.POST['city']
    street = request.POST['streetName']
    address = request.POST['address']
    contact = request.POST['number']
    userloca_id = request.POST['userlocaId']

    userloca = UserLoca.objects.get(id=userloca_id)
    userloca.country = country
    userloca.state = state
    userloca.city = city
    userloca.street = street
    userloca.address = address
    userloca.contact_number = contact
    userloca.save()
    
    return redirect('userSettings')

def settingsForm4(request):
    userdata = UserAuth.objects.get(email=request.user.email)
    if userdata.profilepic:
        image_path = os.path.join('media/', userdata.profilepic.name)
        if os.path.exists(image_path):
            os.remove(image_path)
    photo = request.FILES["img"]
    userdata.profilepic = photo
    userdata.save()
    return redirect('userSettings')

def removeProfilePic(request):
    userdata = UserAuth.objects.get(email=request.user.email)
    image_path = os.path.join('media/', userdata.profilepic.name)
    if os.path.exists(image_path):
        os.remove(image_path)
        userdata.profilepic = None
        userdata.save()
    return redirect('userSettings')

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
        
def removeaddress(request):
    locaId = request.GET['id']
    UserLoca.objects.get(id=locaId).delete()
    return redirect('userSettings')

def setabid(request):
    return HttpResponse("Done")


def leafletMap_view(request):
    return render(request, "pages/siteTester.html")


def saveGeoLoca(request):
    if request.method == 'GET':
        lat = request.GET['lat']
        lng = request.GET['long']
        id = request.GET['id']
        location = UserLoca.objects.get(id=id)
        location.latitude = lat
        location.longitude = lng
        location.save()
        return redirect('userSettings')
    return HttpResponse('No GET Methods Available')
