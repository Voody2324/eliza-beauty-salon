// Statikus oldalgenerátor: a közös fejléc/időpontkérő/lábléc egy helyen van,
// a kimenet sima HTML (a Netlify Forms így felismeri az űrlapokat).
// Futtatás: node build.mjs  →  ./site mappa
import { mkdirSync, writeFileSync, cpSync, readFileSync, rmSync } from 'node:fs';

const SITE = 'https://elizabeauty-hazi.netlify.app';
const ki = 'site';
rmSync(ki, { recursive: true, force: true });
mkdirSync(ki, { recursive: true });
for (const d of ['css', 'js', 'img', 'fonts']) cpSync(d, `${ki}/${d}`, { recursive: true });

// Vonalas ikonok (Lucide-stílus)
const ik = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  nyil: ik('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  level: ik('<path d="M12 3c-4 4-6 7.5-6 10.5a6 6 0 0 0 12 0C18 10.5 16 7 12 3z"/><path d="M12 21v-8"/>'),
  szivecske: ik('<path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 0 1 12 6a5 5 0 0 1 7.5 6.6z"/>'),
  pajzs: ik('<path d="M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/>'),
  szikra: ik('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
  pipa: ik('<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
  hely: ik('<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  telefon: ik('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
  email: ik('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  ora: ik('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  csepp: ik('<path d="M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0c0-4.3 6-10.5 6-10.5z"/>'),
  nap: ik('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  csillag: ik('<path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7L12 3z"/>'),
};

const kep = (nev, alt, { szeles = '(max-width: 900px) 100vw, 50vw', eager = false, w = 1600, h = 1066 } = {}) =>
  `<img src="img/${nev}-1600.webp" srcset="img/${nev}-800.webp 800w, img/${nev}-1600.webp 1600w" sizes="${szeles}" width="${w}" height="${h}" alt="${alt}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;

const MERET = { belico: [1600, 1066], hatoanyag: [1600, 1066], eliza: [1600, 2504], folyamat: [1600, 2400], hero: [1600, 2288], mesotica: [1600, 2398], szalon: [1600, 2400], tovabbi: [1600, 2400] };
const k = (nev, alt, o = {}) => kep(nev, alt, { w: MERET[nev][0], h: MERET[nev][1], ...o });

const menuPontok = [
  ['index.html', 'Főoldal'],
  ['kezelesek.html', 'Kezelések'],
  ['rolunk.html', 'Rólunk'],
  ['kapcsolat.html', 'Kapcsolat'],
];

const fejlec = (aktiv) => `
<a class="skip" href="#tartalom">Ugrás a tartalomra</a>
<header class="fejlec">
  <div class="wrap">
    <a class="logo" href="index.html" aria-label="Eliza Beauty Salon – főoldal"><img src="img/logo.svg" alt="Eliza Beauty Salon" width="160" height="52"></a>
    <button class="hamburger" aria-label="Menü" aria-expanded="false" aria-controls="fomenu"><span></span><span></span><span></span></button>
    <nav class="menu" id="fomenu" aria-label="Fő navigáció">
      <ul>${menuPontok.map(([h, t]) => `<li><a href="${h}"${h === aktiv ? ' aria-current="page"' : ''}>${t}</a></li>`).join('')}</ul>
      <a class="btn" href="#idopont">Időpontot kérek</a>
    </nav>
  </div>
</header>`;

const idopontUrlap = (azon = 'ip') => `
<form class="urlap" name="idopont" method="POST" action="/koszonjuk.html" data-netlify="true" netlify-honeypot="bot-mezo">
  <input type="hidden" name="form-name" value="idopont">
  <p class="rejtett"><label>Ne töltsd ki: <input name="bot-mezo" tabindex="-1" autocomplete="off"></label></p>
  <div><label for="${azon}-nev">Teljes név</label><input id="${azon}-nev" type="text" name="nev" autocomplete="name" required></div>
  <div><label for="${azon}-email">E-mail cím</label><input id="${azon}-email" type="email" name="email" autocomplete="email" required></div>
  <div><label for="${azon}-uzenet">Üzenet</label><textarea id="${azon}-uzenet" name="uzenet" required placeholder="Melyik kezelés érdekel, mikor lenne jó számodra?"></textarea></div>
  <label class="jelolo"><input type="checkbox" name="adatkezeles" value="elfogadva" required> <span>Elolvastam és elfogadom az <a href="adatkezeles.html">adatkezelési tájékoztatót</a>.</span></label>
  <button class="btn" type="submit">Küldés ${I.nyil}</button>
</form>`;

const elerhetoseg = `
<ul class="elerhetoseg">
  <li>${I.hely}<span>1092 Budapest, Ráday u. 1.</span></li>
  <li>${I.telefon}<a href="tel:+36203449272">+36 20 344 9272</a></li>
  <li>${I.email}<a href="mailto:hello.elizabeauty@gmail.com">hello.elizabeauty@gmail.com</a></li>
  <li>${I.ora}<span>H–P: 9:00–16:00, kizárólag előre egyeztetett időpontra<br>Szo–V: zárva</span></li>
</ul>`;

const idopontSzakasz = `
<section id="idopont" class="puder">
  <div class="wrap kapcsolat-racs">
    <div class="mozog">
      <span class="kicker">Időpontkérés</span>
      <h2>Foglalj időpontot, és induljon a változás!</h2>
      <p class="halvany">Kérdésed van a kezelésekről, vagy időpontot szeretnél egyeztetni? Keress bizalommal, és segítek megtalálni a számodra legjobb megoldást!</p>
      ${elerhetoseg}
    </div>
    <div class="idopont-doboz mozog" style="--kesleltet:.15s">${idopontUrlap('ip')}</div>
  </div>
</section>`;

const lablec = `
<footer class="lablec">
  <div class="wrap">
    <div class="racs">
      <div>
        <img src="img/logo-feher.svg" alt="Eliza Beauty Salon" width="172" height="56" loading="lazy">
        <p>Személyre szabott kozmetikai kezelések bőrfiatalításra és problémás bőr kezelésére, modern technológiákkal és természetes hatóanyagokkal.</p>
      </div>
      <div>
        <h3>Elérhetőség</h3>
        <ul>
          <li>1092 Budapest, Ráday u. 1.</li>
          <li><a href="tel:+36203449272">+36 20 344 9272</a></li>
          <li><a href="mailto:hello.elizabeauty@gmail.com">hello.elizabeauty@gmail.com</a></li>
        </ul>
      </div>
      <div>
        <h3>Nyitvatartás</h3>
        <ul><li>H–P: 9:00–16:00</li><li>Szo–V: zárva</li><li>Kizárólag előre egyeztetett időpontra</li></ul>
      </div>
      <div>
        <h3>Oldalak</h3>
        <ul>${menuPontok.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
      </div>
    </div>
    <div class="also">
      <span>© ${new Date().getFullYear()} Eliza Beauty Salon – Minden jog fenntartva!</span>
      <a href="adatkezeles.html">Adatkezelési tájékoztató</a>
    </div>
  </div>
</footer>`;

const oldal = ({ fajl, cim, leiras, aktiv, tartalom, idopont = true, jsonld = '' }) => {
  const html = `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.classList.add('js')</script>
<title>${cim}</title>
<meta name="description" content="${leiras}">
<link rel="canonical" href="${SITE}/${fajl === 'index.html' ? '' : fajl}">
<meta property="og:type" content="website">
<meta property="og:title" content="${cim}">
<meta property="og:description" content="${leiras}">
<meta property="og:image" content="${SITE}/img/hero-1600.webp">
<meta property="og:locale" content="hu_HU">
<meta name="theme-color" content="#FAF6F2">
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="img/favicon.png" type="image/png">
<link rel="preload" href="fonts/cormorant-garamond-500-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/jost-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/fonts.css">
<link rel="stylesheet" href="css/style.css">
${jsonld}
</head>
<body>
${fejlec(aktiv)}
<main id="tartalom">
${tartalom}
${idopont ? idopontSzakasz : ''}
</main>
${lablec}
<script src="js/main.js" defer></script>
</body>
</html>
`;
  writeFileSync(`${ki}/${fajl}`, html);
};

// ---------- Közös blokkok ----------
const velemenyek = `
<section>
  <div class="wrap">
    <div class="fejresz kozep mozog">
      <span class="kicker">A minőség mércéje: a visszatérő vendégek</span>
      <h2>Valódi eredmények, elégedett vendégek</h2>
    </div>
    <div class="racs racs-2">
      <figure class="velemeny mozog">
        <div class="csillag" aria-label="5 csillag">★★★★★</div>
        <blockquote>„Korábbi rossz tapasztalatok miatt sokáig nem mertem kozmetikushoz járni, de ez az itt töltött első alkalmat követően megváltozott. A bőröm minden kezelés után szinte ragyog, remekül érzem magam, és Eliza segítségével sikerült kialakítanom a helyes, bőrtípusomnak megfelelő arcápolási rutint. Szívből ajánlom!”</blockquote>
        <figcaption>Fruzsi</figcaption>
      </figure>
      <figure class="velemeny mozog" style="--kesleltet:.12s">
        <div class="csillag" aria-label="5 csillag">★★★★★</div>
        <blockquote>„Eliza nagyon kedves, csupaszív kozmetikus, a kozmetika csodaszép, tiszta, hangulatos, mindig örömmel járok ide vissza. Legutóbb a 10 alkalmas arcfiatalító kezelést vettem igénybe, és az eredmény magáért beszél, azóta több pozitív visszajelzést is kaptam ismerőseimtől. Csak ajánlani tudom Elizát!”</blockquote>
        <figcaption>Magdi</figcaption>
      </figure>
    </div>
  </div>
</section>`;

const folyamat = `
<section class="puder">
  <div class="wrap">
    <div class="fejresz kozep mozog"><span class="kicker">Négy lépés a ragyogó bőrig</span><h2>Hogyan működik?</h2></div>
    <div class="racs racs-4 lepesek">
      <div class="lepes mozog"><h3>Időpont-egyeztetés</h3><p class="halvany kis">Vendégeimet kizárólag előre egyeztetett időpontban tudom fogadni, hétfőtől péntekig 9:00 és 16:00 között. Telefonon vagy az űrlapon keresztül tudsz bejelentkezni, amire rövid időn belül visszajelzek.</p></div>
      <div class="lepes mozog" style="--kesleltet:.1s"><h3>Diagnosztika és kezelési terv</h3><p class="halvany kis">A kezelés előtt alaposan felmérem a bőröd állapotát, megismerem arcápolási szokásaidat, az eddig használt termékeidet, és ezek alapján összeállítom a számodra legmegfelelőbb kezelési tervet.</p></div>
      <div class="lepes mozog" style="--kesleltet:.2s"><h3>Kozmetikai kezelés</h3><p class="halvany kis">A személyre szabott terv alapján végzem el a kezelést, amelyet minden esetben egy relaxáló arcmasszázs egészít ki, hogy a bőröd felfrissüljön és a hatóanyagok még jobban beépüljenek.</p></div>
      <div class="lepes mozog" style="--kesleltet:.3s"><h3>Tanácsok otthonra</h3><p class="halvany kis">A kezelést követően segítek az otthoni bőrápolási rutinod kialakításában, hogy a bőröd tartósan egészséges és ragyogó maradjon. Személyre szabott termékajánlásokkal és praktikus tanácsokkal látlak el.</p></div>
    </div>
  </div>
</section>`;

const GYIK = [
  ['Időpont nélkül is érkezhetek?', 'Nem, a kozmetikámban kizárólag időpontra fogadok vendégeket.'],
  ['Honnan tudjam, hogy melyik kezelés való nekem?', 'Az első találkozás alkalmával a kezelés előtt diagnosztizálom a bőrödet, és felvázolom a kezelési tervet.'],
  ['Kapok segítséget az otthoni rutinomhoz?', 'Igen, természetesen! Az első alkalmat követően elmondom, hogy mire figyelj a mindennapokban, milyen termékeket használj, hogy a bőröd a lehető legjobb törődést kapja.'],
  ['Hogyan tudok fizetni?', 'Bankkártyával és készpénzzel is fizethetsz a szalonban.'],
];
const gyik = `
<section>
  <div class="wrap">
    <div class="fejresz kozep mozog"><span class="kicker">Kérdések és válaszok</span><h2>Gyakran ismételt kérdések</h2></div>
    <div class="gyik mozog">
      ${GYIK.map(([k, v], i) => `<details${i === 0 ? ' open' : ''}><summary>${k}</summary><div class="valasz"><p>${v}</p></div></details>`).join('\n      ')}
    </div>
  </div>
</section>`;
const gyikJsonLd = `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: GYIK.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
})}</script>`;
const uzletJsonLd = `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'BeautySalon', name: 'Eliza Beauty Salon', url: SITE + '/',
  image: SITE + '/img/hero-1600.webp', telephone: '+36 20 344 9272', email: 'hello.elizabeauty@gmail.com',
  address: { '@type': 'PostalAddress', streetAddress: 'Ráday u. 1.', postalCode: '1092', addressLocality: 'Budapest', addressCountry: 'HU' },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '16:00' }],
})}</script>`;

const cta = (cim, szoveg, gomb = 'Időpontot foglalok', cel = '#idopont') => `
<section class="sotet cta-sav">
  <div class="wrap">
    <div class="szoveg-max kozep mozog" style="margin:0 auto">
      <span class="kicker">Itt az idő</span>
      <h2>${cim}</h2>
      <p>${szoveg}</p>
      <a class="btn" href="${cel}">${gomb} ${I.nyil}</a>
    </div>
  </div>
