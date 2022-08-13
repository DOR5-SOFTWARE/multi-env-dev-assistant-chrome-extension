export type KeyValueMap<T> = { [key: string]: T }

export interface IConfig {
  localEnvironmentUrl?: string;
  publicEnvironmentUrl?: string;
  syncLocalStorageKeys?: string[];
  ssoDomain?: string;
}
