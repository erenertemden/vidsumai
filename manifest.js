{
  "manifest_version": 3,
  "name": "YouTube Audio Transcriber",
  "version": "1.0",
  "description": "YouTube",
  "permissions": ["activeTab", "storage"],
  "host_permissions": ["https://www.youtube.com/*"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["https://www.youtube.com/watch*"],
      "js": ["content.js"]
    }
  ]
}
