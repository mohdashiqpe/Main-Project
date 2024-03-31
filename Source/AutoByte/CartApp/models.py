from django.db import models
from ProductApp.models import *

class Cart(models.Model):
    totalAmount = models.IntegerField(null=True)
    userauth = models.ForeignKey(UserAuth, on_delete=models.CASCADE, null=True)

class CartItems(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, null=True)

class Orders(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    userloca = models.ForeignKey(UserLoca, on_delete=models.CASCADE, null= True)
    orderdatetime = models.DateTimeField(auto_now_add=True)
    order_status = models.CharField(max_length=20, default='pending')
    amount = models.IntegerField(null=True)
    buyer = models.ForeignKey(UserAuth, on_delete=models.CASCADE, null=True)
