from django.db import models
from django.contrib.auth.models import AbstractUser

class UserAuth(AbstractUser):
    USER_ROLES = (
        (1, 'Admin'),
        (2, 'User'),
        (3, 'Tester'),
    )

    email = models.EmailField(primary_key=True, unique=True)
    userRole = models.IntegerField(choices=USER_ROLES)

    def __str__(self):
        return self.email

class UserLoca(models.Model):
    email = models.ForeignKey(UserAuth, on_delete=models.CASCADE)
    country = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    street = models.CharField(max_length=200, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    address_mode = models.IntegerField(default=1)


class UserData(models.Model):
    fullname = models.CharField(max_length=140, blank=True)
    email = models.ForeignKey(UserAuth, on_delete=models.CASCADE)
    phoneNumber = models.CharField(max_length=10, blank=True)
    gender = models.CharField(max_length=15, blank=True)
    profileImage = models.ImageField(null=True, blank=True, upload_to="profilepic/")