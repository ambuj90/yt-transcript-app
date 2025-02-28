from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import YouTubeVideo
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import csv

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
            # Fetch transcript
            transcript_data = YouTubeTranscriptApi.get_transcript(video_id)
            transcript_text = "\n".join([entry['text'] for entry in transcript_data])

            # Save transcript to database
            video, created = YouTubeVideo.objects.get_or_create(video_url=video_url)
            video.transcript = transcript_text
            video.save()

            # ✅ Prepare CSV response
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="transcript_{video_id}.csv"'

            writer = csv.writer(response)
            writer.writerow(["Timestamp", "Text"])

            for entry in transcript_data:
                writer.writerow([entry["start"], entry["text"]])

            # ✅ Show success message
            return render(request, 'transcripts/home.html', {
                "message": "✅ Transcript generated successfully! Downloading...",
                "success": True,
                "download": True,  # Pass flag to trigger download
                "csv_data": response.content.decode('utf-8'),  # Send CSV data for client-side download
            })

        except NoTranscriptFound:
            return render(request, 'transcripts/home.html', {
                "message": "❌ Transcript not available for this video. It may be auto-generated or disabled.",
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
