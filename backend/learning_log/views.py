from django.shortcuts import render
from .models import Topic, Log
from rest_framework.viewsets import ModelViewSet
from .serializers import TopicSerializer, LogSerializer
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination 

class LogPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class TopicViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = LogPagination
    serializer_class = TopicSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category']
    search_fields = ['title']

    def get_queryset(self):
        topic = Topic.objects.filter(user=self.request.user).order_by('-updated_at')
        return topic
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
        else:
            serializer = self.get_serializer(queryset, many=True)
            # This part is for when pagination is disabled
            response = Response({"results": serializer.data}) 
        
        #Counts for Topics
        all_count = Topic.objects.filter(user=request.user).count()
        programming_count = Topic.objects.filter(user=request.user, category='programming').count()
        design_count = Topic.objects.filter(user=request.user, category='design').count()
        personal_count = Topic.objects.filter(user=request.user, category='personal').count()
        business_count = Topic.objects.filter(user=request.user, category='business').count()
        other_count = Topic.objects.filter(user=request.user, category='other').count()

        response.data['category_count'] = {
            "all": all_count,
            "programming": programming_count,
            "design": design_count,
            "personal": personal_count,
            "business": business_count,
            "other": other_count
        }
        return response

    
class LogViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LogSerializer
    
    def get_queryset(self):
        topic_id = self.kwargs.get('topic_pk')
        return Log.objects.filter(topic=topic_id, topic__user=self.request.user).order_by('-date')
    
    def perform_create(self, serializer):
        topic_id = self.kwargs.get('topic_pk')
        topic = Topic.objects.get(id=topic_id, user=self.request.user)
        serializer.save(topic=topic)