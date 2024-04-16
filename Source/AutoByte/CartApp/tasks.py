from __future__ import absolute_import, unicode_literals

from celery import shared_task
from .views import *

@shared_task
def add():
    print('''127.0.0.1      somephpsite.com.local
127.0.0.1      www.somephpsite.com.local
127.0.0.1      otherpythonsite.com.local
127.0.0.1      www.otherpythonsite.com.local''')

@shared_task
def CheckProductStatus():
    checkProductStatus()

# def checkProductAdded():
