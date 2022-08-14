import { ExtensionStorageService } from './services/extension-storage.service';
import { IConfig } from './types';

const extensionStorageService = ExtensionStorageService.getService();

// set default configuration values on installation
chrome.runtime.onInstalled.addListener(() => {
  const config: IConfig = {
    localEnvironmentUrl: '',
    syncLocalStorageKeys: []
  };
  chrome.storage.local.set({
    config
  });
  chrome.action.setPopup({
    popup: '../views/options.html'
  })
});

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    switch (message) {
      case 'get sync values': {
        extensionStorageService.getValues(['syncValues']).then(result => {
          sendResponse(result.syncValues);
        });
        break;
      }
    }
    return true;
  }
);
