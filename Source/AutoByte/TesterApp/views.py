from django.shortcuts import render, HttpResponse, redirect
from LandingApp.models import UserAuth, UserLoca
from django.contrib.auth import login
from .models import TesterData
from ProductApp.models import *
from TesterApp.models import *
from django.db.models import Q
from datetime import date, time, datetime


def testerInitialView(request):
    if request.method == 'POST': 
        username = request.POST['username']
        contact = request.POST['number']
        password = request.POST['password']
        userauth = UserAuth.objects.get(email=request.user.email)
        userauth.username = username
        userauth.set_password(password)
        userauth.save()
        userloca = UserLoca.objects.get(userauth_id=userauth.email)
        userloca.contact_number = contact
        userloca.save()
        testerdata = TesterData.objects.get(userauth_id=request.user.email)
        testerdata.registered_tester = True
        testerdata.save()
        login(request, userauth)
        return redirect('testerdashboard')
    return render(request, "pages/testerpages/testerini.html")


def testerdashboardview(request):
    unverified = Product.objects.filter(Q(tester_id=request.user.email) & Q(is_tested=False))
    verified = Product.objects.filter(Q(tester_id=request.user.email) & Q(is_tested=True))
    context = {
        "unverified": unverified,
        "verified" : verified,
        "testerdashboard": True
    }
    return render(request, "pages/testerpages/testerdashboard.html", context)

def updatequalitycheck(request):
    product_id = request.GET['id']
    testerservices = TesterServices.objects.get(product_id=product_id)
    testerdata = TesterData.objects.get(userauth_id=request.user.email)
    product = Product.objects.get(id=product_id)

    # Fetching Selectors
    basepricesel = request.POST["priceSel"+product_id]
    descripsel = request.POST["descSel"+product_id]
    accsel = request.POST['accSel'+product_id]
    mansel = request.POST["man"+product_id]
    images = request.FILES.getlist("productImg"+product_id)
    qualityrating = request.POST["rating"+product_id]

    # Fetching Values
    priceval = request.POST["price"+product_id]
    descval = request.POST["desc"+product_id]
    accval = request.POST["acc"+product_id]
    manval = request.POST["datePicker"+product_id]

    # Select Condition Check
    if basepricesel == "1":
        print("Base Price:"+priceval)
        product.baseprice = priceval
    if descripsel == "1":
        print("Description:"+descval)
        product.description = descval
    if accsel == "1":
        print("Accidents"+accval)
        product.accidents = accval
    if mansel == "1":
        print("Year Of Man"+manval)
        product.YearOfMan = manval

    product.testerrating = qualityrating
    product.is_tested = True
    product.listedtime = datetime.now()
    product.save()

    # Update TesterCount
    testerdata.workcount -= 1
    testerdata.save()

    testerservices.completed_date = date.today()
    testerservices.completed_time = datetime.now().time()
    testerservices.save()

    for image in images:
        productimg = ProductImages()
        productimg.product = product
        productimg.images = image
        productimg.is_testerimage = True
        productimg.save()

    return redirect('testerdashboard')