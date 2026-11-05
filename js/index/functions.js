import  lang  from "./data/langs.js";

function importLan(language) {
    const selectedLang = lang[language];
    const lngElements = document.querySelectorAll(".lng");
    
    lngElements.forEach((element) => {
        const key = element.getAttribute("data-lng");
        if (selectedLang[key]) {
            element.textContent = selectedLang[key];
        }
    });
}
export function checkLang(lang, otherLang, direction, flexDirection) {
  lang.classList.add("active");
  otherLang.classList.remove("active");
  const string = direction === "rtl" ? "ar" : "en";
  document.documentElement.lang = string;
  document.documentElement.dir = direction;
  document.documentElement.style.setProperty("--direction", direction);
  document.documentElement.style.setProperty("--flex-direction", flexDirection);
  importLan(string);
  localStorage.setItem("selectedLang", string);
}