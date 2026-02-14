/* eslint-disable */
// --- SUPABASE INICIJALIZACIJA ---
const { createClient } = supabase;

const _supabase = createClient(
  "https://cftphiqouyokqspxdpmz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmdHBoaXFvdXlva3FzcHhkcG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODg0MTQsImV4cCI6MjA4MTU2NDQxNH0.mX07DQ3lIwsxs0NJXYdYVBCh7GnOth4zJxEDhpPDxEw",
);

// --- POMOĆNA FUNKCIJA ZA BOJU GUMBA ---
function osvjeziIzgledGumba(li) {
  const textarea = li.querySelector(".detalji");
  const infoGumb = li.querySelector(".info");
  if (textarea.value.trim() !== "") {
    infoGumb.style.backgroundColor = "red";
    infoGumb.style.color = "white";
    infoGumb.textContent = "Detalji";
  } else {
    infoGumb.style.backgroundColor = "";
    infoGumb.style.color = "";
    infoGumb.textContent = "Info";
  }
}

// --- DOM ELEMENTI ---
const unos = document.querySelector(".unos");
const gumbDodaj = document.querySelector(".gumb-dodaj");
const lista = document.querySelector(".lista");
const naslov = document.getElementById("naslov");
const izbor = document.getElementById("izbor");

let blokirajSpremanje = false;

// --- FUNKCIJE ---
function stvoriElementListe(tekst, obavljen) {
  const li = document.createElement("li");
  if (obavljen) li.classList.add("prekrizeno");
  li.innerHTML = `
        <button class="gore" type="button">▲</button>
        <button class="dolje" type="button">▼</button>
        <input type="checkbox" class="prekrizi" ${obavljen ? "checked" : ""} />
        <span class="tekst">${tekst}</span>
        <button class="ukloni" type="button">X</button>
        <button class="info" type="button">Info</button>
        <textarea class="detalji" placeholder="Unesite dodatne detalje..." rows="5" cols="45"></textarea>
        <button class="spremi" type="button">Spremi</button>
    `;
  lista.appendChild(li);
  return li;
}

function osvjeziNaslov() {
  naslov.textContent = izbor.options[izbor.selectedIndex].text;
}

async function spremiUBazu() {
  const trenutniProfil = izbor.value;
  const zadaci = Array.from(lista.querySelectorAll("li")).map((li, index) => ({
    profile_id: trenutniProfil,
    tekst: li.querySelector(".tekst").innerText,
    obavljen: li.classList.contains("prekrizeno"),
    detalji: li.querySelector(".detalji").value || "",
    poredak: index 
  }));

  if (zadaci.length === 0) {
      // Ako je lista prazna, samo obriši sve za taj profil u bazi
      await _supabase.from("todo_tasks").delete().eq("profile_id", trenutniProfil);
      return;
  }

  // 1. Prvo obrišemo sve stare zadatke za taj profil
  const { error: deleteError } = await _supabase
    .from("todo_tasks")
    .delete()
    .eq("profile_id", trenutniProfil);

  if (deleteError) {
      console.error("Greška pri čišćenju baze:", deleteError);
      return;
  }

  // 2. Ubacimo novi, svježi niz s točnim poretkom
  const { error: insertError } = await _supabase
    .from("todo_tasks")
    .insert(zadaci);

  if (insertError) console.error("Greška pri spremanju:", insertError);
}

function spremiLokalno() {
  if (blokirajSpremanje) return;
  const profil = izbor.value;
  const podaci = JSON.parse(localStorage.getItem("mojToDo")) || {};
  podaci[profil] = Array.from(lista.querySelectorAll("li")).map((li,index) => ({
    tekst: li.querySelector(".tekst").innerText,
    obavljen: li.classList.contains("prekrizeno"),
    detalji: li.querySelector(".detalji").value || "",
    poredak:index
  }));
  localStorage.setItem("mojToDo", JSON.stringify(podaci));
}

async function spremiSve() {
  spremiLokalno();
  if (navigator.onLine) await spremiUBazu();
}

async function povuciIzSupabase() {
  blokirajSpremanje = true;
  lista.innerHTML = "";
  const trenutniProfil = izbor.value;

  const { data, error } = await _supabase
    .from("todo_tasks")
    .select("*")
    .eq("profile_id", trenutniProfil)
    .order("poredak", { ascending: true });

  if (error || !data || data.length === 0) {
    ucitajZadatkeIzMemorije(); // Ako nema u bazi, uzmi iz localstorage
    blokirajSpremanje = false;
    return;
  }

  data.forEach((z) => {
    const li = stvoriElementListe(z.tekst, z.obavljen);
    li.querySelector(".detalji").value = z.detalji || "";
    osvjeziIzgledGumba(li); // <--- Crveni gumb kod povlačenja
  });

  blokirajSpremanje = false;
}

