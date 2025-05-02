from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Note(models.Model):

    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
                #related name is what field name we want to put on users that references all notes
                # users.notes.all() -> that will get all notes for that user

    def __str__(self):
        return self.title
    

