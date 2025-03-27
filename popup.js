function updateStatus(message) {
  document.getElementById("status").innerText = message;
}

document.getElementById("summarize").addEventListener("click", async () => {
  updateStatus("🎧 Loading audio...");

  chrome.storage.local.get("audioBlob", async ({ audioBlob }) => {
    if (!audioBlob) {
      updateStatus("❌ No audio found.");
      return;
    }

    const blob = new Blob([audioBlob], { type: "audio/webm" });

    updateStatus("🔄 Transcribing...");
    const transcript = await transcribeWithWhisper(blob);

    if (!transcript || transcript.length < 5) {
      updateStatus("❌ Transcription failed.");
      return;
    }

    updateStatus("🤖 Summarizing...");
    const summary = await summarizeWithHuggingFace(transcript);

    document.getElementById("result").value = summary;
    updateStatus("✅ Done!");

    chrome.storage.local.set({ transcript });
  });
});

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function transcribeWithWhisper(blob) {
  const base64Audio = await blobToBase64(blob);

  const response = await fetch("https://api-inference.huggingface.co/models/openai/whisper-large", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_HUGGING_FACE_API_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: base64Audio
    })
  });

  const result = await response.json();
  return result.text || "[No transcription]";
}

async function summarizeWithHuggingFace(text) {
  let response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_HUGGING_FACE_API_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: "summarize: " + text })
  });

  let data = await response.json();
  return data[0].summary_text;
}