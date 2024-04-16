from django.http import Http404
from django.shortcuts import render, redirect, HttpResponse
from email.utils import formataddr
from django.core.mail import send_mail
from AutoByte.settings import EMAIL_HOST_USER
from .models import *
from ExtraFunctions import *
from django.contrib.auth import login
from math import radians, sin, cos, sqrt, atan2
from django.db.models import Q
from django.contrib import messages
from LandingApp.models import UserLoca

def delivery_man_sign_up_view(request):
    return render(request, "pages/deliverymanPages/deliverymanSignUp.html")


def addUnitAutheror_view(request):
    authorisers = DeliveryBoy.objects.all()
    context = {
        "useratautheror": True,
        "authorisers": authorisers
    }
    return render(request, "pages/deliverymanPages/addUnitAutheror.html", context)

def addAutheror_view(request):
    if request.method == 'POST':
        country = request.POST['country']
        state = request.POST['state']
        city = request.POST['city']
        lat = request.POST['lat']
        lng = request.POST['lng']
        firstname = request.POST['firstname']
        lastname = request.POST['lastname']
        email = request.POST['email']
        salary = request.POST['salary']
        username = generate_username(firstname, lastname)
        password = generate_fake_password()
        print(f"Username: {username}, Password: {password}")

        userauth = UserAuth()
        userauth.first_name = firstname
        userauth.last_name = lastname
        userauth.UserRole = 4
        userauth.email = email
        userauth.username = username
        userauth.set_password(password)
        userauth.save()

        userloca = UserLoca()
        userloca.userauth = userauth
        userloca.country = country
        userloca.state = state
        userloca.city = city
        userloca.longitude = lng
        userloca.latitude = lat
        userloca.save()

        delivery_boy = DeliveryBoy()
        delivery_boy.user_auth = userauth
        delivery_boy.user_loca = userloca
        delivery_boy.salary = salary
        delivery_boy.current_lat = userloca.latitude
        delivery_boy.current_lng = userloca.longitude
        delivery_boy.save()

        subject = 'Hello, '+ firstname + ' ' + lastname
        message = 'Welcome to Z Store\n We have been Successfully Registered Your Account\n Your Username is '+username+'\n Your Password is'+password
        from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
        recipient_list = [email]
        send_mail(subject, message, from_email, recipient_list)

        return redirect('addUnitAutheror')
    else:
        return HttpResponse("No POSTING")
    

def deliveryHubIndex_view(request):
    if request.user.deliveryboy.is_approved:
        print("Site in Working Condition")
    else:
        return redirect('initiator')
    

    userauth = UserAuth.objects.get(email=request.user.email)
    delivery_chart = DeliveryChart.objects.filter(source_loc__city=userauth.userloca_set.first().city).exclude(Q(rejected_boys=userauth.deliveryboy))
    delivery_chart = delivery_chart.exclude(is_comleted=True)

    completed = DeliveryChart.objects.filter(Q(deliveryboy=userauth.deliveryboy) & Q(is_comleted=True))

    context = {
        "user_in_deliveryhub": True,
        "orders": delivery_chart,
        "completeds": completed
    }
    return render(request, "pages/deliverymanPages/deliveryhub.html", context)


def initiator_view(request):
    return render(request, "pages/deliverymanPages/initiatorpage.html")

def updateauth_view(request):
    username = request.POST['username']
    password = request.POST['password']
    userauth = UserAuth.objects.get(email=request.user.email)
    userauth.username = username
    userauth.set_password(password)
    userauth.save()

    delivery_boy = DeliveryBoy.objects.get(user_auth=userauth)
    delivery_boy.is_approved = True
    delivery_boy.save()
    
    login(request, userauth)
    return redirect('deliveryhubindex')


# def assignDeliverChart():
#     orders = Orders.objects.all()

#     for order in orders:
#         delivery_loca1 = DeliveryLocation()
#         delivery_loca1.country = order.userloca.country
#         delivery_loca1.state = order.userloca.state
#         delivery_loca1.city = order.userloca.city
#         delivery_loca1.latitude = order.userloca.latitude
#         delivery_loca1.longitude = order.userloca.longitude
#         delivery_loca1.contact_number = order.userloca.contact_number
#         delivery_loca1.save()
#         print(f"Lat: {delivery_loca1.latitude}, Lng: {delivery_loca1.longitude}")
#         print(f"Username: {order.buyer.username}")


#         delivery_loca2 = DeliveryLocation()
#         delivery_loca2.country = order.product.loca.country
#         delivery_loca2.state = order.product.loca.state
#         delivery_loca2.city = order.product.loca.city
#         delivery_loca2.latitude = order.product.loca.latitude
#         delivery_loca2.longitude = order.product.loca.longitude
#         delivery_loca2.contact_number = order.product.loca.contact_number
#         delivery_loca2.save()
#         print(f"Lat: {delivery_loca2.latitude}, Lng: {delivery_loca2.longitude}")
#         print(f"Username: {order.userloca.userauth.username}")

#         delivery_chart = DeliveryChart()
#         delivery_chart.source_loc = delivery_loca2
#         delivery_chart.destination_loc = delivery_loca1
#         delivery_chart.order = order
#         delivery_chart.save()

