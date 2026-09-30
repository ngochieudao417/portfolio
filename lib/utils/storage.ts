export const STORAGE_KEYS = {
  theme: "dnh:theme",
  locale: "dnh:locale",
  recruiter: "dnh:recruiter",
} as const;

/** localStorage can throw (private mode, blocked storage) — never let that break the page. */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

/**
 * Runs before first paint (inlined in <head>) so the stored theme, recruiter
 * mode and language apply without a flash.
 */
export const preferenceScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("${STORAGE_KEYS.theme}");d.setAttribute("data-theme",t==="light"?"light":"dark");if(localStorage.getItem("${STORAGE_KEYS.recruiter}")==="1"){d.setAttribute("data-recruiter","true");}var l=localStorage.getItem("${STORAGE_KEYS.locale}");if(l==="vi"||l==="en"){d.lang=l;}}catch(e){}})();`;
