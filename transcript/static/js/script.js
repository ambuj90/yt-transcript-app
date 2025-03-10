// document.addEventListener("DOMContentLoaded", function () {
//     const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");
//     const themePicker = document.getElementById("theme-picker");
//     const videoInput = document.getElementById("video-url");

//     // ✅ Toggle Dark Mode
//     if (toggleDarkModeBtn) {
//         toggleDarkModeBtn.addEventListener("click", function () {
//             document.body.classList.toggle("dark-mode");

//             if (document.body.classList.contains("dark-mode")) {
//                 localStorage.setItem("darkMode", "enabled");
//                 toggleDarkModeBtn.innerText = "☀️ Light Mode";
//             } else {
//                 localStorage.setItem("darkMode", "disabled");
//                 toggleDarkModeBtn.innerText = "🌙 Dark Mode";
//             }
//         });
//     }

//     // ✅ Theme Picker
//     if (themePicker) {
//         themePicker.addEventListener("change", function () {
//             document.querySelector(".navbar").classList =
//                 `navbar navbar-expand-lg navbar-dark bg-${themePicker.value} shadow-sm`;
//         });
//     }

//     // ✅ Load Last Used Video URL
//     if (videoInput && localStorage.getItem("lastVideoURL")) {
//         videoInput.value = localStorage.getItem("lastVideoURL");
//     }

//     // ✅ Fetch Transcript
//     window.fetchTranscript = async function () {
//         const videoUrl = videoInput.value;
//         const language = document.getElementById("language-picker").value;
//         const errorMessage = document.getElementById("error-message");
//         const transcriptContainer = document.getElementById("transcript-text");
//         const spinner = document.getElementById("loading-spinner");

//         errorMessage.innerText = "";
//         transcriptContainer.innerText = "";
//         spinner.style.display = "block"; // Show Loading Spinner

//         if (!videoUrl.trim()) {
//             errorMessage.innerText = "Please enter a valid YouTube video URL.";
//             spinner.style.display = "none";
//             return;
//         }

//         localStorage.setItem("lastVideoURL", videoUrl); // Save last video URL

//         try {
//             const response = await fetch(`/api/transcript/?videoUrl=${encodeURIComponent(videoUrl)}&lang=${language}`);
//             const data = await response.json();
//             spinner.style.display = "none"; // Hide Loading Spinner

//             if (data.transcript) {
//                 transcriptContainer.innerText = data.transcript;
//             } else {
//                 errorMessage.innerText = "Failed to fetch transcript.";
//             }
//         } catch (error) {
//             errorMessage.innerText = "An error occurred. Try again.";
//             spinner.style.display = "none";
//         }
//     };

//     // ✅ Prevent Downloading Empty Transcript
//     window.downloadTXT = function () {
//         const transcriptContainer = document.getElementById("transcript-text");

//         if (!transcriptContainer || !transcriptContainer.innerText.trim()) {
//             alert("No transcript available to download.");
//             return;
//         }

//         const transcript = transcriptContainer.innerText;
//         const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
//         const a = document.createElement("a");
//         a.href = URL.createObjectURL(blob);
//         a.download = "transcript.txt";
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//     };

//     window.downloadPDF = function () {
//         const transcriptContainer = document.getElementById("transcript-text");

//         if (!transcriptContainer || !transcriptContainer.innerText.trim()) {
//             alert("No transcript available to download.");
//             return;
//         }

//         const transcript = transcriptContainer.innerText;

//         if (typeof window.jspdf === "undefined") {
//             alert("jsPDF library not loaded. Please check your internet connection.");
//             return;
//         }

//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();
//         doc.text("YouTube Transcript", 10, 10);
//         const lines = doc.splitTextToSize(transcript, 180);
//         let y = 20;
//         lines.forEach((line) => {
//             doc.text(line, 10, y);
//             y += 7;
//         });
//         doc.save("transcript.pdf");
//     };
// });


