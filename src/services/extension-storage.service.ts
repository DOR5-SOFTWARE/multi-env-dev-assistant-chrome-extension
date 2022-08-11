import { KeyValueMap } from '../types';

export class ExtensionStorageService {

  private static _instance?: ExtensionStorageService;

  private constructor(isSynchronized: boolean) {
    this.isSynchronized = isSynchronized;
  }

  isSynchronized: boolean;

  private get _storageArea(): chrome.storage.SyncStorageArea | chrome.storage.LocalStorageArea {
    return this.isSynchronized ? chrome.storage.sync : chrome.storage.local;
  }

  static getService(isSynchronized?: boolean): ExtensionStorageService {
    if (!ExtensionStorageService._instance) {
      ExtensionStorageService._instance = new ExtensionStorageService(isSynchronized || false);
    }
    return ExtensionStorageService._instance;
  }

  async getValues(keys: string[]): Promise<KeyValueMap<unknown>> {
    return await this._storageArea.get(keys);
  }

  async setValues(values: KeyValueMap<unknown | null>): Promise<void> {
    return await this._storageArea.set(values);
  }

  async clearValues(keys: string[]): Promise<void> {
    return await this._storageArea.remove(keys);
  }
}
