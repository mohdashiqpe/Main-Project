from django.urls import path
from .views import *

urlpatterns = [
    path('regTester/', TesterRegView, name='regTester'),
    path('testerPanel/', TesterPanelView, name='testerPanel'),
    path('approveProduct/<int:product_id>/', approveProduct, name='approveProduct'),
]