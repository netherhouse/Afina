from django.db import models
from django.utils.translation import gettext_lazy as _


class Wallet(models.Model):
    class WalletType(models.TextChoices):
        FIAT = "fiat", _("Fiat Currency")
        CRYPTO = "crypto", _("Cryptocurrency")

    name = models.CharField(max_length=100)
    currency = models.CharField(max_length=10)
    balance = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    wallet_type = models.CharField(
        max_length=10, choices=WalletType.choices, default=WalletType.FIAT
    )

    def __str__(self):
        return f"{self.name} ({self.currency})"


class TransactionCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Transaction(models.Model):
    class TransactionType(models.TextChoices):
        ADD = "add", _("Add Funds")
        REMOVE = "remove", _("Remove Funds")

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")
    transaction_type = models.CharField(max_length=10, choices=TransactionType.choices)
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    comment = models.TextField(blank=True, null=True)
    category = models.ForeignKey(TransactionCategory, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} {self.amount} to {self.wallet.name}"
