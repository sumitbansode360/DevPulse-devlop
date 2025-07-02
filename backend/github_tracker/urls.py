from django.urls import path
from .views import GitHubActivityView

urlpatterns = [
    path('github-activity/', GitHubActivityView.as_view(), name='github-activity')
]
