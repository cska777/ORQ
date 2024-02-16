from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Watchlist

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id', 'username', 'password', 'email']

class WatchlistSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Watchlist
        fields = ['id', 'titre', 'vu', 'a_regarder_plus_tard','user_id','mon_avis','aime','en_cours']
