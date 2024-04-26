from email.utils import formataddr
from django.http import JsonResponse
from django.core.serializers import serialize
from django.shortcuts import render, redirect, HttpResponse
from django.core.mail import send_mail
from AutoByte.settings import EMAIL_HOST_USER
from .models import MainCategory, SubCategory, Brand
from TesterApp.models import TesterData, TesterServices
from LandingApp.models import UserAuth, UserLoca
from ExtraFunctions import *
from ProductApp.models import *
from CartApp.models import *
from DeliveryApp.models import *
from django.db.models import Q, Count, Sum

def adminView(request):
    context = {
        "inadminview": True,
        "usersCount": UserAuth.objects.filter(UserRole=2).count(),
        "ordersCount": Orders.objects.all().count(),
        "ordersworth": Orders.objects.aggregate(total_amount=Sum('amount'))['total_amount'] or 0,
        "testersCount": UserAuth.objects.filter(UserRole=3).count(),
        "testerserv": TesterServices.objects.all().count(),
        "deliverycount": UserAuth.objects.filter(UserRole=4).count(),
        "deliveryserv": DeliveryChart.objects.all().count(),
    }
    if not request.user.is_authenticated:
        return redirect('login')
    if not request.user.UserRole == 1:
        return redirect('home')
    return render(request, "pages/adminpages/adminindex.html", context)

def addtesterview(request):
    # UserAuth.objects.get(email="tressasaja@gmail.com").delete()
    if request.method == 'POST':
        firstname = request.POST['fname']
        lastname = request.POST['lname']
        email = request.POST['email']
        country = request.POST['country']
        state = request.POST['state']
        city = request.POST['city']
        maincategory = request.POST['mc']
        subcategory = request.POST['c']
        annualincome = request.POST['income']
        username = generate_username(firstname, lastname)
        password = generate_fake_password()
        userauth = UserAuth()
        userauth.first_name = firstname
        userauth.last_name = lastname
        userauth.email = email
        userauth.username = username
        userauth.set_password(password)
        userauth.UserRole = 3
        userauth.save()

        userloca = UserLoca()
        userloca.country = country
        userloca.state = state
        userloca.city = city
        userloca.userauth = userauth
        userloca.save()
        print(username, password)

        testerdata = TesterData()
        testerdata.maincategory_id = maincategory
        testerdata.subcategory_id = subcategory
        testerdata.salary = annualincome
        testerdata.userauth = userauth
        testerdata.save()

        subject = 'Hello, '+ firstname + ' ' + lastname
        message = 'Welcome to Z Store\n We have been Successfully Registered Your Account\n Your Username is '+username+'\n Your Password is'+password
        from_email = formataddr(('Z-Store', EMAIL_HOST_USER))
        recipient_list = [email]
        send_mail(subject, message, from_email, recipient_list)
        return redirect('addtester')
        # return HttpResponse(country)
    else:
        context = {
            "ataddtesterview": True,
            "testers": UserAuth.objects.filter(UserRole=3),
        }
        return render(request, "pages/adminpages/addtester.html", context)

def addcategoryview(request):
    SubCategory.objects.filter(name="TVs").delete()
    context = {
        "inaddcategory": True,
        "mainCat": MainCategory.objects.all()
    }
    return render(request, "pages/adminpages/addcategory.html", context)

def loadCategories(request):
    data = {
        "cat": False
    }
    if MainCategory.objects.all().exists():
        main_categories = MainCategory.objects.values()
        data['cat'] = list(main_categories)
    return JsonResponse(data)

def loadSubCategory(request):
     data = { 
          "scat": False
     }
     mcatId = request.GET['id']
     mcat = MainCategory.objects.get(id=mcatId)

     if SubCategory.objects.filter(maincategory=mcat).exists():
        data['scat'] = list(SubCategory.objects.filter(maincategory=mcat).values())
     return JsonResponse(data)

def loadSubSUbCategory(request):
     data = {
          "sscat": False
     }
     catid = request.GET['id']
     print(catid)
     if Brand.objects.filter(subcategory_id = catid).exists():
          sscat = Brand.objects.filter(subcategory_id = request.GET['id']).values()
          data['sscat'] = list(sscat)
     return JsonResponse(data)

def checkCatExists(request):
    data = {
        "exists": False
    }
    checkData = request.GET.get('cat')
    if MainCategory.objects.filter(name=checkData).exists():
         data['exists'] = True
    if SubCategory.objects.filter(name=checkData).exists():
         data['exists'] = True
    if Brand.objects.filter(name=checkData).exists():
         data['exists'] = True
    return JsonResponse(data)