</section>`;

// ---------- Főoldal ----------
oldal({
  fajl: 'index.html', aktiv: 'index.html',
  cim: 'Eliza Beauty Salon – személyre szabott kozmetikai kezelések Budapesten',
  leiras: 'Arcfiatalító és anti-akné kezelések a IX. kerületben, természetes hatóanyagokkal és modern technológiával. Fájdalommentes, privát kezelések, elégedettségi garanciával.',
  jsonld: uzletJsonLd + gyikJsonLd,
  tartalom: `
<section class="hero">
  <div class="wrap">
    <div>
      <span class="kicker mozog">A szépség mindenkié</span>
      <h1 class="mozog" style="--kesleltet:.08s">Személyre szabott kozmetikai kezelések</h1>
      <p class="mozog" style="--kesleltet:.16s">Az Eliza Beauty Salon olyan professzionális kozmetikai megoldásokat kínál, amelyek természetes hatóanyagokkal és a legmodernebb bőrfiatalító technológiákkal érnek el látványos, tartós eredményeket. Nincs fájdalom, nincs kockázat – csak ragyogó, egészséges bőr, amely visszaadja az önbizalmadat. Foglalj időpontot, és tapasztald meg a különbséget!</p>
      <div class="btnsor mozog" style="--kesleltet:.24s">
        <a class="btn" href="kezelesek.html">Megnézem a kezeléseket ${I.nyil}</a>
        <a class="btn btn-2" href="#idopont">Időpontot kérek</a>
      </div>
    </div>
    <div class="hero-kep mozog" style="--kesleltet:.2s">
      ${k('hero', 'Relaxáló arcmasszázs kezelés közben, nyugodt, meleg fényű szalonban', { eager: true, szeles: '(max-width: 900px) 440px, 45vw' })}
      <div class="hero-badge"><strong>14+</strong><span>év tapasztalat, mesterkozmetikusi címmel</span></div>
    </div>
  </div>
