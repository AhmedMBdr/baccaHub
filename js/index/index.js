import {checkLang}from "./functions.js";

const ar = document.querySelector(".ar");
const en = document.querySelector(".en");
const lang = localStorage.getItem("selectedLang") || "en";
if (!localStorage.getItem("selectedLang")) localStorage.setItem("selectedLang", lang);
window.addEventListener("DOMContentLoaded", () => {
    if (lang === "ar") {
        console.log(lang);
        checkLang(ar, en , "rtl", "row-reverse");
    }
    else {
        checkLang(en, ar, "ltr", "row");
    }
});
const activate = (element, other, direction, flexDirection) => {
    element.addEventListener("click", () => checkLang(element, other, direction, flexDirection));
    element.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            checkLang(element, other, direction, flexDirection);
        }
    });
};
activate(ar, en, "rtl", "row-reverse");
activate(en, ar, "ltr", "row");