def addMainCategoryForm(request):
    if request.method == 'POST':
        categoryName = request.POST['mainCat']
        maincategory = MainCategory()
        maincategory.name = categoryName
        maincategory.save()
        return redirect('addCategory')
    else:
        return HttpResponse('401 - Unauthorised Access')
    
def addSubCategoryForm(request):
    if request.method == 'POST':
        maincategory = request.POST['mcatid']
        categoryname = request.POST['cat']
        subcategory = SubCategory()
        subcategory.maincategory_id = maincategory
        subcategory.name = categoryname
        subcategory.save()
        return redirect('addCategory')
    else:
        return HttpResponse('401 - Unauthorised Access')
    
def addBrandForm(request):
    if request.method == 'POST':
        categoryname = request.POST['subCat']
        subcategoryid = request.POST['catid']
        subcategory = SubCategory.objects.get(id=subcategoryid)
        brand = Brand()
        brand.maincategory = subcategory.maincategory
        brand.subcategory = subcategory
        brand.name = categoryname
        brand.save()
        return redirect('addCategory')
    else:
        return HttpResponse('401 - Unauthorised Access')
    
import datetime
def manageproduct(request):
    unmanaged = Product.objects.filter(Q(is_tested=False) & Q(tester_id__isnull=True))
    managed = Product.objects.filter(Q(tester_id__isnull=False))
    product_testers_dict = {}
        
    # tester_Info_data = {}
    testerInfoList = []

    for product in unmanaged:
        testerInfoList = TesterData.objects.filter(Q(userauth__userloca__city=product.loca.city) & Q(subcategory=product.subcat))  
        product_testers_dict[product] = testerInfoList
        testerInfoList = []  # Emptying the list
        # product_testers_dict[product] = list(testers)

        

    context = {
        "product_testers_dict": product_testers_dict,
        "managedProducts": managed, 
        "useratmanageproduct": True
    }
    return render(request, "pages/adminpages/productmanage.html", context)

def identify_available_dates(request):
    tester_id = request.GET['email']
    tester = TesterData.objects.get(userauth_id=tester_id)
    if tester.testerservices_set.exists():
        available_dates = tester.testerservices_set.values_list('dates', flat=True)
    else:
        available_dates = False
    data = {
        "data": available_dates
    }
    return JsonResponse(data)

def allocateTester(request):
    tester_email = request.POST.get("testerid")
    product_code = request.POST.get("productId")
    test_date = request.POST.get('datere')
    test_time = request.POST.get('testtime')
    tester_data = TesterData.objects.get(userauth_id=tester_email)
    print(tester_data)
    tester_data.workcount += 1
    tester_data.save()

    product = Product.objects.get(id=product_code)
    product.tester_id = tester_email

    tester_service = TesterServices()
    tester_service.testerdata = tester_data
    tester_service.testdate = test_date
    tester_service.testtime = test_time
    tester_service.product = product
    tester_service.save()
    product.save()
    return redirect('manageproduct')

def deliveryMan_view(request):
    context = {
        "userInSalesPage": True,
    }
    return render(request, "pages/salesPages/salesData.html", context)

def manageTA_view(request):
    context = {
        "userinTA": True,
        "usersdata": UserAuth.objects.filter(UserRole=2),
        "testerdata": TesterData.objects.all(),
        "deliverdata": UserAuth.objects.filter(UserRole=4)
    }
    if request.user.is_authenticated:
        if request.user.UserRole != 1:
            return redirect('home')
    elif not request.user.is_authenticated:
        return redirect('login')
    return render(request, "pages/adminpages/manageTA.html", context)


def fetchChartData(request):
    onCategory = SubCategory.objects.annotate(product_count=Count('product'))
    
    # Create a list to store data for each SubCategory
    data = []
    
    # Iterate over each SubCategory
    for category in onCategory:
        # Create a dictionary to store data for the current SubCategory
        category_data = {
            'id': category.id,
            'name': category.name,
            'product_count': category.product_count
        }
        data.append(category_data)  # Add the dictionary to the list
    
    # Serialize the data and return JSON response
    return JsonResponse(data, safe=False)


def fetchChartData_view(request):
    onCategory = Brand.objects.annotate(product_count=Count('product'))
    
    # Create a list to store data for each SubCategory
    data = []
    
    # Iterate over each SubCategory
    for category in onCategory:
        # Create a dictionary to store data for the current SubCategory
        category_data = {
            'id': category.id,
            'name': category.name,
            'product_count': category.product_count
        }
        data.append(category_data)  # Add the dictionary to the list
    
    # Serialize the data and return JSON response
    return JsonResponse(data, safe=False)