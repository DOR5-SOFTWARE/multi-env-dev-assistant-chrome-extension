export type KeyValueMap<T> = { [key: string]: T }

export interface IConfig {
  localEnvironmentUrl?: string;
  syncLocalStorageKeys?: string[]
}
