from django.urls import path
from .views import get_transcript

urlpatterns = [
    path("transcript/", get_transcript, name="get_transcript"),  # ✅ Correct API path
]
