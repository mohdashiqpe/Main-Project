from django.urls import path
from .views import *

urlpatterns = [
    path('deliveryman_signUp/', delivery_man_sign_up_view, name='deliveryman_signUp'),
    path('addUnitAutheror/', addUnitAutheror_view, name='addUnitAutheror'),
    path('addAutheror/', addAutheror_view, name="addAutheror"),
    path('deliveryhubindex/', deliveryHubIndex_view, name='deliveryhubindex'),
    path('initiator/', initiator_view, name='initiator'),
    path('updateauth/', updateauth_view, name='updateauth'),
    path('delivery_accepted/<int:id>', delivery_accepted_view, name='delivery_accepted'),
    path('delivery_rejected/<int:id>', delivery_rejected_view, name='delivery_rejected'),
    path('gen_otp/<int:id>', gen_otp_views, name='gen_otp'),
    path('validate_otp/<int:id>', validate_otp, name='validate_otp'),
    path('gen_otp1/<int:id>', gen_otp1_views, name='gen_otp1'),
    path('validate_otp1/<int:id>', validate_otp1, name='validate_otp1'),
]