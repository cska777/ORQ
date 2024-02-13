from django.shortcuts import render
from rest_framework import views,viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer
from .permissions import CreateUserPermission

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated | CreateUserPermission]

class UserLogIn(ObtainAuthToken):
    def post(self,request, *arg, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context = {'request' : request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token = Token.objects.get(user=user)
        return Response({
            'token' : token.key,
            'id' : user.pk,
            'username' : user.username,
            'lastname' : user.lastname,
            'firstname' : user.firstname,
            'email' : user.email
        })
    