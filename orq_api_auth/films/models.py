from django.db import models

class Films(models.Model):
    titre = models.CharField(max_length=255)
    press_score = models.CharField(max_length = 255)
    genres = models.CharField(max_length=255)
    synopsis = models.TextField(max_length = 1000)
    date_de_sortie = models.CharField(max_length = 255)
    duree = models.CharField(max_length= 255)
    illustration_url = models.CharField(max_length = 255)
    genre_oeuvre = models.CharField(max_length=255)

class Meta:
    app_label = "films"