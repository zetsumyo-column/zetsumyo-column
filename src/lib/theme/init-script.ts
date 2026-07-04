import {
  THEME_CONTRAST_DARK_STORAGE_KEY,
  THEME_CONTRAST_LIGHT_STORAGE_KEY,
} from "@/lib/theme/contrast-tokens";
import { THEME_STORAGE_KEY } from "@/lib/theme/color-tokens";

export { THEME_STORAGE_KEY };

export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")||"light";if(t!=="dark")t="light";var cl=localStorage.getItem("${THEME_CONTRAST_LIGHT_STORAGE_KEY}")||"medium";if(cl!=="low"&&cl!=="high")cl="medium";var cd=localStorage.getItem("${THEME_CONTRAST_DARK_STORAGE_KEY}")||"medium";if(cd!=="low"&&cd!=="high")cd="medium";var d=document.documentElement;d.classList.remove("light","dark","contrast-low","contrast-medium","contrast-high");d.classList.add(t,"contrast-"+(t==="dark"?cd:cl));}catch(e){}})();`;
