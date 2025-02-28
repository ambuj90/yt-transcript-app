from django.contrib import admin
from .models import YouTubeVideo

@admin.register(YouTubeVideo)
class YouTubeVideoAdmin(admin.ModelAdmin):
    list_display = ('video_url', 'transcript', 'created_at')
