from django.urls import path

from finances.views import wallets

app_name = "finances"

urlpatterns = [
    path('wallets/', wallets, name='wallets'),
]
