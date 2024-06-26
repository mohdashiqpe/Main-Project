from django.db import models
from django.contrib.auth.models import AbstractUser

# For Storing User Authentic Data
class UserAuth(AbstractUser): 
    UserRole = models.IntegerField(default=2)
    # 1 For Admin
    # 2 For Customer
    # 3 For Tester
    # 4 For DeliveryAutheror
    email = models.EmailField(primary_key=True, unique=True)
    gender = models.CharField(max_length=10, null=True)
    profilepic = models.ImageField(null=True, blank=True, upload_to="profilepic/")

class UserLoca(models.Model):
    userauth = models.ForeignKey(UserAuth, on_delete=models.CASCADE, null=True)
    country = models.CharField(max_length=255, null=True)
    state = models.CharField(max_length=255, null=True)
    city = models.CharField(max_length=255, null=True)

    contact_number = models.CharField(max_length=12, null=True)

    street = models.CharField(max_length=255, null=True)
    address = models.CharField(max_length=255, null=True)
    is_productloca = models.BooleanField(default=False)

    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)

