import { KeyValueMap } from '../types';

export class ActiveTabStorageService {

  private static _instance?: ActiveTabStorageService;

  private async _getActiveTabId() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      throw Error('active tab not found');
    }
    return tab.id;
  }

  private _injectFunctions = {
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

  private constructor() { }

  static getService(): ActiveTabStorageService {
    if (!ActiveTabStorageService._instance) {
      ActiveTabStorageService._instance = new ActiveTabStorageService();
    }
    return ActiveTabStorageService._instance;
  }

  async getValues(keys: string[], callback: (result: KeyValueMap<string | null>) => void): Promise<void> {
    chrome.scripting.executeScript(
      {
        target: { tabId: await this._getActiveTabId() },
        func: this._injectFunctions.getLocalStorageValues,
        args: [keys]
      },
      (injectionResults) => {
        const result = injectionResults[0].result;
        callback(result);
      }
    );
  }

  async setValues(values: KeyValueMap<string | null>): Promise<void> {
    chrome.scripting.executeScript({
      target: { tabId: await this._getActiveTabId() },
      func: this._injectFunctions.setLocalStorageValues,
      args: [values],
    });
  }

  async clearValues(keys: string[]): Promise<void> {
    chrome.scripting.executeScript({
      target: { tabId: await this._getActiveTabId() },
      func: this._injectFunctions.clearLocalStorageValues,
      args: [keys],
    });
  }
}
