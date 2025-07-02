from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .utils import fetch_github_data

class GitHubActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        username = request.user.username
        if not username:
            return Response({"error": "GitHub username not set"}, status=400)

        data = fetch_github_data(username)
        return Response(data)
