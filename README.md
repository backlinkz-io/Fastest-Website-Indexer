# Rapid Indexer - Fastest Website Indexing Service & SEO Tool

**Rapid Indexer** is the [fastest website indexing service](https://rapid-indexer.com/) on the market, designed to get your URLs indexed by Google and Yandex in minutes, not weeks. By combining direct API submissions with our proprietary [Viral Blast](https://rapid-indexer.com/viral-blast) technology, we prove to search algorithms that your content is trending and worthy of immediate ranking.

## Why We Are The Fastest Website Indexing Service

In the modern SEO landscape, simply submitting a sitemap isn't enough. Search engines prioritize content that shows user engagement. Rapid Indexer solves this by treating indexing as a two-step process:

1.  **Direct Submission:** We force crawl your links immediately.
2.  **Viral Simulation:** Our [Viral Blast](https://rapid-indexer.com/viral-blast) engine drives randomized, high-retention traffic from social referrers (Twitter, Reddit, Facebook) to your new links. This "User Signal" validates your content, preventing de-indexing and boosting ranking speed.

Whether you are an agency managing thousands of backlinks or a site owner needing to index a new blog post, Rapid Indexer provides the speed and reliability you need.

[**Start Indexing Now**](https://rapid-indexer.com/)

---

# Official Chrome Extension

This repository contains the source code for the [Rapid Indexer Chrome Extension](https://rapid-indexer.com/chrome-extension). This tool integrates the fastest website indexing service directly into your browser workflow, allowing you to submit URLs and launch traffic campaigns without ever leaving your current tab.

## Features

*   **Instant Indexing:** Submit the current tab's URL to the indexing queue with a single click.
*   **Context Menu Integration:** Right-click any link on any webpage and select "Rapid Indexer: Index this link" to submit it immediately.
*   **Viral Traffic Generator:** Launch a [Viral Blast](https://rapid-indexer.com/viral-blast) directly from the popup. Drive real, residential IP traffic to any URL to simulate viral growth.
*   **Smart Referrers:** Use the "Current Page" feature to set the referring URL for your traffic campaigns (e.g., simulate traffic coming *from* a specific tweet or authority article).
*   **Real-time Cost Calculator:** See the credit cost for VIP queuing, drip feeds, and traffic campaigns before you submit.

## Installation

1.  Download or clone this repository.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the directory containing the extension files (`manifest.json`, `popup.html`, etc.).

## Setup & Usage

### 1. Connect Your Account
To use the extension, you need a Rapid Indexer API Key.
1.  Log in to your [Rapid Indexer Dashboard](https://rapid-indexer.com/).
2.  Copy your API Key from the settings area.
3.  Open the extension, go to the **Settings** tab, paste your key, and click **Save Settings**.

### 2. Submit URLs for Indexing
*   **Current Page:** Click "Add Current Page" in the **Indexer** tab to queue the site you are currently visiting.
*   **Bulk Entry:** Paste a list of URLs (one per line) into the text area.
*   **VIP Queue:** Check the "VIP Queue" box for priority processing (ideal for money sites).

### 3. Launch Traffic Campaigns
Navigate to the **Traffic** tab to drive visitors to your links.
*   **Target:** Enter the URL you want to boost.
*   **Source:** Choose between Google Keyword search, Social/Custom Referrer, or Direct traffic.
*   **Referrer Strategy:** Use the "Current Page" button next to the Referring URL field to easily set the page you are on as the source of the traffic.

## Permissions & Privacy

We value your privacy and only request permissions necessary to provide the fastest website indexing service experience.

*   **`activeTab`**: Required to retrieve the URL of your current tab when you explicitly click "Add Current Page" or use the Referrer feature. We do not track your browsing history.
*   **`contextMenus`**: Adds the right-click submission feature.
*   **`storage`**: Used solely to securely store your API Key locally on your device.
*   **Host Permissions**: The extension communicates exclusively with `https://rapid-indexer.com/api/*` to process your submission requests.

## Support

For account management, credit purchases, or to view detailed reports, visit the [Rapid Indexer Dashboard](https://rapid-indexer.com/).

