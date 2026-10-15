import { validation, checkLang  } from "./function.js";
const lang =
  localStorage.getItem("selectedLang") ||
  localStorage.setItem("selectedLang", "ar");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const ar = document.querySelector(".ar");
const en = document.querySelector(".en");
const errorMessages = {
  en: {
    name: "Name must be at least 3 characters long.",
    email: "Please enter a valid email address.",
    password: "Password must be at least 6 characters long.",
  },
  ar: {
    name: "يجب أن يكون الاسم 3 أحرف على الأقل.",
    email: "الرجاء إدخال عنوان بريد إلكتروني صالح.",
    password: "يجب أن تكون كلمة المرور 6 أحرف على الأقل.",
  },
};
window.addEventListener("DOMContentLoaded", () => {
    if (lang === "ar") {
        checkLang(ar, en , "rtl", "row-reverse");
    }
    else{
        checkLang(en, ar, "ltr", "row");
    }
})
ar.addEventListener('click', () => checkLang(ar, en, "rtl", "row-reverse"));
en.addEventListener('click', () => checkLang(en, ar, "ltr", "row"));
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");  
    const nameInput = document.getElementById("name");
    const email = emailInput.value;
    const password = passwordInput.value;
    const name = nameInput.value;
    if( validation(nameInput, name.length >= 3, errorMessages[lang].name) && validation(emailInput, emailRegex.test(email), errorMessages[lang].email) && validation(passwordInput, password.length >= 6, errorMessages[lang].password)){
        e.target.submit();
    }
   ;
});