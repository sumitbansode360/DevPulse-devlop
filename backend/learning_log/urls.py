from rest_framework_nested import routers
from .views import TopicViewSet, LogViewSet

router = routers.DefaultRouter()
router.register(r'topics', TopicViewSet, basename='topics')

log_router = routers.NestedDefaultRouter(router, r'topics', lookup='topic')
log_router.register(r'logs', LogViewSet, basename='topic-log')

urlpatterns = router.urls + log_router.urls

