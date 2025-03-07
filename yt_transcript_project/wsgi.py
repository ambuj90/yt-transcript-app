import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "yt_transcript_project.settings")

app = get_wsgi_application()  # ✅ Vercel expects 'app' as the callable object
