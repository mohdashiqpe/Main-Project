from django.urls import path, include
from .views import *

urlpatterns = [
    path('', showIndex, name='index'),
    path('', include('AuthApp.urls')),
    path('settings/', showSettings, name='settings'),
    path('removeProfilePic/', removeProfilePic, name='removeProfilePic'),
    path('validatePassword/', validatePassword, name='validatePassword'),
    path('updatePassword/', updatePassword, name='updatePassword'),
]