import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yt_transcript_project.settings')

application = get_wsgi_application()  # ✅ Gunicorn expects 'application'
