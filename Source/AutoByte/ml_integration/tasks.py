from __future__ import absolute_import, unicode_literals
from ProductApp.models import *
from celery import shared_task
from .views import *

@shared_task
def check_to_train():
    if Product.objects.all().count() < 10:
        print("No Training Required")
    elif Product.objects.filter(itemTrained=False).exists():
        product = Product.objects.filter(itemTrained=False).first()
        product.itemTrained = True
        product.save()
        print("Training Required")
        train_model()
    else:
        print("Model Trained")
