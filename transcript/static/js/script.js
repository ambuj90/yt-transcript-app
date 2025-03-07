document.addEventListener("DOMContentLoaded", function () {
    const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");
    const themePicker = document.getElementById("theme-picker");
    const videoInput = document.getElementById("video-url");

    // ✅ Toggle Dark Mode
    if (toggleDarkModeBtn) {
        toggleDarkModeBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("darkMode", "enabled");
                toggleDarkModeBtn.innerText = "☀️ Light Mode";
            } else {
                localStorage.setItem("darkMode", "disabled");
                toggleDarkModeBtn.innerText = "🌙 Dark Mode";
            }
        });
    }

    // ✅ Theme Picker
    if (themePicker) {
        themePicker.addEventListener("change", function () {
            document.querySelector(".navbar").classList =
                `navbar navbar-expand-lg navbar-dark bg-${themePicker.value} shadow-sm`;
        });
    }

    // ✅ Load Last Used Video URL
    if (videoInput && localStorage.getItem("lastVideoURL")) {
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
        spinner.style.display = "block"; // Show Loading Spinner

        if (!videoUrl.trim()) {
            errorMessage.innerText = "Please enter a valid YouTube video URL.";
            spinner.style.display = "none";
            return;
        }

        localStorage.setItem("lastVideoURL", videoUrl); // Save last video URL

        try {
            const response = await fetch(`/api/transcript/?videoUrl=${encodeURIComponent(videoUrl)}&lang=${language}`);
            const data = await response.json();
            spinner.style.display = "none"; // Hide Loading Spinner

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

    // ✅ Prevent Downloading Empty Transcript
    window.downloadTXT = function () {
        const transcriptContainer = document.getElementById("transcript-text");

        if (!transcriptContainer || !transcriptContainer.innerText.trim()) {
            alert("No transcript available to download.");
            return;
        }

        const transcript = transcriptContainer.innerText;
        const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "transcript.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    window.downloadPDF = function () {
        const transcriptContainer = document.getElementById("transcript-text");

        if (!transcriptContainer || !transcriptContainer.innerText.trim()) {
            alert("No transcript available to download.");
            return;
        }

        const transcript = transcriptContainer.innerText;

        if (typeof window.jspdf === "undefined") {
            alert("jsPDF library not loaded. Please check your internet connection.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("YouTube Transcript", 10, 10);
        const lines = doc.splitTextToSize(transcript, 180);
        let y = 20;
        lines.forEach((line) => {
            doc.text(line, 10, y);
            y += 7;
        });
        doc.save("transcript.pdf");
    };
});
