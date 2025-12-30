// timer.js
let preostaleSekunde = null;
let odbrojavanjeInterval = null;
let bodovi=0;

function formatirajVrijeme(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `Vrijeme: ${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

function pokreniOdbrojavanje() {
  clearInterval(odbrojavanjeInterval);
  preostaleSekunde = brojPoTezini[trenutno_stanje]*4; // vrijeme igre ovisno o težini(15,21,27)pomnoženo sa 4
  document.getElementById("timer").textContent =
    formatirajVrijeme(preostaleSekunde);

  odbrojavanjeInterval = setInterval(() => {
    preostaleSekunde--;
    document.getElementById("timer").textContent =
      formatirajVrijeme(preostaleSekunde);

    if (preostaleSekunde <= 0) {
      clearInterval(odbrojavanjeInterval);
      izgubljenaIgra(); // poziva funkciju iz code.js
    }
  }, 1000);
}
// Zaustavlja odbrojavanje i dodaje bodove
function zaustaviOdbrojavanje() {
  clearInterval(odbrojavanjeInterval);

  
}
