from django.urls import path
from .views import *

urlpatterns = [
    path('addCategory/', addCategoryView, name='addCategory'),
    path('loadCategory/', loadCategories, name='loadCategory'),
    path('removeCat/', removeCat, name='removeCat'),
    path('checkCatExists/', checkCatExists, name='checkCatExists'),
    path('addProducts/', addProductsView, name='addProducts'),
    path('loadSubCategory/', loadSubCategory, name='loadSubCategory'),
    path('loadSubSUbCategory/', loadSubSUbCategory, name='loadSubSUbCategory'),
    path('loadLocation/', loadLocation, name='loadLocation'),
    path('checkOut/<int:id>', checkOutPage, name='checkOut'),
    path('cart/', cartPage, name='cart'),
    path('product_details/<int:id>/', productDetailsPage, name='product_details'),
    path('pdfGenHtml/', pdfGenHtml, name='pdfGenHtml'),
    path('successFullOrder/', successFullOrder, name='successFullOrder'),
    path('cartCheckOut/<int:id>/', cartCheckOut, name="cartCheckOut"),
    path('removeFromCart/', removeFromCart, name='removeFromCart'),
    path('manageProductsPage/', manageProductsPage, name='manageProductsPage'),
]