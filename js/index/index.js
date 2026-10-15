import {checkLang}from "./functions.js";

const ar = document.querySelector(".ar");
const en = document.querySelector(".en");
const lang = localStorage.getItem("selectedLang") || localStorage.setItem("selectedLang", "en");
console.log(lang);
window.addEventListener("DOMContentLoaded", () => {
    if (lang === "ar") {
        console.log(lang);
        checkLang(ar, en , "rtl", "row-reverse");
    }
    else {
        checkLang(en, ar, "ltr", "row");
    }
});
const login = document.querySelectorAll('.log-in');
login.forEach((login) => {
    login.addEventListener('click', () => {
        window.location.href = 'pages/auth/login.html';
    })
})
const signup = document.querySelectorAll('.sign-up');
signup.forEach((signup) => {
    signup.addEventListener('click', () => {
        window.location.href = 'pages/auth/signup.html';
    })
})


ar.addEventListener('click', () => checkLang(ar, en, "rtl", "row-reverse"));
en.addEventListener('click', () => checkLang(en, ar, "ltr", "row"));