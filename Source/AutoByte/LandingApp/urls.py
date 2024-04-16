from django.urls import path
from .views import *

urlpatterns = [
    path('', homePage, name="home"),
    path('register/', register, name="register"),
    path('login/', login_view, name="login"),
    path('check_user_exists/', check_user_exists, name="check_user_exists"),
    path('logout/', logout_view, name='logout'),
    path('register1/', register1, name='register1'),
    path('check_username_exists/', check_username_exists, name='check_username_exists'),
    path('userSettings/', user_Settings, name='userSettings'),
    path('validateSettingsEmail/', validateSettingsEmail, name='validateSettingsEmail'),
    path('settingsForm1/', settingsForm1, name='settingsForm1'),
    path('settingsForm2/', settingsForm2, name='settingsForm2'),
    path('settingsForm3/', settingsForm3, name='settingsForm3'),
    path('settingsForm4/', settingsForm4, name='settingsForm4'),
    path('removeProfilePic/', removeProfilePic, name='removeProfilePic'),
    path('validatePassword/', validatePassword, name='validatePassword'),
    path('updatePassword/', updatePassword, name='updatePassword'),
    path('removeaddress/', removeaddress, name='removeaddress'),
    path('setabid/', setabid, name='setabid'),
    path('saveGeoLoca/', saveGeoLoca, name='saveGeoLoca'),

    path('siteTester/', leafletMap_view, name="siteTester"),
]