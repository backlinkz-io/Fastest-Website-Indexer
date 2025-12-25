// Background service worker

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "rapidIndexLink",
    title: "Rapid Indexer: Index this link",
    contexts: ["link"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "rapidIndexLink" && info.linkUrl) {
    // We need the API key to perform the action.
    const result = await chrome.storage.sync.get(['rapidIndexerApiKey']);
    const apiKey = result.rapidIndexerApiKey;

    if (!apiKey) {
      // Notify user they need to set API key
      // Since we can't easily open popup, we might open options or show notification
      // For now, let's just log or try to alert if possible (alert not available in SW)
      console.log("API Key missing");
      return;
    }

    try {
      await submitLink(info.linkUrl, apiKey);
    } catch (err) {
      console.error("Submission failed", err);
    }
  }
});

async function submitLink(url, apiKey) {
  const API_BASE_URL = "https://rapid-indexer.com/api/v1/index.php";
  
  const payload = {
    urls: [url],
    type: 'indexer',
    engine: 'google',
    title: 'Context Menu Submission'
  };

  const response = await fetch(`${API_BASE_URL}?action=create_task`, {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  // In a real extension, we might show a notification here
  if (data.success) {
    console.log("Indexed successfully:", data);
  } else {
    console.error("Indexing failed:", data);
  }
}

