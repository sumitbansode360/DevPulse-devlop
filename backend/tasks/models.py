from django.db import models
from users.models import User

STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    )


class Task(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=250)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    created_at = models.DateTimeField(auto_now_add=True)

