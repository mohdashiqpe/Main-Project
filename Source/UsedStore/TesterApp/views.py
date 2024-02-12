from datetime import datetime
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from AuthApp.models import UserAuth, UserData, UserLoca
from Products.models import Product
from TesterApp.models import TesterData, TesterImages, TesterInfo, TesterReport
from django.contrib.auth import login
from django.db.models import Q
# from Products.models import Products

@login_required
@never_cache
def TesterRegView(request):
    if request.user.userRole != 3:
        return redirect('index')
    if request.method == 'POST':
        teste = TesterInfo.objects.get(tester_id=request.user.email)
        userauth = UserAuth.objects.get(email=request.user.email)
        password = request.POST['password']
        teste.is_active = True
        userauth.set_password(password)
        userauth.save()
        teste.save()
        login(request, userauth)
        return redirect('testerPanel')
    testerData = TesterInfo.objects.get(tester_id=request.user.email)
    data = {
        "testerdata": testerData
    }
    return render(request, 'testerReg.html', data)

@login_required
@never_cache
def TesterPanelView(request):
    if not UserLoca.objects.filter(email_id = request.user.email).exists():
        return redirect('settings')
    request.session['user_email'] = request.user.email
    userdata = TesterInfo.objects.get(tester_id=request.user.email)
    testerData = TesterData.objects.get(tester=userdata)
    data = {
        "data": testerData,
        "uprod": False,
        "prod": False
    }
    if Product.objects.filter(TesterId_id__isnull=True).exists():
        data['uprod'] = Product.objects.filter(TesterId_id__isnull=True)
    if Product.objects.filter(TesterId_id__isnull=False).exists():
        data['prod'] = Product.objects.filter(TesterId_id=request.user.email)
    return render(request, 'testerPanel.html', data)

def approveProduct(request, product_id):
    product = Product.objects.get(id=product_id)
    if request.POST.get('priceSel{}'.format(product_id))=="1":
        product.price = request.POST.get('price{}'.format(product_id))
    if request.POST.get('descSel{}'.format(product_id))=="1":
        product.description = request.POST.get('desc{}'.format(product_id))
    if request.POST.get('accSel{}'.format(product_id))=="1":
        product.description = request.POST.get('acc{}'.format(product_id))
    if request.POST.get('man{}'.format(product_id))=="1":
        product.description = datetime.strptime(request.POST.get('datePicker{}'.format(product_id)), "%Y-%m-%d").date()
    images = request.FILES.getlist('productImg{}'.format(product_id))
    product.tester_rating = request.POST.get('rating{}'.format(product_id))

    product.TesterId = UserAuth.objects.get(email=request.user.email)
    for image in images:
            TesterImages.objects.create(
                product=product, 
                tester = TesterInfo.objects.get(tester_id = request.user.email), 
                images=image)
            
    product.save()
    return redirect('testerPanel')


