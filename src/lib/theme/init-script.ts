import { THEME_CONTRAST_STORAGE_KEY } from "@/lib/theme/contrast-tokens";
import { THEME_STORAGE_KEY } from "@/lib/theme/color-tokens";

export { THEME_STORAGE_KEY };

export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")||"light";if(t!=="dark")t="light";var c=localStorage.getItem("${THEME_CONTRAST_STORAGE_KEY}");if(c!=="low"&&c!=="high"){c=localStorage.getItem("theme-contrast-light");if(c!=="low"&&c!=="high"){c=localStorage.getItem("theme-contrast-dark");if(c!=="low"&&c!=="high")c="medium";}}var d=document.documentElement;d.classList.remove("light","dark","contrast-low","contrast-medium","contrast-high");d.classList.add(t,"contrast-"+c);}catch(e){}})();`;
