from django.db import models
from LandingApp.models import *
from CartApp.models import *

class DeliveryBoy(models.Model):
    user_auth = models.OneToOneField(UserAuth, on_delete=models.CASCADE, null=True) # Delivery Man Authentication Data
    user_loca = models.ForeignKey(UserLoca, on_delete=models.CASCADE, null=True) # Delivery Man Location
    salary = models.IntegerField(default=0)
    current_lat = models.DecimalField(max_digits=9, decimal_places=6)
    current_lng = models.DecimalField(max_digits=9, decimal_places=6)
    is_approved = models.BooleanField(default=False) 


class DeliveryLocation(models.Model):
    country = models.CharField(max_length=255, null=True)
    state = models.CharField(max_length=255, null=True)
    city = models.CharField(max_length=255, null=True)
    contact_number = models.CharField(max_length=12, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)


class DeliveryChart(models.Model):
    source_loc = models.OneToOneField(DeliveryLocation, on_delete=models.CASCADE, null=True, related_name='source_loc')
    destination_loc = models.OneToOneField(DeliveryLocation, on_delete=models.CASCADE, null=True, related_name='destination_loc')
    deliveryboy = models.ForeignKey(DeliveryBoy, on_delete=models.CASCADE, null=True)
    progress = models.CharField(max_length=255, null=True)
    order = models.OneToOneField(Orders, on_delete=models.CASCADE, null=True)
    is_comleted = models.BooleanField(default=False)
    progress_perc = models.IntegerField(default=0)
    rejected_boys = models.ManyToManyField(DeliveryBoy, related_name='rejected_boys')