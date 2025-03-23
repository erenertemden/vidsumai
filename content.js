async function getYouTubeAudio() {
  let videoId = new URLSearchParams(window.location.search).get("v");

  if (!videoId) {
      console.error("No Video ID!");
      return;
  }

  let audioUrl = `https://www.y2mate.com/youtube/${videoId}`;

  let response = await fetch(audioUrl);
  let audioBlob = await response.blob();

  chrome.storage.local.set({ "audioBlob": audioBlob }, () => {
      console.log("Voice file saved");
  });
}

getYouTubeAudio();