def delivery_accepted_view(request, id):
    userauth = DeliveryBoy.objects.get(user_auth=request.user)
    delivery_chart = DeliveryChart.objects.get(id=id)
    order = Orders.objects.get(id=delivery_chart.order.id)
    delivery_chart.deliveryboy = userauth
    delivery_chart.progress = "Out for Pick Up"
    delivery_chart.progress_perc = 25
    delivery_chart.save()

    order.order_status = "Out for Pick Up"
    order.save()

    subject = 'Hello, '+ delivery_chart.order.product.userauth.first_name + ' ' + delivery_chart.order.product.userauth.last_name
    message = f'Your Order has been Out to taken by our delivery boy {userauth.user_auth.first_name} {userauth.user_auth.last_name} .'
    from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
    recipient_list = [delivery_chart.order.product.userauth.email]
    send_mail(subject, message, from_email, recipient_list)

    return redirect('deliveryhubindex')

def delivery_rejected_view(request, id):
    userauth = DeliveryBoy.objects.get(user_auth=request.user)
    delivery_chart = DeliveryChart.objects.get(id=id)
    delivery_chart.rejected_boys.add(userauth)
    delivery_chart.save()
    return redirect('deliveryhubindex')

def gen_otp_views(request, id):
    delivery_chart = DeliveryChart.objects.get(id=id)
    otp = generate_otp()
    request.session['otp'] = otp
    print(request.session['otp'])

    subject = 'Hello, '+ delivery_chart.order.product.userauth.first_name + ' ' + delivery_chart.order.product.userauth.last_name
    message = f'OTP for Your delivery Take is {otp}'
    from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
    recipient_list = [delivery_chart.order.product.userauth.email]
    send_mail(subject, message, from_email, recipient_list)
    
    return redirect('deliveryhubindex')

def validate_otp(request, id):
    otp = request.POST['otp']
    print(request.session['otp'])
    if otp == request.session['otp']:
        delivery_chart = DeliveryChart.objects.get(id=id)
        delivery_chart.progress = f"Product Picked from {delivery_chart.order.product.userauth.first_name} {delivery_chart.order.product.userauth.last_name}"
        delivery_chart.progress_perc += 25
        delivery_chart.save()

        delivery_boy = DeliveryBoy.objects.get(id=delivery_chart.deliveryboy.pk)
        delivery_boy.current_lat = delivery_chart.source_loc.latitude
        delivery_boy.current_lng = delivery_chart.source_loc.longitude
        delivery_boy.save()

        del request.session['otp']
        order = Orders.objects.get(id=delivery_chart.order.id)
        order.order_status = f"Product Picked from {delivery_chart.order.product.userauth.first_name} {delivery_chart.order.product.userauth.last_name}"
        order.save()

        subject = 'Hello, '+ delivery_chart.order.buyer.first_name + ' ' + delivery_chart.order.buyer.last_name
        message = f'Your Product has been shipped from {delivery_chart.source_loc.city}'
        from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
        recipient_list = [delivery_chart.order.buyer.email]
        send_mail(subject, message, from_email, recipient_list)
        return redirect('deliveryhubindex')
    else:
        messages.warning(request, 'Invalid OTP')
        return redirect('deliveryhubindex')

def gen_otp1_views(request, id):
    delivery_chart = DeliveryChart.objects.get(id=id)
    otp1 = generate_otp()
    request.session['otp1'] = otp1
    print(request.session['otp1'])

    subject = 'Hello, '+ delivery_chart.order.buyer.first_name + ' ' + delivery_chart.order.buyer.last_name
    message = f'OTP for Your delivery Take is {otp1}'
    from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
    recipient_list = [delivery_chart.order.buyer.email]
    send_mail(subject, message, from_email, recipient_list)

    return redirect('deliveryhubindex')


def validate_otp1(request, id):
    otp = request.POST['otp']
    print(request.session['otp1'])
    if otp == request.session['otp1']:
        delivery_chart = DeliveryChart.objects.get(id=id)
        delivery_chart.progress = f"Successfully Delivered"
        delivery_chart.progress_perc += 50
        delivery_chart.is_comleted = True
        delivery_chart.save()

        delivery_boy = DeliveryBoy.objects.get(id=delivery_chart.deliveryboy.pk)
        delivery_boy.current_lat = delivery_chart.destination_loc.latitude
        delivery_boy.current_lng = delivery_chart.destination_loc.longitude
        delivery_boy.save()

        del request.session['otp1']
        order = Orders.objects.get(id=delivery_chart.order.id)
        order.order_status = delivery_chart.progress
        order.save()

        subject = 'Hello, '+ delivery_chart.order.buyer.first_name + ' ' + delivery_chart.order.buyer.last_name
        message = f'Your Product has been Successfully delivered {delivery_chart.source_loc.city}'
        from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
        recipient_list = [delivery_chart.order.buyer.email]
        send_mail(subject, message, from_email, recipient_list)
        return redirect('deliveryhubindex')
    else:
        messages.warning(request, 'Invalid OTP')
        return redirect('deliveryhubindex')