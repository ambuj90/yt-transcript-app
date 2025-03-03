from django.shortcuts import render
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
import csv

def get_transcript(request):
    if request.method == "POST":
        video_url = request.POST.get("url")

        if not video_url:
            return render(request, 'transcripts/home.html', {
                "message": "❌ No URL provided. Please enter a valid YouTube URL.",
                "success": False,
                "download": False
            })

        # ✅ Extract video ID from URL
        if "v=" in video_url:
            video_id = video_url.split("v=")[-1].split("&")[0]
        else:
            return render(request, 'transcripts/home.html', {
                "message": "❌ Invalid YouTube URL. Please try again.",
                "success": False,
                "download": False
            })

        try:
            # ✅ Fetch transcript using youtube_transcript_api
            transcript = YouTubeTranscriptApi.get_transcript(video_id)

            # ✅ Convert transcript into a readable format
            transcript_text = "\n".join([entry["text"] for entry in transcript])

            # ✅ Prepare CSV Data
            csv_data = "Text\n" + transcript_text.replace("\n", "\n")

            return render(request, 'transcripts/home.html', {
                "message": "✅ Transcript generated successfully! Downloading...",
                "success": True,
                "download": True,
                "csv_data": csv_data
            })

        except TranscriptsDisabled:
            return render(request, 'transcripts/home.html', {
                "message": "❌ Transcripts are disabled for this video.",
                "success": False,
                "download": False
            })
        except NoTranscriptFound:
            return render(request, 'transcripts/home.html', {
                "message": "❌ No transcript found for this video.",
                "success": False,
                "download": False
            })
        except Exception as e:
            return render(request, 'transcripts/home.html', {
                "message": f"❌ An unexpected error occurred: {str(e)}",
                "success": False,
                "download": False
            })

    return render(request, 'transcripts/home.html')



def home(request):
    return render(request, 'transcripts/home.html')


def terms_of_service(request):
    return render(request, 'transcripts/terms_of_service.html')


def privacy_policy(request):
    return render(request, 'transcripts/privacy_policy.html')
