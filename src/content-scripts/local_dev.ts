
chrome.runtime.sendMessage('get sync values', (syncValues) => {
  console.log('received sync values:', syncValues);
  if (!syncValues && chrome.runtime.lastError) {
    console.log('error connecting to the extension', chrome.runtime.lastError);
  }
  if (!syncValues) return;
  Object.keys(syncValues).forEach(key => {
    const value = syncValues[key];
    if (!value) return;
    localStorage.setItem(key, value);
  });
});
