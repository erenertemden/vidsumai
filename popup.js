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

document.getElementById("summarize").addEventListener("click", async function() {
  chrome.storage.local.get("transcript", async function(data) {
      if (!data.transcript) {
          document.getElementById("result").innerText = "no transcript!";
          return;
      }

      let summary = await summarizeWithHuggingFace(data.transcript);
      document.getElementById("result").innerText = summary;
  });
});
