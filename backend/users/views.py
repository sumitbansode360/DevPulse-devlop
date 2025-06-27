from .models import User
from rest_framework.generics import CreateAPIView
from .serializers import RegisterSerializer


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    queryset = User