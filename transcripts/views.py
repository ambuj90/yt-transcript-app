from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import YouTubeVideo
from youtube_transcript_api import YouTubeTranscriptApi
import csv
from django.shortcuts import render

def get_transcript(request):
    video_url = request.GET.get("url")

    if not video_url:
        return JsonResponse({"error": "No URL provided"}, status=400)

    video_id = video_url.split("v=")[-1]

    try:
        transcript_data = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = "\n".join([entry['text'] for entry in transcript_data])

        # Save transcript to database
        video, created = YouTubeVideo.objects.get_or_create(video_url=video_url)
        video.transcript = transcript_text
        video.save()

        # 🔹 Prepare Response for Downloading CSV
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="transcript_{video_id}.csv"'

        writer = csv.writer(response)
        writer.writerow(["Timestamp", "Text"])

        for entry in transcript_data:
            writer.writerow([entry["start"], entry["text"]])

        return response

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def home(request):
    return render(request, 'transcripts/home.html')
def terms_of_service(request):
    return render(request, 'transcripts/terms_of_service.html')  # ✅ Ensure this view exists

def privacy_policy(request):
    return render(request, 'transcripts/privacy_policy.html')