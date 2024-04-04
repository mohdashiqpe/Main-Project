import os
from django.db import models
from LandingApp.models import *
from AdminApp.models import *
from TesterApp.models import *
from django.conf import settings

class Product(models.Model):
    # Product Authenticity
    userauth = models.ForeignKey(UserAuth, on_delete=models.CASCADE, null=True, limit_choices_to={'UserRole': 2}, related_name='product')
    tester = models.ForeignKey(UserAuth, on_delete=models.CASCADE, limit_choices_to={'UserRole': 3}, null=True, related_name='tester')
    loca = models.ForeignKey(UserLoca, on_delete=models.CASCADE, null=True)
    # Product Conditions
    is_sold = models.BooleanField(default=False)
    is_tested = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    # Product Categories
    maincat = models.ForeignKey(MainCategory, on_delete=models.CASCADE, null=True)
    subcat = models.ForeignKey(SubCategory, on_delete=models.CASCADE, null=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, null=True)
    # About Product 
    YearOfMan = models.DateField(null=True) 
    name = models.CharField(max_length=255, null=True)
    accidents = models.CharField(max_length=255, null=True)
    description = models.CharField(max_length=255, null=True)
    # Pricing
    baseprice = models.IntegerField(default=0)
    autobidding = models.BooleanField(default=True)
    testerrating = models.IntegerField(default=0)
    # Bidding End Time
    enddatetime = models.DateTimeField(null=True)
    listedtime = models.DateTimeField(null=True)
    # On Sales data
    sold_to = models.ForeignKey(UserAuth, on_delete=models.CASCADE, null=True, related_name='sold_to')
    sold_at_datetime = models.DateTimeField(null=True)

class BiddingPrice(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    bidding_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    userauth = models.ForeignKey(UserAuth, on_delete=models.CASCADE, null=True)
    is_final = models.BooleanField(default=False)

def product_image_path(instance, filename):
    return f'products/{instance.product.name}({instance.product.id})/{filename}'

class ProductImages(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    images = models.ImageField(upload_to=product_image_path, null=True, blank=True)
    is_testerimage = models.BooleanField(default=False)

