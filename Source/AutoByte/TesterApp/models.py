from django.db import models
from LandingApp.models import UserAuth, UserLoca
from AdminApp.models import MainCategory, SubCategory
from ProductApp.models import Product

class TesterData(models.Model):
    userauth = models.OneToOneField(UserAuth, on_delete=models.CASCADE, null=True)
    experience = models.IntegerField(default=0)
    avg_rating = models.IntegerField(default=0)
    workcount = models.IntegerField(default=0)
    maincategory = models.ForeignKey(MainCategory, on_delete=models.CASCADE, null=True)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, null=True)
    salary = models.IntegerField(default=0)
    registered_tester = models.BooleanField(default=False)

class TesterServices(models.Model):
    testerdata = models.ForeignKey(TesterData, on_delete=models.CASCADE, null=True)
    testdate = models.DateField(null=True)
    testtime = models.TimeField(null=True)
    completed_date = models.DateField(null=True)
    completed_time = models.TimeField(null=True)
    product = models.OneToOneField(Product, on_delete=models.CASCADE, null=True) 