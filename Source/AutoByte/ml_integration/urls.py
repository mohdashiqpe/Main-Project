from django.urls import path
from .views import *

urlpatterns = [
    path('make_prediction/', predict_user_product, name='make_prediction'),
]
