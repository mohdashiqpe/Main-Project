from django.urls import path
from .views import *

urlpatterns = [
    path('signup/', showSignUp, name='signup'),
    path('signin/', showSignIn, name='signin'),
    path('signup2/', showSignUp2, name='signup2'),
    path('regOtp/', sendRegOtp, name='regOtp'),
    path('check_user_exists/', check_user_exists, name='check_user_exists'),
    path('deleteUserAccount/', deleteUserAccount, name='deleteUserAccount'),
    path('userLogout/', userLogout, name='userLogout'),
    path('userLoginCheck/', checkUserLoggedIn, name='userLoginCheck'),
    path('ForgotPassword1/', ForgotPassword1, name='ForgotPassword1'),
    path('OTPConfirmation/', OTPConfirmation, name='OTPConfirmation'),
    path('forgotPassword2', forgotPassword2, name='forgotPassword2'),
    # path('forgotPassword/', forgotPassword, name='forgotPassword'),
]