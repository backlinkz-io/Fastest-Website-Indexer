const API_BASE_URL = "https://rapid-indexer.com/api/v1/index.php";

// DOM Elements
const elements = {
  userInfo: document.getElementById('userInfo'),
  userEmail: document.getElementById('userEmail'),
  creditBalance: document.getElementById('creditBalance'),
  statusMessage: document.getElementById('statusMessage'),
  tabs: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  
  // Indexer
  urlsInput: document.getElementById('urlsInput'),
  addCurrentPageBtn: document.getElementById('addCurrentPage'),
  vipQueue: document.getElementById('vipQueue'),
  dripFeed: document.getElementById('dripFeed'),
  dripDays: document.getElementById('dripDays'),
  dripOptions: document.getElementById('dripOptions'),
  engineSelect: document.getElementById('engineSelect'),
  submitIndexerBtn: document.getElementById('submitIndexer'),
  indexerCost: document.getElementById('indexerCost'),

  // Traffic
  trafficUrl: document.getElementById('trafficUrl'),
  trafficQty: document.getElementById('trafficQty'),
  trafficMode: document.getElementById('trafficMode'),
  trafficDays: document.getElementById('trafficDays'),
  trafficDaysGroup: document.getElementById('trafficDaysGroup'),
  trafficCountry: document.getElementById('trafficCountry'),
  trafficDevice: document.getElementById('trafficDevice'),
  trafficType: document.getElementById('trafficType'),
  referringUrl: document.getElementById('referringUrl'),
  addCurrentPageToReferrerBtn: document.getElementById('addCurrentPageToReferrer'),
  googleKeyword: document.getElementById('googleKeyword'),
  referrerGroup: document.getElementById('referrerGroup'),
  keywordGroup: document.getElementById('keywordGroup'),
  submitTrafficBtn: document.getElementById('submitTraffic'),
  trafficCost: document.getElementById('trafficCost'),

  // Settings
  apiKeyInput: document.getElementById('apiKey'),
  saveSettingsBtn: document.getElementById('saveSettings'),
  checkBalanceBtn: document.getElementById('checkBalance'),

  // Footer
  buyCreditsFooter: document.getElementById('buyCreditsFooter')
};

// State
let apiKey = '';

// Costs
const COSTS = {
  INDEXER_PER_URL: 2,
  VIP_EXTRA_PER_URL: 13,
  TRAFFIC_PER_1000: 60
};

// --- Initialization ---

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupEventListeners();
  if (apiKey) {
    fetchUserInfo();
  } else {
    showTab('settings');
    showMessage('Please enter your API Key to get started', 'neutral');
  }
  updateCost(); // Initial calculation
});

async function loadSettings() {
  const result = await chrome.storage.sync.get(['rapidIndexerApiKey']);
  if (result.rapidIndexerApiKey) {
    apiKey = result.rapidIndexerApiKey;
    elements.apiKeyInput.value = apiKey;
  }
}

function setupEventListeners() {
  // Tabs
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => showTab(tab.dataset.tab));
  });

  // Settings
  elements.saveSettingsBtn.addEventListener('click', saveSettings);
  elements.checkBalanceBtn.addEventListener('click', fetchUserInfo);

  // Indexer
  elements.addCurrentPageBtn.addEventListener('click', addCurrentPage);
  elements.dripFeed.addEventListener('change', (e) => {
    elements.dripOptions.classList.toggle('hidden', !e.target.checked);
  });
  elements.submitIndexerBtn.addEventListener('click', submitIndexerTask);
  
  // Cost Updates - Indexer
  elements.urlsInput.addEventListener('input', updateCost);
  elements.vipQueue.addEventListener('change', updateCost);

  // Traffic
  elements.trafficType.addEventListener('change', updateTrafficFields);
  elements.trafficMode.addEventListener('change', (e) => {
    elements.trafficDaysGroup.classList.toggle('hidden', e.target.value !== 'campaign');
  });
  elements.submitTrafficBtn.addEventListener('click', submitTrafficTask);
  elements.addCurrentPageToReferrerBtn.addEventListener('click', addCurrentPageToReferrer);

  // Cost Updates - Traffic
  elements.trafficQty.addEventListener('input', updateCost);

  // Footer
  elements.buyCreditsFooter.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://rapid-indexer.com/payments' });
  });
}

function showTab(tabName) {
  elements.tabs.forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabName);
  });
  elements.tabContents.forEach(c => {
    c.classList.toggle('active', c.id === tabName);
  });
}

function showMessage(msg, type = 'neutral') {
  elements.statusMessage.textContent = msg;
  elements.statusMessage.className = 'status ' + type;
  setTimeout(() => {
    if (elements.statusMessage.textContent === msg) {
      elements.statusMessage.textContent = '';
      elements.statusMessage.className = 'status';
    }
  }, 5000);
}

function updateCost() {
  // Indexer Cost
  const urlsText = elements.urlsInput.value.trim();
  const numUrls = urlsText ? urlsText.split('\n').filter(u => u.trim()).length : 0;
  let indexerCost = numUrls * COSTS.INDEXER_PER_URL;
  if (elements.vipQueue.checked) {
    indexerCost += numUrls * COSTS.VIP_EXTRA_PER_URL;
  }
  elements.indexerCost.textContent = indexerCost;

  // Traffic Cost
  const visitors = parseInt(elements.trafficQty.value, 10) || 0;
  const trafficCost = Math.ceil((visitors / 1000) * COSTS.TRAFFIC_PER_1000);
  elements.trafficCost.textContent = trafficCost;
}

