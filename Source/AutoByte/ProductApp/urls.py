from django.urls import path
from .views import *

urlpatterns = [
    path("addproduct/", addproductview, name='addproduct'),
    path("loadBrand/", loadBrand, name='loadbrand'),
    path('loadLocation/', loadLocation, name='loadLocation'),
    path('addProductForm/', addProductForm, name='addProductForm'),
    path('productinfoview/<int:product_id>', productinfoview, name='productinfoview'),
    path('bidbyuser/<int:productid>', bidbyuser, name='bidbyuser'),
    path('myproducts/', my_products_view, name='myproducts'),
    path('productbidding/', product_bidding_view, name='productbidding'),
]
