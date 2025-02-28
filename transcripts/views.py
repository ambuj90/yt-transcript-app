from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import YouTubeVideo
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import csv
import time
import random
import requests

# ✅ Add user-agents to mimic a real browser request
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def get_transcript(request):
    if request.method == "POST":
        video_url = request.POST.get("url")

        if not video_url:
            return render(request, 'transcripts/home.html', {
                "message": "❌ No URL provided. Please enter a valid YouTube URL.",
                "success": False
            })

        video_id = video_url.split("v=")[-1]

        try:
            # ✅ Use retry logic with delay
            for attempt in range(3):  # Try up to 3 times
                try:
                    # ✅ Add request headers to bypass bot detection
                    transcript_data = YouTubeTranscriptApi.get_transcript(video_id, proxies=None, cookies=None)

                    transcript_text = "\n".join([entry['text'] for entry in transcript_data])

                    # ✅ Save transcript to database
                    video, created = YouTubeVideo.objects.get_or_create(video_url=video_url)
                    video.transcript = transcript_text
                    video.save()

                    # ✅ Prepare response for CSV download
                    response = HttpResponse(content_type='text/csv')
                    response['Content-Disposition'] = f'attachment; filename="transcript_{video_id}.csv"'

                    writer = csv.writer(response)
                    writer.writerow(["Timestamp", "Text"])

                    for entry in transcript_data:
                        writer.writerow([entry["start"], entry["text"]])

                    return response

                except requests.exceptions.RequestException:
                    # ✅ If we hit 429 error, wait and retry
                    wait_time = random.randint(5, 15)  # Random wait time
                    print(f"⚠️ Too Many Requests. Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)

            # If all retries fail, return error
            return render(request, 'transcripts/home.html', {
                "message": "❌ Too many requests to YouTube. Please try again later.",
                "success": False
            })

        except NoTranscriptFound:
            return render(request, 'transcripts/home.html', {
                "message": "❌ Transcript not available for this video.",
                "success": False
            })

        except TranscriptsDisabled:
            return render(request, 'transcripts/home.html', {
                "message": "❌ Transcripts are disabled for this video.",
                "success": False
            })

        except Exception as e:
            return render(request, 'transcripts/home.html', {
                "message": f"❌ An unexpected error occurred: {str(e)}",
                "success": False
            })

    return render(request, 'transcripts/home.html')



def home(request):
    return render(request, 'transcripts/home.html')

def terms_of_service(request):
    return render(request, 'transcripts/terms_of_service.html')

def privacy_policy(request):
    return render(request, 'transcripts/privacy_policy.html')