</section>
${velemenyek}
<section class="puder">
  <div class="wrap">
    <div class="osztott">
      <div class="kep-felfed">${k('hatoanyag', 'Természetes hatóanyagú bőrápolók kövekkel és zöld ágakkal')}</div>
      <div class="mozog">
        <span class="kicker">Miért nálam?</span>
        <h2>Bízd magad szakértő kezekre</h2>
        <p class="halvany">Minden kezelésem a bőröd hosszú távú egészségét és szépségét szolgálja. Nincs varázslat, nincsenek üres ígéretek, csak gondosan kiválasztott hatóanyagok, modern technológiák és bizonyítottan működő eljárások. A célom, hogy bőröd ne csak szebb legyen, hanem tartósan megőrizze rugalmasságát és vitalitását – mindezt elégedettségi garanciával.</p>
      </div>
    </div>
    <div class="racs racs-4" style="margin-top:64px">
      <div class="kartya mozog"><div class="ikon">${I.level}</div><h3>Bőrtípushoz igazodok</h3><p class="halvany kis">Minden bőr egyedi, ezért a kezelések során figyelembe veszem annak aktuális állapotát. Személyre szabott megoldásokkal biztosítom, hogy bőröd a legmegfelelőbb törődést kapja.</p></div>
      <div class="kartya mozog" style="--kesleltet:.08s"><div class="ikon">${I.szivecske}</div><h3>Fájdalommentes kezelések</h3><p class="halvany kis">Kíméletes, mégis hatékony eljárásokat alkalmazok, amelyek természetes módon segítik a bőr regenerálódását, így az eredmény látványos, a folyamat pedig kellemes és kényelmes.</p></div>
      <div class="kartya mozog" style="--kesleltet:.16s"><div class="ikon">${I.pajzs}</div><h3>Elégedettségi garancia</h3><p class="halvany kis">A célom nem csupán az, hogy jól érezd magad egy kezelés után, hanem az is, hogy valódi, látható eredményeket kapj. Ha egy 5 alkalmas kezelés után nem vagy elégedett, visszatérítem a díj 50%-át.</p></div>
      <div class="kartya mozog" style="--kesleltet:.24s"><div class="ikon">${I.szikra}</div><h3>Exkluzív környezet</h3><p class="halvany kis">A kezelések nemcsak a bőrödnek, hanem a lelkednek is szólnak. Nálam nem futószalagon dolgoznak a vendégekkel – minden kezelés privát, nyugodt és egy egészen lélekfeltöltő élmény.</p></div>
    </div>
  </div>
