from rest_framework import serializers
from .models import Topic, Log




class LogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Log
        fields = ['id', 'topic', 'title', 'date', 'note', 'created_at', 'updated_at']
        read_only_fields  = ['topic', 'date', 'created_at', 'updated_at']


class TopicSerializer(serializers.ModelSerializer):
    logs = LogSerializer(many=True, read_only=True)
    class Meta:
        model = Topic
        fields = ['id', 'title', 'start_date', 'category', 'user', 'logs']
        read_only_fields = ['user', 'created_at', 'updated_at']