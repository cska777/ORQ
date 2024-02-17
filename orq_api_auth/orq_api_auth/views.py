from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import UserSerializer, WatchlistSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_protect

from django.shortcuts import get_object_or_404

from rest_framework.decorators import authentication_classes,permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import Watchlist


@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response("Utilisateur introuvable", status=status.HTTP_404_NOT_FOUND )
    token, created  = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({"token": token.key, "user": serializer.data})



@api_view(['GET'])
@authentication_classes([SessionAuthentication,TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response({"Validé pour {}".format(request.user.email)})

@api_view(['POST','GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def watchlist(request):
    if request.method == 'POST':
        # Extraire les données de la requête
        user_id = request.user.id
        titre = request.data.get('titre')

        # Vérifier si les données requises sont présentes
        if not titre:
            return Response("Données insuffisantes pour ajouter à la watchlist", status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier si la série existe dans la watchlist de l'utilisateur
        existing_entry = Watchlist.objects.filter(user_id=user_id, titre=titre).first()
        if existing_entry :
            return Response("Série déjà ajoutée dans la watchlist", status=status.HTTP_400_BAD_REQUEST)

        # Créer une nouvelle entrée dans la table watchlist
        watchlist_entry = Watchlist.objects.create(
            user_id=user_id,
            titre=titre,
            vu=False,
            a_regarder_plus_tard=True,
            aime=False,
            en_cours=False
        )
        return Response("Série ajoutée avec succès à la watchlist", status=status.HTTP_201_CREATED)
    elif request.method == 'GET':
        # Logique pour récupérer les titres de la watchlist de l'utilisateur
        user_id = request.user.id
        watchlist_entries = Watchlist.objects.filter(user_id=user_id)
        serializer = WatchlistSerializer(watchlist_entries, many=True)
        return Response(serializer.data)
    else:
        return Response("Méthode non autorisée", status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def watchlist_delete(request, series_id):
    user_id = request.user.id

    watchlist_entry = get_object_or_404(Watchlist, user_id=user_id, id=series_id)
    
    watchlist_entry.delete()
    
    return Response("Titre supprimé de la watchlist avec succès", status=status.HTTP_204_NO_CONTENT)
