import os

from django.shortcuts import render
from dotenv import load_dotenv

from finances.services.monobank import MonoBankAPI, NBUAPI

load_dotenv()
mono_token = os.getenv("monobankToken")
iban_list = os.getenv("IBANs").split(",")
bank_api = MonoBankAPI(mono_token=mono_token, iban_list=iban_list)
nbu_api = NBUAPI()


def wallets(request):

    monobank_wallets = bank_api.get_wallets()
    nbu_rates = nbu_api.get_rates()

    if monobank_wallets is None:
        monobank_wallets = {}
    if nbu_rates is None:
        nbu_rates = {}

    print(nbu_rates)

    return render(
        request,
        'finances/wallets.html',
        {'monobank_wallets': monobank_wallets, "nbu_rates": nbu_rates}
    )
