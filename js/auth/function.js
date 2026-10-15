import  lang  from "./data/lang.js";
export function validation(element, condition, message) {
  const errorMessage = element.parentElement.querySelector(".error-message");
  const label = element.parentElement.querySelector("label");
  if (!condition) {
    element.classList.add("error");
    label.classList.add("error");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    document.documentElement.style.setProperty(
      "--auth-input-hover",
      "#ff4d4f;",
    );
    return false;
  } else {
    document.documentElement.style.setProperty(
      "--auth-input-hover",
      "#0b7a63;",
    );
    element.classList.remove("error");
    label.classList.remove("error");
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
    return true;
  }
}
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
  if (!lang.classList.contains("active")) {
    lang.classList.add("active");
    otherLang.classList.remove("active");
    document.documentElement.style.setProperty("--auth-direction", direction);
    document.documentElement.style.setProperty(
      "--flex-direction",
      flexDirection,
    );
    const string = direction === "rtl" ? "ar" : "en";
    importLan(string);
    localStorage.setItem("selectedLang", string);
  }
}
