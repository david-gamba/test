from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    # CreateAPIView is django thing that will handle automatic user creation or new object creation
    queryset = User.objects.all() # so we say, here is list of all different objects to make sure we do not create user that already exists
    serializer_class = UserSerializer # serializer class ot tell it what kind of data to accept to make a user
    permission_classes = [AllowAny] # who can call this (even if they are not authenticated) to allow create new user

class NoteListCreate(generics.ListCreateAPIView): # we are using list to create list of views
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # we want to filter notes by user
        # we write it here to have access to the request object
        user = self.request.user
        return Note.objects.filter(author=user) # we could input others, like title etc
    
    def perform_create(self, serializer):

        if serializer.is_valid(): # it is valid if passed all checks it was supposed by django
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # notes what we are allowed to delete are simply in this filter
        user = self.request.user
        return Note.objects.filter(author=user) 