</section>
<section>
  <div class="wrap osztott fordit">
    <div class="kep-felfed">${k('eliza', 'Sipos Eliza mesterkozmetikus a kezelőszobájában')}</div>
    <div class="mozog">
      <span class="kicker">Bemutatkozás</span>
      <h2>Ismerd meg a szakértődet!</h2>
      <p class="halvany">Sipos Eliza vagyok, az Eliza Beauty Salon megálmodója. 14 éve segítek vendégeimnek abban, hogy bőrük egészségesebb, fiatalosabb és ragyogóbb legyen. A szépségipar mindig is a szenvedélyem volt, ezért folyamatosan fejlesztem tudásomat, hogy a legmodernebb technológiákkal és leghatékonyabb hatóanyagokkal dolgozhassak. A Beauty Academy szakmai trénereként és a kozmetikus mesterképzés elvégzése után célom, hogy minden vendégem személyre szabott, professzionális kezelést kapjon. Nálam nincs sablonkezelés, csak valódi törődés és hosszú távú megoldások.</p>
      <div class="szamok">
        <div><strong>14+</strong><span>év tapasztalat</span></div>
        <div><strong>1300+</strong><span>vendég</span></div>
        <div><strong>350+</strong><span>féle kozmetikum</span></div>
      </div>
      <a class="btn btn-2" href="rolunk.html">Tovább olvasok ${I.nyil}</a>
    </div>
  </div>
</section>
${folyamat}
${cta('Fektess bőröd szépségébe – megéri!', 'Ha régóta szeretnéd visszanyerni bőröd fiatalosságát, feszességét vagy megszabadulni a makacs bőrproblémáktól, itt az idő, hogy szakértő kezekre bízd magad. A bőröd minden nap érted dolgozik, most rajtad a sor! Válassz professzionális kezeléseket, és élvezd a ragyogó, egészséges bőr érzését – tartósan, természetesen.')}
${gyik}
<section style="padding-top:0">
  <div class="wrap">
    <div class="hirlevel mozog">
      <div class="kisokos" aria-hidden="true"><small>Eliza Beauty Salon</small><b>Arcápolási Kisokos</b><i></i><small>Ingyenes e-könyv</small></div>
      <div>
        <span class="kicker">Ajándék neked</span>
        <h2>Iratkozz fel és töltsd le az Arcápolási Kisokost!</h2>
        <p class="halvany">Szeretnéd tudni, hogyan ápold a bőrödet úgy, hogy az hosszú távon egészséges és ragyogó maradjon? Iratkozz fel a hírlevélre, és ajándékba megkapod az Arcápolási Kisokost, amely tele van hasznos tippekkel és szakértői tanácsokkal.</p>
        <form class="urlap" name="hirlevel" method="POST" action="/koszonjuk.html?tipus=hirlevel" data-netlify="true" netlify-honeypot="bot-mezo">
          <input type="hidden" name="form-name" value="hirlevel">
          <p class="rejtett"><label>Ne töltsd ki: <input name="bot-mezo" tabindex="-1" autocomplete="off"></label></p>
          <div class="racs racs-2" style="gap:16px">
            <div><label for="hl-nev">Teljes név</label><input id="hl-nev" type="text" name="nev" autocomplete="name" required></div>
            <div><label for="hl-email">E-mail cím</label><input id="hl-email" type="email" name="email" autocomplete="email" required></div>
          </div>
          <label class="jelolo"><input type="checkbox" name="adatvedelem" value="elfogadva" required> <span>Elolvastam és elfogadom az <a href="adatkezeles.html">adatvédelmi nyilatkozatot</a>.</span></label>
          <button class="btn" type="submit">Kérem az ingyenes kisokost ${I.nyil}</button>
        </form>
      </div>
    </div>
  </div>
