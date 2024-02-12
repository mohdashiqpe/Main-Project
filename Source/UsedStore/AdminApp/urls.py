from django.urls import path
from .views import *

urlpatterns = [
    path('adminPy/', showAdminPage, name='adminPy'),
    path('suspendView/', suspendView, name='suspendView'),
    path('addTester/', addTesterView, name='addTester'),
]