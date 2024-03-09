from django.apps import AppConfig

class OrqApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'orq_api_auth'

    def ready(self):
        import orq_api_auth.tasks
