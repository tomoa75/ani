//globalne varijable
let klikBlokada = false;
const izbornik = document.getElementById("izbornik");
const container = document.getElementById("container");
const tezina = document.getElementById("tezina");
const nestajuca = document.getElementById("start");
const reset = document.getElementById("reset");
const time = document.getElementById("time");
const timerDisplay = document.getElementById("timer");

const brojPoTezini = {
  Lagano: 15,
  Srednje: 21,
  Teško: 27,
};
const pocetniprikaz = {
  Lagano: 7000,
  Srednje: 6000,
  Teško: 5000,
};

const imena = [
  "Mate",
  "Luka",
  "Ivana",
  "Josipa",
  "Dino",
  "Laura",
  "Renato",
  "Sonja",
  "Tomo",
];
let trenutno_stanje = null;
let otvorene = [];

//dohvat svih inputa na docu sa imenom tezina
const odabir = document.querySelectorAll('input[name="tezina"]');

//dohvat odabrane tezine ,te ispis
function azuriraj() {
  const stanje = document.querySelector('input[name="tezina"]:checked');
  tezina.textContent = stanje.value;
  trenutno_stanje = stanje.value;
  timerDisplay.textContent =
    "Vrijeme za igru:\n"  + brojPoTezini[trenutno_stanje] * 4 + " sekunda";
  inicijalizirajElemente();

  console.log(trenutno_stanje);
  console.log(brojPoTezini[trenutno_stanje]);
  reset.classList.add("bezprikaza");
  pokaziSveRekorde.classList.add("bezprikaza");
}

function prikazisve() {
  const prikaz = document.querySelectorAll(".zadnja");
  // Umjesto inline display manipulacije, dodaj klasu
  prikaz.forEach((e) => e.parentElement.classList.add("opened"));
  container.style.pointerEvents = "none";
  setTimeout(() => {
    prikaz.forEach((e) => e.parentElement.classList.remove("opened"));
    container.style.pointerEvents = "all";
  }, pocetniprikaz[trenutno_stanje]);
}

function pokreni(elem) {
  elem.classList.add("bezprikaza");

  prikazisve();
  svirajlj();
  const vrati = document.querySelectorAll(".slika");
  vrati.forEach((k) => k.classList.remove("zabrana"));
  izbornik.classList.add("zabrana");
}

function provjera(arr) {
  const [a, b, c] = arr;

  if (
    a.element.dataset.ime === b.element.dataset.ime &&
    b.element.dataset.ime === c.element.dataset.ime
  ) {
    console.log("pogodak!");
    preostaleSekunde += 3; // dodaj 3 sekunde za svaki pogodak
    time.textContent = "+3 sek.!";
    time.classList.add("flash", "zuta");
    setTimeout(() => {
      time.classList.remove("flash", "zuta");
      time.textContent = "";
    }, 1500);
    svirajpogodak();
    klikBlokada = false;
    [a, b, c].forEach((item) => {
      item.element.parentElement.classList.add("zabrana", "pogodjena"); // ne može se kliknuti
    });
    // ostavi kartice otvorene ili ukloni iz igre
  } else {
    preostaleSekunde -= 1; // oduzmi 1 sekunde za svaki promašaj
    time.textContent = "-1 sek.!";
    
    svirajfail();
    time.classList.add("flash", "zelena");
    setTimeout(() => {
      time.classList.remove("flash", "zelena" );
      time.textContent = "";
      
    }, 1500);

    // zatvori ih nakon 1 sekunde
    setTimeout(() => {
      [a, b, c].forEach((item) => {
        item.element.parentElement.classList.remove("opened");
      });
    }, 700);
  }
  // provjera kraja igre
  const pogodjene = document.querySelectorAll(".pogodjena").length;
  if (pogodjene === brojPoTezini[trenutno_stanje]) {
    klikBlokada = true;
    krajIgre();
  }

  // reset
  otvorene = [];
}
//POBJEDA

async function krajIgre() {
  document.body.classList.remove("cont-active");
  container.classList.remove("aktivna");
  document.getElementById("pobjeda").classList.add("aktivna");
  timerDisplay.textContent = "";

  // izračun bodova

  bodovi += preostaleSekunde * 2 + brojPoTezini[trenutno_stanje] * 2;
  document
    .querySelectorAll(".punti")
    .forEach((el) => (el.textContent = bodovi));
  console.log("Bodovi:", bodovi);
  reset.textContent = "Nova igra";

  atariWin();
  zaustaviOdbrojavanje();

  // provjeri high score
  if (await ulaziUHighScore(bodovi, trenutno_stanje)) {
    pokažiHighscoreModal(async (ime) => {
      await spremiHighScore(ime, bodovi, trenutno_stanje);
      svirajpogodak();
      await ucitajLeaderboard();
    });
  } else {
    await ucitajLeaderboard();
  }
}

