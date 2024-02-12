from email.utils import formataddr
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views.decorators.cache import never_cache
from faker import Faker
from UsedStore.settings import EMAIL_HOST_USER
from .ExtraFunction import *
from .models import *
from TesterApp.models import *


fake = Faker()

def showSignUp(request):
    # UserAuth.objects.get(email='tressasajan@gmail.com').delete()
    if request.method == 'POST':
        request.session["fname"] = request.POST['fname']
        request.session['email'] = request.POST['email']
        request.session['password'] = request.POST['password']
        return redirect('signup2')
    elif request.session.get('count', 'None') != 'None':
        del request.session['count']
        context = {
            'warning':'wrong otp'
        }
        return render(request, 'register.html', context)
    else:
        return render(request, 'register.html')
    
def showSignUp2(request):
    if request.method == 'POST' and 'selectedCountry' in request.POST:
        request.session['country'] = request.POST['selectedCountry']
        request.session['state'] = request.POST['selectedState']
        request.session['city'] = request.POST['selectedCity']
        # For Pincode if Inserted
        if 'pincode' in request.POST:
            request.session['pincode'] = request.POST['pincode']
        return redirect('regOtp')
    else:
        return render(request, 'register2.html')

def sendRegOtp(request):
    if request.method == 'POST':
        if request.POST['otp'] == request.session['otp']:
            del request.session['count']

            # Getting Session to Variable and Deleting Session
            username = fake.user_name()
            fname = request.session['fname']
            del request.session['fname']
            email = request.session['email']
            del request.session['email']
            password = request.session['password']
            del request.session['password']
            userauth = UserAuth(username=username, email=email, userRole=2)
            userauth.set_password(password)
            userauth.save()
            # Authentication Data Saved
            if 'country' in request.session:
                country = request.session['country']
                del request.session['country']
                state = request.session['state']
                del request.session['state']
                city = request.session['city']
                del request.session['city']
                userloca = UserLoca(email=userauth, country=country, state=state, city=city)
                userloca.save()
                # Saving Location Data if Given

            # Done
            userdata = UserData(fullname = fname, email=userauth)
            userdata.save()
            # Sending Email After Successfull Registration
            subject = 'Hello, '+ fname
            message = 'Welcome to Z Store\n You have been Successfully Registered Your Account\n Your Username is '+username+'\n You can edit this in your Settings'
            from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
            recipient_list = [email]
            send_mail(subject, message, from_email, recipient_list)
            # End of Mail Service
            login(request, userauth)
            request.session['user_email'] = email
            return redirect('index')
        elif (request.session['count'] < 2):
            request.session['count'] += 1
            context = {
                'message': 'Wrong OTP',
            }
            return render(request, 'registerOtp.html', context)
        else:
            # return HttpResponse('Redirect to Sign Up Page')
            return redirect('signup')
    else:
        request.session['otp'] = generate_otp()
        subject = 'Hello, '+ request.session['fname']
        message = 'Welcome to Z Store\n Here is Your OTP :'+request.session['otp']
        from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
        recipient_list = [request.session['email']]
        send_mail(subject, message, from_email, recipient_list)
        request.session['count'] = 0
        return render(request, 'registerOtp.html')

@never_cache
def showSignIn(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        userauth = authenticate(request, username=username, password=password)
        
        if userauth is not None:
            if TesterInfo.objects.filter(tester_id=userauth.email).exists():
                tester = TesterInfo.objects.get(tester_id=userauth.email)
                if not tester.is_active:
                    login(request, userauth)
                    return redirect('regTester')
                else:
                    login(request, userauth)
                    return redirect('testerPanel')
            else:
                request.session['user_email'] = userauth.email
                login(request, userauth)
                return HttpResponseRedirect(reverse('index'))
        else:
            context = {
                'invalid_credential':'wrong',
            }
            return render(request, 'login.html', context)
    else:
        return render(request, 'login.html')


def check_user_exists(request):
    customerMail = request.GET.get('email')  # You can also use 'email' if you're checking by email
    data = {
        'exists': UserAuth.objects.filter(email=customerMail).exists()
    }
    return JsonResponse(data)

#  To Work with
def deleteUserAccount(request):
    # email = request.GET["email"]
    userA = UserAuth.objects.get(email='hsree524@gmail.com')
    userA.delete()
    # userA.is_active=0
    # return redirect('adminIndex')
    return HttpResponse('Deleted')

def userLogout(request):
    if 'user_email' in request.session:
        del request.session['user_email']
    logout(request)
    return redirect('index')

def checkUserLoggedIn(request):
    previous_url = request.META.get('HTTP_REFERER')
    if request.user.is_authenticated:
        return redirect('index')
    else:
        return redirect(previous_url)
    

def ForgotPassword1(request):
    data = {
        'exists': True,
        'value': False
    }
    if request.method == 'POST':
        email = request.POST['emailid']
        if not UserAuth.objects.filter(email=email).exists():
            data['exists'] = False
            data['value'] = email
        else:
            request.session['otp'] = generate_otp()
            request.session['email'] = email
            usera = UserAuth.objects.get(email=email)

             # Sending Email After Successfull Registration
            subject = 'Hello, '+ usera.username
            message = 'You Password Reset OTP is : '+ request.session['otp']
            from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
            recipient_list = [email]
            send_mail(subject, message, from_email, recipient_list)
            return redirect('OTPConfirmation')
    return render(request, "forgotPassword/forgotPassword1.html", data)

def OTPConfirmation(request):
    if request.method == 'POST':
        if request.POST['otp'] == request.session['otp']:
            del request.session['otp']
            return redirect('forgotPassword2')
        else:
            context = {
                    'message': 'Wrong OTP',
                }
        return render(request, "forgotPassword/otpConfirmation.html", context)
    return render(request, "forgotPassword/otpConfirmation.html")


def forgotPassword2(request):
    if request.method == 'POST':
        updater = UserAuth.objects.get(email=request.session['email'])
        del request.session['email']
        updater.set_password(request.POST['password'])
        updater.save()
        return redirect('signin')
    return render(request, "forgotPassword/forgotPassword2.html")