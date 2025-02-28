from django.db import models

class YouTubeVideo(models.Model):
    video_url = models.URLField(unique=True)
    transcript = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.video_url
