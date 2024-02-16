from django.db import models
from django.contrib.auth.models import User 

from django.db.models.signals import post_save
from django.dispatch import receiver

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    titre = models.CharField(max_length=255)
    vu = models.BooleanField(default=False)
    a_regarder_plus_tard = models.BooleanField(default=True)
    mon_avis = models.TextField(max_length = 300, null=True)
    aime = models.BooleanField(default=False)
    en_cours = models.BooleanField(default=False)
    
    class Meta:
        app_label = 'watchlist'

@receiver(post_save, sender=User)
def create_watchlist(sender,instance,created, **kwargs):
    if created:
        Watchlist.objects.create(user=instance)

