from django.urls import path
from .views import GitHubActivityView

urlpatterns = [
    path('github-activity/<str:username>/', GitHubActivityView.as_view(), name='github-activity')
]
