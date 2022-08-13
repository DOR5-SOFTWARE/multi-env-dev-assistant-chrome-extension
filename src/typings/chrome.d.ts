declare module chrome.scripting {
  export function registerContentScripts(scripts: any[], callback?: () => void): Promise<void>;
  export function unregisterContentScripts(): Promise<void>;
}

declare module chrome.action {
  export function openPopup(options?: object, callback?: Function): Promise<void>;
}
