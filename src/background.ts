import { IConfig } from './types';

// set default configuration values on installation
chrome.runtime.onInstalled.addListener(() => {
  const config: IConfig = {
    localEnvironmentUrl: '',
    syncLocalStorageKeys: []
  };
  chrome.storage.local.set({
    config
  });
  chrome.runtime.openOptionsPage();
});
