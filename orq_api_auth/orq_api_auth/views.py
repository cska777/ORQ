import os
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import UserSerializer, WatchlistSerializer, FilmsSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from django.shortcuts import get_object_or_404

from rest_framework.decorators import authentication_classes,permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from watchlist.models import Watchlist
from films.models import Films




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

@api_view(['PUT', 'OPTIONS'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_user(request):
    if request.method == "PUT" or request.method == "OPTIONS":
        # Récupérer l'utilisateur qu'on veut modifier
        user = request.user

        # Vérifier si les données de mise à jour sont présentes dans la requête
        if 'username' in request.data:
            print("Username reçu :", request.data['username'])

            user.username = request.data['username']

            # Enregistrer les modifications de l'utilisateur
            user.save()
            print("Utilisateur mis à jour avec succès")

            # Sérializer l'utilisateur mis à jour si nécessaire
            serializer = UserSerializer(user)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print("Données de mise à jour manquantes dans la requête")
            return Response("Données de mise à jour manquantes", status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response("Méthode non autorisée", status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST','OPTIONS'])
@authentication_classes([SessionAuthentication,TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.method == "POST" or request.method == 'OPTIONS':
        user = request.user
        data = request.data

        old_password = data.get('old_password')
        new_password = data.get('new_password')

        if not old_password or not new_password:
            return Response("Ancien et nouveau mot de passe requis",status=status.HTTP_400_BAD_REQUEST)
        
        if not user.check_password(old_password):
            return Response("Ancien mot de passe incorrect", status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()

        return Response("Mot de passe modifié avec succès", status=status.HTTP_200_OK)

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
        illustration = request.data.get('illustration')
        vu = request.data.get('vu')
        type = request.data.get('type')
        duree = request.data.get('duree')
        date_sortie = request.data.get('date_sortie')
        synopsis = request.data.get('synopsis')
        genres = request.data.get('genres')
        press_score = request.data.get('press_score')


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
            vu=vu,
            aime=False,
            en_cours=False,
            illustration = illustration,
            type = type,
            duree = duree,
            date_sortie = date_sortie,
            synopsis = synopsis,
            genres = genres,
            press_score = press_score
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
    
@api_view(['DELETE','PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def watchlist_update(request, oeuvre_id):
        if request.method == 'DELETE' :
            user_id = request.user.id

            watchlist_entry = get_object_or_404(Watchlist, user_id=user_id, id=oeuvre_id)
            
            watchlist_entry.delete()
            
            return Response("Titre supprimé de la watchlist avec succès", status=status.HTTP_204_NO_CONTENT)
        elif request.method == 'PUT' :
            user_id = request.user.id
            
            # Récupérer l'entrée de la watchlist
            watchlist_entry = get_object_or_404(Watchlist, user_id = user_id, id= oeuvre_id)

            # Mettre à jour les champs si les données sont fournies dans la requête
            if 'vu' in request.data :
                watchlist_entry.vu = request.data['vu']
            if 'mon_avis' in request.data : 
                watchlist_entry.mon_avis = request.data['mon_avis']
            if 'aime' in request.data :
                watchlist_entry.aime = request.data['aime']
            if 'en_cours' in request.data :
                watchlist_entry.en_cours = request.data['en_cours']
            if 'type' in request.data :
                watchlist_entry.type = request.data['type']
            if 'duree' in request.data :
                watchlist_entry.duree = request.data['duree']
            if 'date_sortie' in request.data :
                watchlist_entry.date_sortie = request.data['date_sortie']
            
            # Enregistrer les modifications
            watchlist_entry.save()
            return Response("Entrée de la watchlist mise à jour avec succès", status=status.HTTP_200_OK)
        else : 
            return Response("Méthode non autorisée", status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(["GET"])
def films(request):
    # Récupérez tous les objets Films
    films = Films.objects.all()

    # Serializer les objets Films
    serializer =  FilmsSerializer(films, many=True)

    # Renvoyer les données serialisées en réponse
    return Response(serializer.data)