document.addEventListener("DOMContentLoaded", function () {
    const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");
    const videoInput = document.getElementById("video-url");
    const downloadTXTBtn = document.getElementById("download-txt");
    const downloadPDFBtn = document.getElementById("download-pdf");
    const downloadCSVBtn = document.getElementById("download-csv");

    // ✅ Dark Mode - Check Local Storage & Apply
    function applyDarkMode() {
        if (localStorage.getItem("darkMode") === "enabled") {
            document.body.classList.add("dark-mode");
            toggleDarkModeBtn.innerText = "☀️ Light Mode";
        } else {
            document.body.classList.remove("dark-mode");
            toggleDarkModeBtn.innerText = "🌙 Dark Mode";
        }
    }

    // ✅ Toggle Dark Mode
    toggleDarkModeBtn.addEventListener("click", function () {
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "disabled");
        } else {
            localStorage.setItem("darkMode", "enabled");
        }
        applyDarkMode();
    });

    // ✅ Apply Dark Mode on Page Load
    applyDarkMode();

    // ✅ Hide Download Buttons Initially
    downloadTXTBtn.style.display = "none";
    downloadPDFBtn.style.display = "none";
    downloadCSVBtn.style.display = "none";

    window.fetchTranscript = async function () {
        const videoUrls = videoInput.value.split(",").map(url => url.trim());
        const language = document.getElementById("language-picker").value;
        const errorMessage = document.getElementById("error-message");
        const transcriptContainer = document.getElementById("transcript-text");
        const spinner = document.getElementById("loading-spinner");

        errorMessage.innerText = "";
        transcriptContainer.innerHTML = ""; // Clear previous results
        spinner.style.display = "block"; // Show Loading Spinner

        if (videoUrls.length === 0 || !videoUrls[0].trim()) {
            errorMessage.innerText = "Please enter valid YouTube video URLs.";
            spinner.style.display = "none";
            return;
        }

        const encodedUrls = videoUrls.map(url => encodeURIComponent(url)).join(",");

        try {
            const response = await fetch(`/api/transcript/?videoUrl=${encodedUrls}&lang=${language}`);
            const data = await response.json();
            spinner.style.display = "none"; // Hide Loading Spinner

            let transcriptText = "";
            for (const [url, transcript] of Object.entries(data)) {
                transcriptText += `<strong>${url}</strong>: ${transcript}<br><br>`;
            }

            transcriptContainer.innerHTML = transcriptText;

            // Store transcript data for Download
            window.transcriptData = data;

            // ✅ Show Download Buttons After Fetching Transcript
            downloadTXTBtn.style.display = "inline-block";
            downloadPDFBtn.style.display = "inline-block";
            downloadCSVBtn.style.display = "inline-block";

        } catch (error) {
            errorMessage.innerText = "An error occurred. Try again.";
            spinner.style.display = "none";
        }
    };

    // ✅ Function to Download as TXT
    window.downloadTXT = function () {
        if (!window.transcriptData || Object.keys(window.transcriptData).length === 0) {
            alert("No transcript available to download.");
            return;
        }

        let textContent = "";
        for (const [url, transcript] of Object.entries(window.transcriptData)) {
            textContent += `YouTube Video URL: ${url}\nTranscript:\n${transcript}\n\n`;
        }

        const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "transcripts.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // ✅ Function to Download as PDF
    window.downloadPDF = function () {
        if (!window.transcriptData || Object.keys(window.transcriptData).length === 0) {
            alert("No transcript available to download.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("YouTube Transcripts", 10, 10);

        let y = 20;
        for (const [url, transcript] of Object.entries(window.transcriptData)) {
            doc.text(`Video URL: ${url}`, 10, y);
            y += 10;
            const lines = doc.splitTextToSize(transcript, 180);
            lines.forEach(line => {
                doc.text(line, 10, y);
                y += 7;
            });
            y += 10;
        }

        doc.save("transcripts.pdf");
    };

    // ✅ Function to Download as CSV
    window.downloadCSV = function () {
        if (!window.transcriptData || Object.keys(window.transcriptData).length === 0) {
            alert("No transcript available to download.");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "YouTube Video URL,Transcript\n"; // CSV Header

        for (const [url, transcript] of Object.entries(window.transcriptData)) {
            csvContent += `"${url}","${transcript.replace(/"/g, '""')}"\n`; // Escape double quotes
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transcripts.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
});