function ucitajZadatkeIzMemorije() {
  const profil = izbor.value;
  const podaci = JSON.parse(localStorage.getItem("mojToDo")) || {};
  const mojiZadaci = podaci[profil] || [];

  mojiZadaci.forEach((z) => {
    const li = stvoriElementListe(z.tekst, z.obavljen);
    li.querySelector(".detalji").value = z.detalji || "";
    osvjeziIzgledGumba(li); // <--- Crveni gumb kod memorije
  });
}

async function sinkronizirajOfflinePodatke() {
  const profil = izbor.value;
  const podaci = JSON.parse(localStorage.getItem("mojToDo")) || {};
  const lokalni = podaci[profil];

  if (!lokalni || lokalni.length === 0) return;

  // 1. Obriši stare da napraviš mjesta za lokalne s točnim poretkom
  await _supabase.from("todo_tasks").delete().eq("profile_id", profil);

  // 2. Ubaci lokalne
  const { error } = await _supabase.from("todo_tasks").insert(lokalni.map(z => ({
      profile_id: profil,
      tekst: z.tekst,
      obavljen: z.obavljen,
      detalji: z.detalji || "",
      poredak: z.poredak // Koristimo onaj index koji je spremljen u memoriji
  })));

  if (!error) {
      console.log("Sinkronizacija uspjela.");
  }
}

// --- EVENT LISTENERI ---
document.addEventListener("DOMContentLoaded", async () => {
  osvjeziNaslov();
  if (navigator.onLine) {
    await sinkronizirajOfflinePodatke();
    await povuciIzSupabase();
  } else {
    ucitajZadatkeIzMemorije();
  }
});

window.addEventListener("online", async () => {
  console.log("Internet ponovno dostupan – pokrećem sinkronizaciju");

  await sinkronizirajOfflinePodatke();
  await povuciIzSupabase();
});

izbor.addEventListener("change", async () => {
  osvjeziNaslov();
  if (navigator.onLine) {
    await sinkronizirajOfflinePodatke();
    await povuciIzSupabase();
  } else {
    ucitajZadatkeIzMemorije();
  }
});

gumbDodaj.addEventListener("click", (e) => {
  const tekst = unos.value.trim();
  if (!tekst) return;
  stvoriElementListe(tekst, false);
  spremiSve();
  unos.value = "";
});

lista.addEventListener("click", async (e) => {
    const kliknut = e.target;
    const li = kliknut.closest("li");
    if (!li) return;

// --- STRELICA GORE ---
    if (kliknut.classList.contains("gore")) {
        const onajIznad = li.previousElementSibling;
        if (!onajIznad) return; 
        lista.insertBefore(li, onajIznad);
        await spremiSve();
        return; // Završi s ovim klikom
    }

    // --- STRELICA DOLJE ---
    if (kliknut.classList.contains("dolje")) {
        const onajIspod = li.nextElementSibling;
        if (!onajIspod) return;
        lista.insertBefore(onajIspod, li);
        await spremiSve();
        return;
    }

    // --- 1. LOGIKA ZA UKLANJANJE ---
    if (kliknut.classList.contains("ukloni")) {
        const tekstZadatka = li.querySelector(".tekst").innerText;
        const trenutniProfil = izbor.value;

        li.remove(); // Brišemo iz HTML-a

        if (navigator.onLine) {
            try {
                await _supabase
                    .from("todo_tasks")
                    .delete()
                    .eq("profile_id", trenutniProfil)
                    .eq("tekst", tekstZadatka);
                console.log("Obrisano s baze.");
            } catch (err) {
                console.error("Greška kod brisanja:", err.message);
            }
        }
        await spremiSve(); // Ažurira LocalStorage odmah
    } 

    // --- 2. LOGIKA ZA PREKRIŽITI (CHECKBOX) ---
    else if (kliknut.classList.contains("prekrizi")) {
        li.classList.toggle("prekrizeno", kliknut.checked);
        await spremiSve();
    } 

    // --- 3. LOGIKA ZA INFO GUMB (OTVARANJE TEXTAREA) ---
    else if (kliknut.classList.contains("info")) {
        li.querySelector(".detalji").classList.toggle("prikazi-detalje");
        li.querySelector(".spremi").classList.toggle("prikazi");
    } 

    // --- 4. LOGIKA ZA SPREMANJE DETALJA ---
    else if (kliknut.classList.contains("spremi")) {
        osvjeziIzgledGumba(li);
        li.querySelector(".detalji").classList.remove("prikazi-detalje");
        kliknut.classList.remove("prikazi");
        await spremiSve();
    }
});
