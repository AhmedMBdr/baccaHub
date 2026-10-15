import {importLan}from "./functions.js";
const login = document.querySelectorAll('.log-in');
login.forEach((login) => {
    login.addEventListener('click', () => {
        window.location.href = 'auth/login.html';
    })
})
const signup = document.querySelectorAll('.sign-up');
signup.forEach((signup) => {
    signup.addEventListener('click', () => {
        window.location.href = 'auth/signup.html';
    })
})
const ar = document.querySelector('.ar');
const en = document.querySelector('.en');
ar.addEventListener('click', () => {
    if (!ar.classList.contains('active')) {
        ar.classList.add('active');
        en.classList.remove('active');
        document.documentElement.style.setProperty("--direction", "rtl");
        document.documentElement.style.setProperty('--flex-direction', 'row-reverse');
        importLan('ar'); 
    }
});
en.addEventListener('click', () => {
    if (!en.classList.contains('active')) {
        en.classList.add('active');
        ar.classList.remove('active');
        document.documentElement.style.setProperty("--direction", "ltr");
        document.documentElement.style.setProperty('--flex-direction', 'row');
        importLan('en'); 
    }
});