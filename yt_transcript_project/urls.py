from django.contrib import admin
from django.urls import path, include
from transcript.views import home

urlpatterns = [
    path("admin/", admin.site.urls),
    
    # ✅ Serve frontend homepage at root "/"
    path("", home, name="home"),  

    # ✅ API Routes properly mapped under "api/"
    path("api/", include("transcript.urls")),  
]
