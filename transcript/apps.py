from django.apps import AppConfig

class TranscriptConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "transcript"  # ✅ Ensure this matches your app folder name
