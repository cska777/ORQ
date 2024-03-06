from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('test_token/', views.test_token, name='test_token'),
    path('watchlist/', views.watchlist, name='watchlist'),
    path('watchlist/<int:oeuvre_id>/', views.watchlist_update, name='watchlist_update'),
    path('films/', views.films, name='films'),
    path('update_user/', views.update_user, name='update_user'),
    path('change_password/', views.change_password, name='change_password'),
    path('check_password/', views.check_password, name='check_password')
]