</section>`,
});

// ---------- Kezelések ----------
const csomag = (nev, ar, leiras, tetelek, kiemelt = false, kes = 0) => `
<div class="csomag mozog${kiemelt ? ' kiemelt' : ''}" style="--kesleltet:${kes}s">
  <h3>${nev}</h3>
  <div class="ar">${ar}</div>
  <p class="halvany kis">${leiras}</p>
  <ul>${tetelek.map((t) => `<li>${I.pipa}<span>${t}</span></li>`).join('')}</ul>
  <a class="btn${kiemelt ? '' : ' btn-2'}" href="#idopont">Ezt választom</a>
</div>`;

oldal({
  fajl: 'kezelesek.html', aktiv: 'kezelesek.html',
  cim: 'Kezelések és árak – arcfiatalítás, anti-akné | Eliza Beauty Salon',
  leiras: 'Belico és Mesotica arckezelések, tű nélküli mezoterápia, fotorejuvenáció és anti-akné kezelések. Kúracsomagok 59 000 Ft-tól, elégedettségi garanciával.',
  jsonld: gyikJsonLd,
  tartalom: `
<section class="hero">
  <div class="wrap">
    <div>
      <span class="kicker mozog">Neked is jár a sima, egészséges bőr!</span>
      <h1 class="mozog" style="--kesleltet:.08s">Szakértői kozmetikai megoldások</h1>
      <p class="mozog" style="--kesleltet:.16s">A bőröd egyedi, ezért a kezeléseidnek is annak kell lennie. Legyen szó ráncok halványításáról, feszesítésről vagy aknékezelésről, a legmodernebb technológiákkal és célzott hatóanyagokkal dolgozom, hogy bőröd természetesen megújuljon és hosszú távon ragyogó maradjon.</p>
      <div class="btnsor mozog" style="--kesleltet:.24s"><a class="btn" href="#idopont">Időpontot foglalok ${I.nyil}</a><a class="btn btn-2" href="#csomagok">Csomagok és árak</a></div>
    </div>
    <div class="hero-kep mozog" style="--kesleltet:.2s">${k('tovabbi', 'Arcmaszk felvitele kozmetikai kezelés közben', { eager: true, szeles: '(max-width: 900px) 440px, 45vw' })}</div>
  </div>
</section>
<section class="puder">
  <div class="wrap">
    <div class="fejresz mozog szoveg-max">
      <span class="kicker">Ismerős?</span>
      <h2>A bőröd mesél rólad, de mit üzen?</h2>
      <p class="halvany">Észrevetted, hogy a bőröd már nem olyan, mint régen? Az évek nyomot hagynak, és bár a lelked fiatal marad, a bőröd másképp mesél a múltról. A vonások átalakulnak, a bőröd elveszíti korábbi ragyogását, a ráncok mélyülnek, és a makacs bőrproblémák, mint az akné vagy a gyulladások, egyre nehezebben múlnak el.</p>
      <p class="halvany">Ha nem teszel időben a változások ellen, a folyamat csak gyorsul. A kezeletlen problémák egyre hangsúlyosabbá válnak, a bőr regenerációja lassul, és a komfortérzeted is csökken. Az idő nem áll meg, de a megfelelő kezelésekkel visszafordíthatod a látható jeleket.</p>
    </div>
    <div class="racs racs-4 problema-lista">
      <div class="kartya mozog"><div class="ikon">${I.csepp}</div><h3>Megereszkedett, rugalmatlan bőr</h3><p class="halvany kis">A kollagén- és elasztintermelés csökkenésével a bőröd feszessége romlik, az arcod kontúrjai elmosódnak, és a ráncok egyre mélyebbé válnak.</p></div>
      <div class="kartya mozog" style="--kesleltet:.08s"><div class="ikon">${I.szikra}</div><h3>Makacs akné, gyulladások és hegek</h3><p class="halvany kis">A kezeletlen pattanások és gyulladások nyomot hagyhatnak, amelyek idővel mély hegekké alakulnak, megnehezítve a bőröd simaságának visszaállítását.</p></div>
      <div class="kartya mozog" style="--kesleltet:.16s"><div class="ikon">${I.nap}</div><h3>Fakó, élettelen bőr és pigmentfoltok</h3><p class="halvany kis">A hidratáció hiánya, az UV-sugárzás és a hormonális változások miatt a bőr egyenetlenné válik, elveszítheti természetes ragyogását, és egyre több pigmentfolt jelenik meg.</p></div>
      <div class="kartya mozog" style="--kesleltet:.24s"><div class="ikon">${I.pajzs}</div><h3>Érzékeny, irritált, sérülékeny bőr</h3><p class="halvany kis">A bőr védőrétegének meggyengülése miatt könnyebben kipirosodik, viszket vagy gyulladásra hajlamos, és nehezebben regenerálódik.</p></div>
    </div>
  </div>
