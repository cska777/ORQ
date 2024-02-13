from rest_framework import permissions

class CreateUserPermission(permissions.BasePermission):
    def has_permission(self,request,view):
        # Autoriser methode post sans Jeton d'authentification
        if request.method == 'POST':
            return True
        return False