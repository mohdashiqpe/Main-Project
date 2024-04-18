from django.urls import path
from .views import *

urlpatterns = [
    path('checkoutview/<int:product_id>/', checkoutview, name='checkoutview'),
    path('add_address/<int:product_id>', add_address, name='add_address'),
    path('mannualbidder/<int:product_id>',  mannualbidder_view, name='mannualbidder'),
    path('usercart/', usercart_view, name='usercart'),
    path('successpage/', successPage, name='successpage'),
    path('myorders/', myOrders_view, name='myorders'),
    path('autobidder/<int:product_id>', autobidder_view, name='autobidding'),
    path('mannualySelectedBidder/<int:bid_id>', manuallySelectedBid, name='mannualySelectedBidder'),
    path('generate-filtered-orders-pdf/', generate_filtered_orders_pdf, name='generate_filtered_orders_pdf'),
]