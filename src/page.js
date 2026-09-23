// Páginas simples (privacidade, 404): só o tipo de letra e o ano do rodapé.
import './fonts.css';

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
