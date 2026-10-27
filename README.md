# Eliza Beauty Salon – weboldal

Fiktív ügyfél: Sipos Eliza kozmetikus, Budapest.

- Statikus oldal, keretrendszer nélkül: `build.mjs` állítja össze a négy oldalt (közös fejléc, időpontkérő, lábléc) a `site/` mappába.
- Arculat: `alapanyag/design-system.md` (Cormorant Garamond + Jost, saját tárhelyről), szövegek: `alapanyag/szovegek.md`.
- Űrlapok: Netlify Forms (`idopont`, `hirlevel`), honeypot spamszűrővel, köszönőoldallal.
- Képek: Unsplash stock fotók, WebP-ben, 800 és 1600 px szélességben, `srcset`-tel.
- SEO: egyedi title és meta description oldalanként, egy H1 per oldal, alt szövegek, canonical, sitemap.xml, robots.txt, schema.org (BeautySalon, FAQPage).

## Helyi futtatás

```bash
node build.mjs
py -m http.server 4321 --directory site
```

Netlify: a build parancs `node build.mjs`, a közzétett mappa `site` (lásd `netlify.toml`).
