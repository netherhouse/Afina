# Personal Assistant

Services:
- Finances (MonoBank API, NBU API) 
- Lists 

## Instalation

#### Manual

```
git clone https://github.com/haldaniko/Afina-TgAssistant.git
cd Afina-TgAssistant

# on macOS
python3 -m venv venv
source venv/bin/activate

# on Windows
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

(create .env.sample to .env and populate it with all required data)

python backend\manage.py migrate
python backend\manage.py createsuperuser
python backend\manage.py runserver

```

Lists service will be available at http://127.0.0.1:8000/

## Architecture

...

## Structure

...

## Features

...
