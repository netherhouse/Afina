from dotenv import load_dotenv
import requests
import os

load_dotenv()

currencies_list = {"USD": "🇺🇸", "EUR": "🇪🇺", "PLN": "🇵🇱"}
cryptocurrencies_list = ("BTC", "BCH", "ETH", "LTC")
currency_code = {980: "UAH", 978: "EUR", 840: "USD"}
currency_code_smile = {980: "₴", 978: "€", 840: "$"}


# region API bank.gov.ua
def get_rates():
    try:
        rates = ""
        for currency in currencies_list.keys():
            res = requests.get(
                "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange",
                params={"valcode": currency, "": "json"}
            )
            data = res.json()
            rates += "{} {}: {}\n".format(
                currencies_list[currency],
                data[0]['cc'],
                round(data[0]['rate'], 2)
            )
        return rates
    except Exception as e:
        print("Exception (find):", e)
        pass

# endregion API bank.gov.ua


# region API monobank.ua
def mono_get_client_info():
    try:
        res = requests.get(
            "https://api.monobank.ua/personal/client-info",
            headers={'X-Token': os.getenv("monobankToken")}
        )
        data = res.json()
        answer = "⚫ MonoBank:\n\n"
        for j in os.getenv("IBANs"):
            for i in data["accounts"]:
                if i["iban"] == j:
                    answer += "{} {}: {} {}\n".format(
                        i["type"].capitalize(), currency_code[i["currencyCode"]],
                        i["balance"] / 100, currency_code_smile[i["currencyCode"]]
                    )
        return answer
    except Exception as e:
        print("Exception (find):", e)
        pass


def mono_past_webhook():
    data = requests.post(
        "https://api.monobank.ua/personal/webhook",
        headers={"X-Token": os.getenv("monobankToken")}
    )
    return data


def mono_get_extract():
    try:
        res = requests.get("https://api.monobank.ua/personal/statement/{}/{}".format(0, 1654041600),
                           headers={'X-Token': os.getenv("monobankToken")})
        data = res.json()
        return data
    except Exception as e:
        print("Exception (find):", e)
        pass

# endregion API monobank.ua


# region API apilayer.com
def convert_currency(cur_to, cur_from, amount):
    try:
        res = requests.get("https://api.apilayer.com/currency_data/convert",
                           params={"to": cur_to, "from": cur_from, "amount": amount},
                           headers={"apikey": os.getenv("apilayerToken")})
        data = res.json()
        return data["result"]
    except Exception as e:
        print("Exception (find):", e)
        pass


def coinlayer_get_cryptocurrency():
    try:
        res = requests.get("http://api.coinlayer.com/live?access_key=be1ca422fda72181675fd4e27835648d")
        data = res.json()
        cryptocurrencies = ""
        for i in data["rates"]:
            if i in cryptocurrencies_list:
                cryptocurrencies += (str(i) + " = " + str(round(data["rates"][i], 2)) + " USD" + "\n")
        return cryptocurrencies
    except Exception as e:
        print("Exception :", e)
        pass
# endregion
