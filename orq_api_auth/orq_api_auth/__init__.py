from .celery import app as celery_app

__all__ = ('celery_app',)
default_app_config = 'orq_api_auth.apps.OrqApiConfig'