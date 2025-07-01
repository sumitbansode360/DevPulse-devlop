from django.shortcuts import render
from .models import Topic, Log
from rest_framework.viewsets import ModelViewSet
from .serializers import TopicSerializer, LogSerializer
from rest_framework.permissions import IsAuthenticated


class TopicViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TopicSerializer

    def get_queryset(self):
        topic = Topic.objects.filter(user=self.request.user)
        return topic
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    
class LogViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LogSerializer
    
    def get_queryset(self):
        topic_id = self.kwargs.get('topic_pk')
        return Log.objects.filter(topic=topic_id, topic__user=self.request.user)
    
    def perform_create(self, serializer):
        topic_id = self.kwargs.get('topic_pk')
        topic = Topic.objects.get(id=topic_id, user=self.request.user)
        serializer.save(topic=topic)