</section>
<section>
  <div class="wrap">
    <div class="fejresz kozep mozog"><span class="kicker">Kezeléseim</span><h2>Célzott megoldások minden bőrnek</h2></div>
    <article class="kezeles">
      <div class="kep-felfed">${k('belico', 'Agyagmaszk felvitele ecsettel Belico arckezelés közben')}</div>
      <div class="mozog">
        <h3>Belico arckezelések</h3>
        <p class="halvany">Az egészséges, sejtszintű bőrmegújulást az értékes növényi összetevők mellett aktív és szállító hatóanyagok (többrétegű liposzómák, nanoszómák, ceramidok, foszfolipidek stb.) biztosítják. A látványos és gyors bőrfiatalítást a kozmetikai ipar leginnovatívabb bőrbarát hatóanyagai, kimondottan magas koncentrációban teszik lehetővé.</p>
        <ul><li>Skin regeneration kezelés érzékeny bőrre <span>90 perc · 35 év fölött</span></li><li>Hydro energy mélyhidratáló effect kezelés <span>90 perc · 35 év fölött</span></li></ul>
      </div>
    </article>
    <article class="kezeles">
      <div class="kep-felfed">${k('mesotica', 'Közeli kép ragyogó, hidratált arcbőrről kezelés közben')}</div>
      <div class="mozog">
        <h3>Mesotica luxus kezelések</h3>
        <p class="halvany">Azonnali ráncsimító hatás, azonnali látvány, plasztikai beavatkozások nélkül! A tudomány mára már bebizonyította, hogy a kozmetikai peptidek jelentős szerepet játszanak a különböző bőrproblémák kezelésében. Néhány vizsgálat szerint a kozmetikai peptidek képesek eltüntetni az öregedés jeleit.</p>
        <ul><li>Arckezelés <span>90–120 perc · 40 év fölött</span></li><li>Arc-nyak-dekoltázs kezelés <span>120–180 perc · 40 év fölött</span></li></ul>
      </div>
    </article>
    <article class="kezeles">
      <div class="kep-felfed">${k('folyamat', 'Kozmetikus arcot tisztít a kezelőszobában')}</div>
      <div class="mozog">
        <h3>További kezelések</h3>
        <p class="halvany">Nálam mindent megtalálsz, ami teljes szépülésedhez, pihenésedhez szükséges. Minden kezelésem személyre szabott, mely során figyelembe veszem bőröd aktuális igényét, állapotát.</p>
        <ul><li>DrDerm tű nélküli mezoterápiás kezelés</li><li>Fotorejuvenáció</li><li>Tűs mezoterápia / mezopen kezelés</li><li>Anti-akné kezelések</li></ul>
      </div>
    </article>
  </div>
</section>
<section class="puder">
  <div class="wrap">
    <div class="fejresz kozep mozog"><span class="kicker">A bőröd hálás lesz érte</span><h2>Amit kapsz a kezelésektől</h2></div>
    <ul class="pipa-lista mozog">
      ${['Láthatóan fiatalosabb és rugalmasabb bőr', 'Egészségesebb, ellenállóbb bőr', 'Mély hidratálás és ragyogás', 'Egyenletesebb bőrkép', 'Erősebb, ellenállóbb bőr', 'Természetes hatás, drasztikus beavatkozás nélkül', 'Gyorsabb regeneráció és hosszú távú eredmények', 'Magabiztosság, amit a bőröd állapota is tükröz'].map((t) => `<li>${I.pipa}<span>${t}</span></li>`).join('')}
    </ul>
  </div>
</section>
<section class="sotet">
  <div class="wrap garancia mozog">
    <div class="pecset"><div><strong>50%</strong><span>visszatérítés</span></div></div>
    <div class="szoveg-max">
      <span class="kicker">Elégedettségi garancia</span>
      <h2>Garanciát vállalok a szépségedre</h2>
      <p class="halvany">Hiszek abban, hogy a megfelelő kezelés látványos változást hoz. Ezért 5 alkalmas kúrák esetén elégedettségi garanciát vállalok: ha a bőröd nem mutat javulást, a kezelés árának 50%-át visszatérítem.</p>
    </div>
  </div>
</section>
<section id="csomagok">
  <div class="wrap">
    <div class="fejresz kozep mozog">
      <span class="kicker">Komplex megoldások a tartós szépségért</span>
      <h2>Találd meg a tökéletes csomagot!</h2>
      <p class="halvany szoveg-max">A bőrápolás hosszú távú befektetés önmagadba. Egy jól felépített, komplex kezeléssorozat nemcsak látványos eredményt mutat, hanem bőröd egészségét is támogatja. Válaszd ki a számodra legmegfelelőbb csomagot, és tapasztald meg, milyen érzés, amikor a bőröd valóban hálás a törődésért.</p>
    </div>
    <div class="racs racs-3">
      ${csomag('Anti-Age csomag', '79 000 Ft', 'Feszesebb, simább, üdébb bőr – kíméletes, mégis hatékony bőrfiatalítás célzott kezelésekkel.', ['5 × Belico kezelés (szabadon választható a Skin regeneration és a Hydro energy kezelés közül)', 'Arcmasszázs minden alkalommal (10 perc)', 'Személyre szabott hatóanyagok'])}
      ${csomag('Anti-Age Plus csomag', '99 000 Ft', 'Intenzív bőrmegújítás, amely láthatóan csökkenti a ráncokat és visszaadja a bőr rugalmasságát.', ['5 × Mesotica arckezelés', 'Mezoterápiás kezelés a fiatalosabb bőrért', 'Arcmasszázs minden alkalommal (10 perc)', 'Személyre szabott bőrápolási tanácsadás'], true, 0.1)}
      ${csomag('Tini Anti-Akné csomag', '59 000 Ft', 'Hatékony megoldás a makacs pattanások ellen, hogy bőröd tiszta, egészséges és ragyogó legyen.', ['5 alkalmas intenzív bőrtisztító program 14–19 éveseknek', 'Mélytisztítás, gyulladáscsökkentés és peeling minden alkalommal', 'Otthoni bőrápolási útmutató az első alkalommal'], false, 0.2)}
    </div>
  </div>