// --- API Interaction ---

async function saveSettings() {
  const key = elements.apiKeyInput.value.trim();
  if (!key) {
    showMessage('API Key cannot be empty', 'error');
    return;
  }
  
  await chrome.storage.sync.set({ rapidIndexerApiKey: key });
  apiKey = key;
  showMessage('Settings saved', 'success');
  fetchUserInfo();
}

async function fetchUserInfo() {
  if (!apiKey) return;

  showMessage('Checking balance...', 'neutral');
  try {
    const response = await fetch(`${API_BASE_URL}?action=me`, {
      method: 'GET',
      headers: { 'X-API-Key': apiKey }
    });
    
    const data = await response.json();
    
    if (data.success && data.user) {
      elements.userInfo.style.display = 'flex'; // Ensure flex display
      elements.creditBalance.textContent = data.user.credits_balance;
      if (data.user.email) {
        elements.userEmail.textContent = data.user.email;
      }
      showMessage('Connected successfully', 'success');
    } else {
      elements.userEmail.textContent = 'Not Connected';
      elements.creditBalance.textContent = '-';
      showMessage('Invalid API Key or connection error', 'error');
    }
  } catch (error) {
    console.error(error);
    showMessage('Network error', 'error');
  }
}

// --- Indexer Functions ---

async function addCurrentPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url) {
    const currentVal = elements.urlsInput.value;
    const separator = currentVal.length > 0 && !currentVal.endsWith('\n') ? '\n' : '';
    elements.urlsInput.value += separator + tab.url;
    updateCost();
    showMessage('URL added', 'success');
  }
}

async function submitIndexerTask() {
  if (!apiKey) {
    showTab('settings');
    showMessage('API Key required', 'error');
    return;
  }

  const urlsText = elements.urlsInput.value.trim();
  if (!urlsText) {
    showMessage('Please enter at least one URL', 'error');
    return;
  }

  const urls = urlsText.split('\n').map(u => u.trim()).filter(u => u);
  
  const payload = {
    urls: urls,
    type: 'indexer',
    engine: elements.engineSelect.value,
    vip: elements.vipQueue.checked,
    drip_feed: elements.dripFeed.checked
  };

  if (elements.dripFeed.checked) {
    payload.drip_duration_days = parseInt(elements.dripDays.value, 10);
  }

  // Optional: Title (using timestamp for now)
  payload.title = `Chrome Ext - ${new Date().toLocaleString()}`;

  showMessage('Submitting...', 'neutral');
  elements.submitIndexerBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}?action=create_task`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.success) {
      showMessage(`Task created! ID: ${data.task_id}`, 'success');
      elements.urlsInput.value = ''; // Clear input
      updateCost();
      fetchUserInfo(); // Refresh credits
    } else {
      showMessage(data.error || 'Submission failed', 'error');
    }
  } catch (error) {
    console.error(error);
    showMessage('Network error', 'error');
  } finally {
    elements.submitIndexerBtn.disabled = false;
  }
}

// --- Traffic Functions ---

function updateTrafficFields() {
  const type = elements.trafficType.value;
  // 1: Google Keyword, 2: Social/Referrer, 3: Direct
  
  if (type === '1') {
    elements.keywordGroup.classList.remove('hidden');
    elements.referrerGroup.classList.add('hidden');
  } else if (type === '2') {
    elements.keywordGroup.classList.add('hidden');
    elements.referrerGroup.classList.remove('hidden');
  } else {
    elements.keywordGroup.classList.add('hidden');
    elements.referrerGroup.classList.add('hidden');
  }
}

async function addCurrentPageToReferrer() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url) {
    elements.referringUrl.value = tab.url;
    showMessage('Referring URL updated', 'success');
  }
}

async function submitTrafficTask() {
  if (!apiKey) {
    showTab('settings');
    showMessage('API Key required', 'error');
    return;
  }

  const link = elements.trafficUrl.value.trim();
  if (!link) {
    showMessage('Target URL required', 'error');
    return;
  }

  const payload = {
    type: 'traffic',
    link: link,
    quantity: parseInt(elements.trafficQty.value, 10),
    mode: elements.trafficMode.value,
    country: elements.trafficCountry.value,
    device: parseInt(elements.trafficDevice.value, 10),
    type_of_traffic: parseInt(elements.trafficType.value, 10)
  };

  const trafficType = elements.trafficType.value;
  if (trafficType === '1') {
    const keyword = elements.googleKeyword.value.trim();
    if (!keyword) {
      showMessage('Keyword required for this traffic type', 'error');
      return;
    }
    payload.google_keyword = keyword;
  } else if (trafficType === '2') {
    const ref = elements.referringUrl.value.trim();
    if (!ref) {
      showMessage('Referring URL required', 'error');
      return;
    }
    payload.referring_url = ref;
  }

  if (elements.trafficMode.value === 'campaign') {
    payload.days = parseInt(elements.trafficDays.value, 10) || 1;
  }

  showMessage('Launching campaign...', 'neutral');
  elements.submitTrafficBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}?action=create_task`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.success) {
      showMessage(`Campaign launched! ID: ${data.task_id}`, 'success');
      fetchUserInfo();
    } else {
      showMessage(data.error || 'Launch failed', 'error');
    }
  } catch (error) {
    console.error(error);
    showMessage('Network error', 'error');
  } finally {
    elements.submitTrafficBtn.disabled = false;
  }
}
