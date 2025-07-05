from pytube import YouTube


def download_video(video_url):
    try:
        yt_obj = YouTube(video_url)
        filters = yt_obj.streams.filter(progressive=True, file_extension='mp4')
        filters.get_highest_resolution().download(output_path='', filename="video.mp4")
    except Exception as e:
        print(e)


def download_audio(video_url):
    try:
        yt_obj = YouTube(video_url)
        yt_obj.streams.get_audio_only().download(output_path='', filename='audio.mp3')
    except Exception as e:
        print(e)
