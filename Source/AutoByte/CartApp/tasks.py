from __future__ import absolute_import, unicode_literals

from celery import shared_task
from .views import *

@shared_task
def add():
    print("Good Morning")

@shared_task
def CheckProductStatus():
    checkProductStatus()
