from .models import Task
from .serializers import TaskSerializer
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination 

class TaskPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100

class TaskViewSet(ModelViewSet):
    serializer_class = TaskSerializer
    pagination_class = TaskPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['status']
    search_fields = ['title', 'description']
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)
    
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
        
        # Counts for all tasks (not just filtered)
        all_count = Task.objects.filter(user=request.user).count()
        pending_count = Task.objects.filter(user=request.user, status='pending').count()
        completed_count = Task.objects.filter(user=request.user, status='completed').count()

        response.data['status_count'] = {
            "all": all_count,
            "pending": pending_count,
            "completed": completed_count
        }
        return response