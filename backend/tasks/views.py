from .models import Task
from .serializers import TaskSerializer
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class TaskViewSet(ModelViewSet):
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        # Counts for all tasks (not just filtered)
        all_count = Task.objects.filter(user=request.user).count()
        pending_count = Task.objects.filter(user=request.user, status='pending').count()
        completed_count = Task.objects.filter(user=request.user, status='completed').count()

        return Response({
            "results": serializer.data,
            "count" : {
                "all": all_count,
                "pending": pending_count,
                "completed": completed_count
            
            }
        })