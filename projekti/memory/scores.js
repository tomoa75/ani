const pokaziSveRekorde = document.getElementById("leaderboard");
const header = document.querySelector("header");
const SUPABASE_URL = "https://cftphiqouyokqspxdpmz.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmdHBoaXFvdXlva3FzcHhkcG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODg0MTQsImV4cCI6MjA4MTU2NDQxNH0.mX07DQ3lIwsxs0NJXYdYVBCh7GnOth4zJxEDhpPDxEw";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase klijent inicijaliziran:", supabaseClient);

async function ucitajLeaderboard() {
  pokaziSveRekorde.classList.remove("bezprikaza");
  header.classList.remove("hide-mobile");

  const tezine = ["Lagano", "Srednje", "Teško"];

  for (const t of tezine) {
    const lista = document.getElementById("lb-" + t);
    lista.innerHTML = "";

    const { data, error } = await supabaseClient
      .from("scores")
      .select("name, bodovi")
      .eq("difficulty", t)
      .order("bodovi", { ascending: false })
      .limit(3);

    if (!error && data.length > 0) {
      data.forEach((s) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${s.name}</span><strong>${s.bodovi}</strong>`;
        lista.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "Nema rezultata";
      li.classList.add("prazno");
      lista.appendChild(li);
    }
  }
}

async function ulaziUHighScore(bodovi, tezina) {
  const { data, error } = await supabaseClient
    .from("scores")
    .select("bodovi")
    .eq("difficulty", tezina)
    .order("bodovi", { ascending: false })
    .limit(3);

  if (error || data.length < 3) return true;

  return bodovi > data[data.length - 1].bodovi;
}

async function spremiHighScore(ime, bodovi, tezina) {
  await supabaseClient.from("scores").insert([
    {
      name: ime,
      bodovi: bodovi,
      difficulty: tezina,
    },
  ]);

  // osvježi leaderboard
  await ucitajLeaderboard();
}

function pokažiHighscoreModal(callback) {
  const modal = document.getElementById("highscoreModal");
  const input = document.getElementById("hsIme");
  const btn = document.getElementById("hsSpremi");

  modal.classList.add("active");
  input.value = "";

  setTimeout(() => input.focus(), 100); // mobitel-safe

  const handler = async () => {
    const ime = input.value.trim() || "Igrač";

    input.blur(); // zatvori virtualnu tipkovnicu

    modal.classList.remove("active");

    btn.removeEventListener("pointerup", handler);
    callback(ime);
  };

  btn.addEventListener("pointerup", handler);
}

ucitajLeaderboard();
