export const THEME_STORAGE_KEY = "theme";

export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")||"light";if(t!=="dark")t="light";var d=document.documentElement;d.classList.remove("light","dark");d.classList.add(t);}catch(e){}})();`;
