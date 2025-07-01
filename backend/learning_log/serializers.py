from rest_framework import serializers
from .models import Topic, Log




class LogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Log
        fields = ['id', 'topic', 'date', 'note']
        read_only_fields  = ['topic', 'date']


class TopicSerializer(serializers.ModelSerializer):
    logs = LogSerializer(many=True, read_only=True)
    class Meta:
        model = Topic
        fields = ['id', 'title', 'start_date', 'status', 'progress', 'user', 'logs']