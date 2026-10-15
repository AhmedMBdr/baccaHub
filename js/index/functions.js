import  lang  from "./data/langs.js";

export function importLan(language) {
    const selectedLang = lang[language];
    const lngElements = document.querySelectorAll(".lng");
    
    lngElements.forEach((element) => {
        const key = element.getAttribute("data-lng");
        if (selectedLang[key]) {
            element.textContent = selectedLang[key];
        }
    });
}
