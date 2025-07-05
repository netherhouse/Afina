from django.contrib import admin
from .models import Wallet, Transaction, TransactionCategory


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("name", "currency", "balance", "wallet_type")
    search_fields = ("name", "currency")


@admin.register(TransactionCategory)
class TransactionCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", )
    search_fields = ("name",)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("wallet", "transaction_type", "amount", "date", "comment")
    search_fields = ("wallet__name", "comment")
    list_filter = ("transaction_type", "date")
