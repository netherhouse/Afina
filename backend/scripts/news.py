import requests


def get_news_bbc():
    try:
        res = requests.get(
            "https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=0ecaf71321e54e8d95c90abd69fcbafb")
        data = res.json()

        answer = ""

        for i in data["articles"]:
            answer += "🔸 [{}]({})\n".format(i["title"], (i["url"]))
        return answer

    except Exception as e:
        print("Exception:", e)
        pass