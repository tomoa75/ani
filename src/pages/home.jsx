import { useState, useEffect } from "react";
const fontovi = [
  "Architects Daughter",
  "Indie Flower",
  "Shadows Into Light",
  "Nothing You Could Do",
  "Marck Script",
  "Dancing Script",
  "Satisfy",
  "Patrick Hand",
  "Amatic SC",
  "Yellowtail",
];
export default function Home() {
  const [aktfontovi, setAktfontovi] = useState(0);
  // Ovaj useEffect se pokreće svaki put kad se promjeni 'aktfontovi'
  useEffect(() => {
    const trenutniFont = fontovi[aktfontovi];
    // Postavlja CSS varijablu --font na razini cijele stranice
    document.documentElement.style.setProperty(
      "--font",
      `"${trenutniFont}", cursive`,
    );
  }, [aktfontovi]);

  return (
    <div>
      <header className="krasopis">
        <h1>ANI</h1>
        <h3>Obrt za trgovinu,prijevoz i usluge</h3>
        <h3>Trafika Piano</h3>
      </header>
      <hr />
      <button
        className="font-switcher"
        onClick={() => setAktfontovi((prev) => (prev + 1) % fontovi.length)}
      >
        PROMIJENI FONT (trenutni font: {fontovi[aktfontovi]})
      </button>
      <hr />
      <article>
        <h3>O nama</h3>
        <p>
          Ani obrt posluje od davne 1995. godine ,te je osnovan u Kaštel
          Starom.Vlasnik obrta je Tomislav Moranduzzo,a ime obrta "Ani" je
          posvećeno njegovom djedu Ivanu Moranduzzo koji je u Kaštelima u svoje
          vrijeme bio poznat kao "Ani".
        </p>
        <p>
          Obrt je u početku vodio Tomislavov otac Ivan ,da bi Tomislav preuzeo
          vođenje 2004. godine.
        </p>
        <p>
          Sjedište obrta je bilo do 2013.godine u Kaštel Starom, a od tada je
          premješteno na trenutnu lokaciju u Kaštel Kambelovcu na adresi Cesta
          Franje Tuđmana 638.
        </p>
        <p>
          Glavna djelatnost obrta je trgovina koja se obavlja u sklopu naše
          trgovine "Trafika Piano".
        </p>
        <p>
          Obrt je registriran i za usluge prijevoza ,ali trenutno ne vršimo te
          usluge.
        </p>
        <p>
          Vršimo usluge fotokopiranja,printanja,skeniranja dokumenata u boji te
          slanja na email.
        </p>
        <p>
          U sklopu digitalnih usluga u prvom redu nudimo izradu Web stranica,ali
          i aplikacije prilagođene vašim potrebama.
        </p>
        <p>
          Obratite nam se sa svojim zahtjevima,pa uz dogovor možemo razmotriti
          opcije izvedivosti.
        </p>
      </article>
    </div>
  );
}
