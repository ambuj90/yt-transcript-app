from django.urls import path
from .views import get_transcript, home, terms_of_service, privacy_policy  # ✅ Import terms_of_service

urlpatterns = [
    path('', home, name='home'),  # ✅ Home page URL
    path('get_transcript/', get_transcript, name='get_transcript'),
    path('terms-of-service/', terms_of_service, name='terms_of_service'),  # ✅ Correct URL pattern
    path('privacy-policy/', privacy_policy, name='privacy_policy'),  # ✅ Correct URL pattern
]
