from django.urls import path
from .views import *

urlpatterns = [
    path('adminView/', adminView, name='adminView'),
    path('addtester/', addtesterview, name='addtester'),
    path('addCategory/', addcategoryview, name='addCategory'),
    path('loadCategory/', loadCategories, name='loadCategory'),
    path('loadSubCategory/', loadSubCategory, name='loadSubCategory'),
    path('loadSubSUbCategory/', loadSubSUbCategory, name='loadSubSUbCategory'),
    path('checkCatExists/', checkCatExists, name='checkCatExists'),
    path('addMainCategoryForm/', addMainCategoryForm, name='addMainCategoryForm'),
    path('addSubCategoryForm/', addSubCategoryForm, name='addSubCategoryForm'),
    path('addBrandForm/', addBrandForm, name='addBrandForm'),
    path('manageproduct/', manageproduct, name='manageproduct'),
    path('identify_available_dates/', identify_available_dates, name='identify_available_dates'),
    path('allocateTester/', allocateTester, name='allocateTester'),
    path('deliveryMan/', deliveryMan_view, name="deliveryMan"),
    path('manageTA/', manageTA_view, name='manageTA'), # chartDataBrand
    path('chartData/', fetchChartData, name='chartData'),
    path('chartDataBrand/', fetchChartData_view, name='chartDataBrand'),
]