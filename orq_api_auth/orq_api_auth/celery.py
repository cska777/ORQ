import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'orq_api_auth.settings')

app = Celery('orq_api_auth')
app.config_from_object('django.conf:settings',namespace='CELERY')
app.autodiscover_tasks()

