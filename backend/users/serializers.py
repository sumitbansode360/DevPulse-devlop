from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username','email','password']

    def create(self, validated_data):
        user = User.objects.create(
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            username = validated_data['username'],
            email = validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user