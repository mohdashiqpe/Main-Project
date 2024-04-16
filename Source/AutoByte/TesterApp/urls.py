from django.urls import path
from .views import *


urlpatterns = [
    path('testerInitial/', testerInitialView, name="testerInitial"),
    path('testerdashboard/', testerdashboardview, name='testerdashboard'),
    path('updatequalitycheck/', updatequalitycheck, name='updatequalitycheck'),
]