</section>
${velemenyek.replace('<section>', '<section class="puder">')}
${folyamat.replace('class="puder"', '')}`,
});

// ---------- Rólunk ----------
const ERTEKEK = [
  ['Minőség', 'Minden kezelés során a legmagasabb minőséget nyújtom, mert hiszem, hogy a bőr egészsége nem kompromisszum kérdése.'],
  ['Hitelesség', 'Csak olyan eljárásokat alkalmazok, amelyek valóban működnek, felesleges ígéretek helyett tudományosan igazolt megoldásokkal dolgozom.'],
  ['Természetesség', 'A természetes szépség kiemelése a célom, ezért olyan kezeléseket ajánlok, amelyek hosszú távon is támogatják a bőr egészségét.'],
  ['Fejlődés', 'A folyamatos tanulás és fejlődés elengedhetetlen számomra, hogy mindig naprakész tudással segíthessem vendégeimet.'],
  ['Énidő', 'Hiszem, hogy egy jó kozmetikai kezelés nemcsak a bőrt, hanem a lelket is felfrissíti – nálam minden kezelés egyben énidő is.'],
];
oldal({
  fajl: 'rolunk.html', aktiv: 'rolunk.html',
  cim: 'Rólam – Sipos Eliza mesterkozmetikus | Eliza Beauty Salon',
  leiras: 'Sipos Eliza 14 éve mesterkozmetikus, a Beauty Academy egykori szakmai trénere. Ismerd meg a történetét, az értékeit és a Ráday utcai szalont.',
  tartalom: `
<section class="hero">
  <div class="wrap">
    <div>
      <span class="kicker mozog">Szakértelem, törődés és szenvedély a szép bőrért</span>
      <h1 class="mozog" style="--kesleltet:.08s">A bőröd egészsége az én küldetésem</h1>
      <p class="mozog" style="--kesleltet:.16s">Hiszek a gondoskodás erejében, a precíz szakértelemben és abban, hogy minden bőr megérdemli a legjobb törődést. Nálam nem sablonmegoldásokat kapsz, hanem személyre szabott kezeléseket, amelyek a valódi igényeidre és a bőröd egyedi állapotára épülnek. Ha úgy érzed, eljött az idő, hogy a bőröd a lehető legjobb formáját hozza – szeretettel várlak.</p>
      <div class="btnsor mozog" style="--kesleltet:.24s"><a class="btn" href="#idopont">Időpontot foglalok ${I.nyil}</a></div>
    </div>
    <div class="hero-kep mozog" style="--kesleltet:.2s">${k('eliza', 'Sipos Eliza mesterkozmetikus a szalonjában', { eager: true, szeles: '(max-width: 900px) 440px, 45vw' })}</div>
  </div>
</section>
<section class="puder">
  <div class="wrap">
    <div class="szoveg-max mozog">
      <span class="kicker">Ismerd meg a szakértődet!</span>
      <h2>Egy álomból született szalon</h2>
      <p>Szia, Eliza vagyok, a leendő kozmetikusod! A szépség mindig is az életem része volt, így nem volt kérdés, hogy a kozmetika lesz a hivatásom. 2011-ben megnyitottam saját szalonomat, az Eliza Beauty Salont, ahol azóta is azon dolgozom, hogy vendégeim bőre ne csak szebb, hanem egészségesebb is legyen.</p>
      <p>Az első évek sok tanulással és kihívással teltek, de a kitartásomnak köszönhetően folyamatosan fejlődtem. 2018-ban a Beauty Academy szakmai trénereként és oktatójaként dolgoztam, segítve más kozmetikusokat a legmodernebb eljárások elsajátításában. 2019-ben mesterkozmetikusi címet szereztem, hogy még magasabb szinten végezhessem a kezeléseimet.</p>
      <p>Hiszem, hogy a kozmetika többről szól, mint a szép bőrről – önbizalomról, jó közérzetről és énidőről is. Ezért a kezeléseim célja nemcsak a látványos eredmény, hanem az is, hogy vendégeim feltöltődve és magabiztosan távozzanak.</p>
    </div>
    <div class="idovonal">
      <div class="mozog"><b>14 év</b><span class="halvany kis">tapasztalat</span></div>
      <div class="mozog" style="--kesleltet:.08s"><b>1300+</b><span class="halvany kis">vendég</span></div>
      <div class="mozog" style="--kesleltet:.16s"><b>Tréner</b><span class="halvany kis">szakmai tréner és oktató</span></div>
      <div class="mozog" style="--kesleltet:.24s"><b>Mester</b><span class="halvany kis">mesterkozmetikus</span></div>
    </div>
  </div>
</section>
<section>
  <div class="wrap">
    <div class="fejresz kozep mozog">
      <span class="kicker">Amiben hiszek</span>
      <h2>Értékeim, amikből nem engedek</h2>
      <p class="halvany szoveg-max">Hiszek a minőségben, az őszinte szakértelemben és abban, hogy a legjobb eredményekhez valódi odafigyelés és korszerű megoldások kellenek. Minden vendégem számára ezt a gondoskodást és elkötelezettséget nyújtom.</p>
    </div>
    <div class="racs ertekek">
      ${ERTEKEK.map(([c, t], i) => `<div class="kartya ertek mozog" style="--kesleltet:${i * 0.08}s;background:var(--puder)"><span class="szam">0${i + 1}</span><h3>${c}</h3><p class="halvany kis">${t}</p></div>`).join('')}
    </div>
  </div>
