from django.db import models
from users.models import User

status = [
    ["completed", "Completed"],
    ["in_progress", "In Progress"]
]

class Topic(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    start_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=status, default="in_progress")
    progress = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

class Log(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='logs')
    date = models.DateTimeField(auto_now_add=True)
    note = models.TextField(max_length=20000)  

    def __str__(self):
        return f"Log on {self.date.strftime('%Y-%m-%d')} for {self.topic.title}"

