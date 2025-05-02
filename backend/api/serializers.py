from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"] # all fields that we want to serialize when we are getting or passing user
        extra_kwargs = {"password": {"write_only": True}} # it tells Django that we want to accept the password on user creation but we do not want to return it when we are giving information about the user, so no-one can read what the password is

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data) # validated already passed all of the serializer checks, like valid username and pw
                                # serializer will look for model User, it will make sure that all fields specified are valid and if yes, it will pass to validated_data, then we create user
                                # **validated data is shortcut for user = User(username=validated_data['username'], email=validated_data['email'])
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
            # opposite of user - we should be able to read who is author but not write
        