import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view
import urllib.parse
from django.shortcuts import render

# ✅ RapidAPI Credentials
RAPIDAPI_KEY = "edf1273786msh447b24e01dc3be7p10e389jsn0133ac6cf327"
RAPIDAPI_HOST = "youtube-transcript3.p.rapidapi.com"

# ✅ Counter to track API calls
count = 0

def fetch_transcript(video_url):
    """Fetch transcript from RapidAPI"""
    try:
        global count
        count += 1
        print(f"Transcript API called {count} times")

        encoded_url = urllib.parse.quote(video_url)  # Encode URL properly
        api_url = f"https://{RAPIDAPI_HOST}/api/transcript-with-url?url={encoded_url}&flat_text=true&lang=en"

        headers = {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": RAPIDAPI_HOST
        }

        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            return response.json().get("transcript", "No transcript found")
        else:
            print(f"Error: {response.status_code}, {response.text}")
            return None

    except Exception as e:
        print("Error fetching transcript:", str(e))
        return None

@api_view(["GET"])
def get_transcript(request):
    """Handle transcript API request"""
    video_url = request.GET.get("videoUrl")

    if not video_url:
        return JsonResponse({"error": "Video URL is required"}, status=400)

    transcript = fetch_transcript(video_url)
    if not transcript:
        return JsonResponse(
            {"error": "Could not fetch transcript. Please check the video URL or try again later."},
            status=500
        )

    return JsonResponse({"transcript": transcript})
from django.shortcuts import render

def home(request):
    return render(request, "transcript/home.html") # ✅ Correct way to serve the homepage

