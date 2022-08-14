import { KeyValueMap } from '../types';

const functions = {
  getLocalStorageValues: (keys: string[]) => {
    const result: KeyValueMap<string | null> = {};
    keys.forEach(key => {
      result[key] = localStorage.getItem(key);
    });
    console.log('Retrieved the folowing values from local storage: ', result);
    return result;
  },
  setLocalStorageValues: (values: KeyValueMap<string | null>) => {
    Object.keys(values).forEach(key => {
      const value = values[key];
      if (!value) return;
      localStorage.setItem(key, value);
    });
    console.log('Saved the folowing values to local storage: ', values);
  },
  clearLocalStorageValues: (keys: string[]) => {
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('Cleared the folowing values from local storage: ', keys);
  }
}

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    console.log('received message from extension:', {
      message,
      sender
    });
    switch (message) {
      case 'get sync values': {
        sendResponse({ testKey: 'test value' });
        break;
      }
    }
    return true;
  }
);
