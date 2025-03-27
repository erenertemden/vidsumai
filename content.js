(async () => {
  const video = document.querySelector("video");
  if (!video) {
    console.error("Video not found!");
    return;
  }

  const stream = video.captureStream();
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  recorder.ondataavailable = (e) => chunks.push(e.data);

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "audio/webm" });
    chrome.storage.local.set({ audioBlob: blob }, () => {
      console.log("Audio saved to chrome.storage");
    });
  };

  recorder.start();
  console.log("Recording started...");

  // 20 saniye kayıt yap (isteğe bağlı)
  setTimeout(() => {
    recorder.stop();
    console.log("Recording stopped.");
  }, 20000);
})();
