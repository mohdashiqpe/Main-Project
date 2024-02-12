from django.db import models
from AuthApp.models import UserAuth, UserLoca
from Products.models import Product, Main_Category, Category, Sub_Category

 
class TesterInfo(models.Model):
    is_active = models.BooleanField(default=False)
    tester_loca = models.ForeignKey(UserLoca, on_delete=models.CASCADE, null=True)
    tester = models.ForeignKey(UserAuth, on_delete=models.CASCADE, null=True, related_name='tester_info')
    fullname = models.CharField(max_length=100, null=True)
    gender = models.CharField(max_length=20, null=True)
    phoneNumber = models.CharField(max_length=14, null=True)
    profileImage = models.ImageField(upload_to='Testers', null=True)
    education = models.CharField(max_length=100, null=True)
    main_cat = models.ForeignKey(Main_Category, on_delete=models.CASCADE, null=True)
    cat = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    sub_cat = models.ForeignKey(Sub_Category, on_delete=models.CASCADE, null=True)

class TesterData(models.Model):
    tester = models.ForeignKey(TesterInfo, on_delete=models.CASCADE, null=True)
    income = models.BigIntegerField(null=True)
    experiance = models.IntegerField(null=True)
    visits = models.IntegerField(null=True)
    rating = models.IntegerField(default=0)

class TesterReport(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    tester = models.ForeignKey(TesterInfo, on_delete=models.CASCADE, null=True)
    action = models.CharField(max_length=100, null=True)
    acknowledgment = models.CharField(max_length=100, null=True)

class TesterImages(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    tester = models.ForeignKey(TesterInfo, on_delete=models.CASCADE, null=True)
    images = models.ImageField(upload_to='Testers_Products_Images', null=True) 