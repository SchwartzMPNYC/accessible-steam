const url = '*://*.store.steampowered.com/*';
const onUpdateFilter = { urls: [url], properties: ['status'] };

const applyCssToTab = ({ id }) => browser.tabs.insertCSS(id, { file: 'accessibility.css' });
const applyCssToAllTabs = steamTabs => steamTabs.forEach(applyCssToTab);

// Check tabs on initital load
browser.tabs.query({ url }).then(applyCssToAllTabs).catch(console.error);
// Apply css to new steam tabs
browser.tabs.onUpdated.addListener(applyCssToTab, onUpdateFilter);
