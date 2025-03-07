document.addEventListener("DOMContentLoaded", function () {
    const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");
    const themePicker = document.getElementById("theme-picker");
    const body = document.body;

    // ✅ Load Dark Mode Preference
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        toggleDarkModeBtn.innerText = "☀️ Light Mode";
    }

    // ✅ Dark Mode Toggle
    toggleDarkModeBtn.addEventListener("click", function () {
        body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
        toggleDarkModeBtn.innerText = body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
    });

    // ✅ Theme Picker
    themePicker.addEventListener("change", function () {
        document.querySelector(".navbar").classList = `navbar navbar-expand-lg navbar-dark bg-${themePicker.value} shadow-sm`;
    });

    // ✅ Load Last Used Video URL
    const videoInput = document.getElementById("video-url");
    if (localStorage.getItem("lastVideoURL")) {
        videoInput.value = localStorage.getItem("lastVideoURL");
    }

    // ✅ Fetch Transcript
    window.fetchTranscript = async function () {
        const videoUrl = videoInput.value;
        const language = document.getElementById("language-picker").value;
        const errorMessage = document.getElementById("error-message");
        const transcriptContainer = document.getElementById("transcript-text");
        const spinner = document.getElementById("loading-spinner");

        errorMessage.innerText = "";
        transcriptContainer.innerText = "";
        spinner.style.display = "block"; // Show Loading

        if (!videoUrl) {
            errorMessage.innerText = "Please enter a valid YouTube video URL.";
            spinner.style.display = "none";
            return;
        }

        localStorage.setItem("lastVideoURL", videoUrl); // Save video URL

        try {
            const response = await fetch(`/api/transcript/?videoUrl=${encodeURIComponent(videoUrl)}&lang=${language}`);
            const data = await response.json();
            spinner.style.display = "none"; // Hide Loading

            if (data.transcript) {
                transcriptContainer.innerText = data.transcript;
            } else {
                errorMessage.innerText = "Failed to fetch transcript.";
            }
        } catch (error) {
            errorMessage.innerText = "An error occurred. Try again.";
            spinner.style.display = "none";
        }
    };
});