//PORAZ
function izgubljenaIgra() {
  document.body.classList.remove("cont-active");
  container.classList.remove("aktivna");
  document.getElementById("poraz").classList.remove("bezprikaza");
  
  svirajtuzno();
  ucitajLeaderboard();
  bodovi = 0; // reset bodova na 0
  timerDisplay.textContent = "";
  reset.classList.remove("bezprikaza"); //prikaz reset botuna
  reset.textContent = "Nova igra";
}

reset.addEventListener("click", ponovnoPokreni);
function ponovnoPokreni() {
  document.body.classList.remove("game-active");
  document.body.classList.remove("cont-active");
  bodovi = 0;
  otvorene = [];
  klikBlokada = false;
  container.classList.remove("aktivna");
  
  document.getElementById("pobjeda").classList.remove("aktivna");

  document.getElementById("poraz").classList.add("bezprikaza");
  document.getElementById("timer").textContent = "o-👀-o";
  zaustaviOdbrojavanje(); // stop odbrojavanje
  izbornik.classList.remove("zabrana");
  nestajuca.classList.remove("bezprikaza");

  pokaziSveRekorde.classList.add("bezprikaza");

  azuriraj(); // učitava kartice i težinu
  const zadnje = document.querySelectorAll(".zadnja");
  zadnje.forEach((z) => z.classList.add("bezprikaza")); // onemogući klikanje na kartice
}

function inicijalizirajElemente() {
  container.innerHTML = ""; // očisti stari sadržaj
  let imenaZaTezinu;

  // odabir koliko imena koristiti po težini
  if (trenutno_stanje === "Lagano")
    imenaZaTezinu = imena.slice(0, 5); // 5 imena * 3 = 15 kartica
  else if (trenutno_stanje === "Srednje")
    imenaZaTezinu = imena.slice(0, 7); // 7*3=21
  else imenaZaTezinu = imena.slice(0, 9); // 9*3=27

  // napravimo niz za stražnje strane (svako ime 3 puta)
  const straznje = [];
  for (let ime of imenaZaTezinu) {
    for (let i = 0; i < 3; i++) {
      straznje.push(ime);
    }
  }

  // promiješaj niz da kartice ne budu pored istih imena
  straznje.sort(() => Math.random() - 0.5);

  for (let i = 0; i < straznje.length; i++) {
    const novi = document.createElement("div");
    novi.classList.add("slika", "zabrana");
    // Prednja strana (broj)
    const prednja = document.createElement("div");
    prednja.classList.add("prednja");
    prednja.textContent = i + 1;
    novi.appendChild(prednja);

    const zadnja = document.createElement("div");
    zadnja.classList.add("zadnja");

    zadnja.textContent = straznje[i]; // ime sa stražnje strane
    zadnja.dataset.ime = straznje[i]; //  pridodajemo vrijednost
    zadnja.dataset.broj = i; //pridodajemo broj kartice umanjen za 1(radi lakseg dohvatanja indexa)
    novi.appendChild(zadnja);

    novi.addEventListener("click", () => {
      if (klikBlokada) return;
      if (novi.classList.contains("opened")) return;
      novi.classList.add("opened"); // otvara karticu

      synth.triggerAttackRelease("C3", 0.1, Tone.now() + 0.05);
      otvorene.push({ index: i, element: zadnja, prednja: prednja });
      console.log(straznje[i]);
      if (otvorene.length === 3) {
        klikBlokada = true;
        provjera(otvorene);
        setTimeout(() => {
          klikBlokada = false;
        }, 300);
      }
    });

    container.appendChild(novi);
  }
}

//inicijalizacija defaultnog prikaza i odabira
azuriraj();

//slusanje promjena
odabir.forEach((dio) => {
  dio.addEventListener("change", azuriraj);
});

nestajuca.addEventListener("click", async () => {
    /* 🔥 FULLSCREEN – MORA BITI PRVO I U KLIKU */
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    await elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    await elem.webkitRequestFullscreen(); // iOS Safari
  }
  // 1️⃣ Tone.js aktivacija – samo jednom!
  if (!window.toneOk) {
    await Tone.start();
    window.toneOk = true;
    console.log("Audio aktiviran!");
    pokaziSveRekorde.classList.add("bezprikaza");
  }
  document.body.classList.add("game-active", "cont-active");
  container.classList.add("aktivna");
  reset.classList.remove("bezprikaza"); //prikaz reset botuna
  reset.textContent = "Napusti igru";
  pokreni(nestajuca, pokaziSveRekorde); //pokrece se igra ,a nestajuca je start ID
  pokreniOdbrojavanje(); // start odbrojavanje
});