</section>
<section class="puder">
  <div class="wrap">
    <div class="osztott">
      <div class="mozog">
        <span class="kicker">Profizmus és harmónia</span>
        <h2>Ezt kapod az Eliza Beauty Salonban</h2>
        <p class="halvany">A kezelések hatékonysága nemcsak a szakértelmen, hanem a környezeten is múlik. Az Eliza Beauty Salon egy olyan hely, ahol a legmodernebb technológiák, a prémium hatóanyagok és a nyugodt, exkluzív légkör egyesülnek. Itt minden arról szól, hogy a bőröd megkapja a legjobb törődést, te pedig egy pillanatra kiszakadhass a mindennapok rohanásából.</p>
      </div>
      <div class="kep-felfed">${k('szalon', 'Világos, nyugodt kezelőszoba kezelőággyal az Eliza Beauty Salonban')}</div>
    </div>
  </div>
</section>
${cta('Adj egy esélyt a bőrödnek a megújulásra!', 'A bőröd a legnagyobb érzékszerved, folyamatosan véd és alkalmazkodik – mégis gyakran háttérbe szorul a mindennapi rohanásban. Ha úgy érzed, hogy itt az ideje egy kis extra figyelemnek, most megteheted az első lépést. Egy jól megválasztott kezelés nemcsak a bőrödet szépíti, hanem a közérzetedet is javítja. Foglalj időpontot, és tapasztald meg a különbséget!')}`,
});

// ---------- Kapcsolat ----------
oldal({
  fajl: 'kapcsolat.html', aktiv: 'kapcsolat.html', idopont: false,
  cim: 'Kapcsolat és időpontkérés | Eliza Beauty Salon, Budapest IX.',
  leiras: 'Kérj időpontot űrlapon vagy telefonon: Eliza Beauty Salon, 1092 Budapest, Ráday u. 1. Nyitva hétfőtől péntekig 9–16 óráig, előre egyeztetett időpontra.',
  jsonld: uzletJsonLd + gyikJsonLd,
  tartalom: `
<section class="hero-egyszeru" id="idopont">
  <div class="wrap kapcsolat-racs">
    <div>
      <span class="kicker mozog">Kapcsolat</span>
      <h1 class="mozog" style="--kesleltet:.08s">Vedd fel velem a kapcsolatot!</h1>
      <p class="halvany mozog" style="--kesleltet:.16s">A bőröd meghálálja a törődést, és én segítek megtalálni a legjobb megoldást számodra. Ha kérdésed van a kezelésekről, tanácsra van szükséged, vagy időpontot foglalnál, keress bizalommal! Egy apró változtatás is nagy különbséget hozhat – kezdjük el együtt!</p>
      <div class="mozog" style="--kesleltet:.24s">${elerhetoseg}</div>
      <p class="mozog" style="margin-top:32px"><a class="btn btn-2" href="https://www.google.com/maps/search/?api=1&query=1092+Budapest%2C+R%C3%A1day+u.+1." target="_blank" rel="noopener">Útvonaltervezés ${I.hely}</a></p>
    </div>
    <div class="idopont-doboz mozog" style="--kesleltet:.2s">
      <h2 style="font-size:32px">Időpontkérés</h2>
      <p class="halvany kis">Írd meg, melyik kezelés érdekel – rövid időn belül visszajelzek telefonon vagy e-mailben.</p>
      ${idopontUrlap('kp')}
    </div>
  </div>
</section>
<section class="puder">${gyik.replace('<section>', '').replace(/<\/section>\s*$/, '')}</section>`,
});

// ---------- Adatkezelési tájékoztató ----------
oldal({
  fajl: 'adatkezeles.html', aktiv: '', idopont: false,
  cim: 'Adatkezelési tájékoztató | Eliza Beauty Salon',
  leiras: 'Az Eliza Beauty Salon adatkezelési tájékoztatója: milyen személyes adatokat kezelünk az időpontkérő és a hírlevél-feliratkozó űrlapon, milyen célból és meddig.',
  tartalom: `
<section class="hero-egyszeru">
  <div class="wrap jogi">
    <span class="kicker">Jogi információk</span>
    <h1>Adatkezelési tájékoztató</h1>
    ${readFileSync('adatkezeles-tartalom.html', 'utf8')}
  </div>
</section>`,
});

// ---------- Köszönő oldal ----------
oldal({
  fajl: 'koszonjuk.html', aktiv: '', idopont: false,
  cim: 'Köszönöm az üzeneted! | Eliza Beauty Salon',
  leiras: 'Megkaptam az üzenetedet, hamarosan jelentkezem.',
  tartalom: `
<section class="koszonjuk">
  <div class="wrap szoveg-max kozep">
    <div class="ikon">${I.pipa}</div>
    <h1>Köszönöm, megkaptam!</h1>
    <p class="halvany">Rövid időn belül visszajelzek telefonon vagy e-mailben. Ha a hírlevélre iratkoztál fel, az Arcápolási Kisokost e-mailben küldöm.</p>
    <a class="btn" href="index.html">Vissza a főoldalra ${I.nyil}</a>
  </div>
</section>`,
});

writeFileSync(`${ki}/robots.txt`, `User-agent: *\nAllow: /\nDisallow: /koszonjuk.html\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync(`${ki}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['', 'kezelesek.html', 'rolunk.html', 'kapcsolat.html', 'adatkezeles.html'].map((u) => `  <url><loc>${SITE}/${u}</loc></url>`).join('\n')}
</urlset>
`);
// a köszönőoldal ne kerüljön indexbe
writeFileSync(`${ki}/_headers`, `/koszonjuk.html\n  X-Robots-Tag: noindex\n/img/*\n  Cache-Control: public, max-age=31536000, immutable\n`);
console.log('Kész: ./site');
