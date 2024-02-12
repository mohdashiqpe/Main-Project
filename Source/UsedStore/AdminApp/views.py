from email.utils import formataddr
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from faker import Faker
from django.template.loader import render_to_string
from UsedStore.settings import EMAIL_HOST_USER
from AuthApp.ExtraFunction import *
from Products.models import Product, Main_Category, Sub_Category, Category
from AuthApp.models import *
from TesterApp.models import *
from django.db.models import Q

@login_required
@never_cache
def showAdminPage(request):
    if request.user.userRole != 1:
        return redirect('index')
    users_authData = UserAuth.objects.all()
    usersAuthList= []
    usersDataList= []
    usersLocaList= [] 
    for user in users_authData:
        usersAuthList.append(user)
        users_Data = UserData.objects.filter(email_id=user.email).first()
        users_Loca = UserLoca.objects.filter(email_id=user.email).first()
        usersDataList.append(users_Data)
        usersLocaList.append(users_Loca)
    combined_data = list(zip(usersAuthList, usersDataList, usersLocaList))
    user_data = UserData.objects.get(email=request.user.email)
    user_loca = UserLoca.objects.get(email=request.user.email)
    context = {
        "userData": user_data,
        "UserLoca": user_loca
    }
    return render(request, 'admin_Page.html', {"combined_data": combined_data, "context": context})

def suspendView(request):
    respond_User = request.GET['email']
    user = request.user  # Example user data
    userauth = UserAuth.objects.get(email=respond_User)
    userdata = UserData.objects.get(email=user)
    if userauth.is_active:
        subject = 'Hello, '+userdata.fullname
        message = ""
        from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
        recipient_list = [respond_User]
        userauth.is_active = 0
        data = {
            'user': user,
            'userauth': userdata,
            'message': True,
        }
        html_message = render_to_string('email_template.html', data)
        send_mail(subject, message, from_email, recipient_list, fail_silently=False, html_message=html_message)
    else:
        subject = 'Hello, '+userdata.fullname
        message = "This is the Message from Admin\nYour Account has been released"
        from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
        recipient_list = [respond_User]
        userauth.is_active = 1
        data = {
            'user': user,
            'userauth': userdata,
            'message': False,
        }
        html_message = render_to_string('email_template.html', data)
        send_mail(subject, message, from_email, recipient_list, fail_silently=False, html_message=html_message)
    userauth.save()
    return redirect('adminPy')

@login_required
@never_cache
def addTesterView(request):
    if request.user.userRole != 1:
        return redirect('index')
    if request.method == 'POST':
        username = request.POST['uname']
        email = request.POST['email']
        password = generate_fake_password()
        userauth = UserAuth(username=username, email=email, userRole=3)
        userauth.set_password(password)
        userauth.save()
        tester = userauth
        fullname = username 
        main_cate = request.POST['mc']
        cate = request.POST['c']
        testerinfo = TesterInfo(tester=tester, fullname=fullname, main_cat_id = main_cate, cat_id = cate)
        if 'sc' in request.POST:
            sub_cate = request.POST['sc']
            testerinfo.sub_cat_id = sub_cate
        testerinfo.save()
        income = request.POST['income']
        testerdata = TesterData(tester=testerinfo, income=income)
        testerdata.save()

        data = {
            "username": username,
            "password": password
        }
        html_message = render_to_string('addTesterEmail.html', data)
        subject = 'Welcome to Z-Store Family'
        message = ""
        from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
        recipient_list = [email]
        send_mail(subject, message, from_email, recipient_list, fail_silently=False, html_message=html_message)

        return redirect('addTester')
    else:
        testers = TesterInfo.objects.all()
        data = {
            "testers": testers
        }
        return render(request, 'addTester.html', data)
    