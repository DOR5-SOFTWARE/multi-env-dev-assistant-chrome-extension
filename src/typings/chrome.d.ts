declare module chrome.scripting {
  export function registerContentScripts(scripts: any[], callback?: () => void): Promise<void>;
}
