from django.db import models
# from TesterApp.models import TesterData
from AuthApp.models import UserLoca, UserData, UserAuth
# from TesterApp.models import TesterReport

#############################################################################################################################################################
########################################################## Category Models Set ##############################################################################
#############################################################################################################################################################
class Main_Category(models.Model):
    name = models.CharField(max_length=100, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    count = models.IntegerField(default=0)


class Category(models.Model):
    mcategoryId = models.ForeignKey(Main_Category, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=100, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    count = models.IntegerField(default=0)


class Sub_Category(models.Model):
    categoryId = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, related_name='subcategories')
    name = models.CharField(max_length=100, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    count = models.IntegerField(default=0)

#############################################################################################################################################################
########################################################## End of Category Models Set #######################################################################
#############################################################################################################################################################

#############################################################################################################################################################
########################################################## Product Models Set ###############################################################################
#############################################################################################################################################################

class Product(models.Model):
    mainCategory = models.ForeignKey(Main_Category, on_delete=models.CASCADE, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    subCategory = models.ForeignKey(Sub_Category, on_delete=models.CASCADE, null=True)

    # Product Data
    name = models.CharField(max_length=100, null=True)
    price = models.BigIntegerField(null=True)
    stock = models.BigIntegerField(null=True)
    Acc_remarks = models.TextField(null=True)
    description = models.TextField(null=True)
    yearOfMan = models.DateField(null=True)
    availability = models.IntegerField(null=True)
     
    # Product Auth Data
    productLoca = models.ForeignKey(UserLoca, on_delete=models.CASCADE, null=True, blank=True)
    ownerId = models.ForeignKey(UserAuth, on_delete=models.CASCADE, null=True)
    TesterId = models.ForeignKey(UserAuth, on_delete=models.CASCADE, limit_choices_to={'userRole': 3}, null=True, related_name='testerid')
    tester_rating = models.IntegerField(null=True)

class ProductImages(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    images = models.ImageField(upload_to='products/', null=True, blank=True)


class ProductAddOn(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    action = models.CharField(max_length=200, null=True)
    remarks = models.CharField(max_length=200, null=True)
 
class Carts(models.Model):
    cartcount = models.IntegerField()
    cartUser = models.ForeignKey(UserAuth, on_delete=models.CASCADE, null=True)
    totalAmount = models.BigIntegerField(null=True)
    deliveryLoca = models.ForeignKey(UserLoca, on_delete=models.CASCADE, null=True)
    payment_id = models.CharField(max_length=255, null=True)

class UserCart(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    usercart = models.ForeignKey(Carts, on_delete=models.CASCADE, null=True)
    


