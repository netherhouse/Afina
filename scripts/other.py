from datetime import datetime
import random
import requests


def get_info_by_ip(ip='193.175.49.156'):
    try:
        response = requests.get(url=f'http://ip-api.com/json/{ip}').json()

        data = {
            '[IP]': response.get('query'),
            '[Провайдер]': response.get('isp'),
            '[Організація]': response.get('org'),
            '[Країна]': response.get('country'),
            '[Регіон]': response.get('regionName'),
            '[Місто]': response.get('city'),
            '[Індекс]': response.get('zip'),
            '[Широта]': response.get('lat'),
            '[Довгота]': response.get('lon'),
        }

        answer = ''
        for k, v in data.items():
            answer += f'{k} : {v}\n'

        return answer

    except requests.exceptions.ConnectionError:
        print('[!] Please check your connection!')


def get_today_fact():
    try:
        fact = requests.get("http://numbersapi.com/{}/{}/date".
                            format(datetime.now().month, datetime.now().day)).text
        return fact
    except Exception as e:
        print("Exception :", e)
        pass


def get_number_fact():
    try:
        fact = requests.get("http://numbersapi.com/{}/trivia/".
                            format(random.randrange(0, 100))).text
        return fact
    except Exception as e:
        print("Exception :", e)
        pass


def get_random_joke():
    try:
        joke = requests.get("https://geek-jokes.sameerkumar.website/api?format=json:").text
        return joke
    except Exception as e:
        print("Exception:", e)
        pass


def get_random_quote(language):
    try:
        res = requests.get("https://api.fisenko.net/v1/quotes/{}/random".format(language))
        data = res.json()
        quote = "{}\n© {}".format(data['text'], data['author']['name'])
        return quote
    except Exception as e:
        print("Exception:", e)
        pass