# Valentýnská Webová Aplikace ❤️

Interaktivní valentýnské přání s moderním designem, animacemi a personalizovaným obsahem.

## 🎯 Funkce

- **Ambientní pozadí** s plovoucími transparentními srdíčky
- **Animovaná obálka** s "trance" efektem, která vybízí ke kliknutí
- **Interaktivní otázka** "bby, budeš mou valentýnkou?"
- **"Utíkající" tlačítko "Ne"** s fyzikální simulací (vektorová matematika)
- **Konfetová oslava** po kliknutí na "Ano"
- **Synchronizace textu písně** s audio přehrávačem (karaoke styl)
- **Export do kalendáře** (.ics soubor pro Apple Kalendář)

## 🚀 Technologie

- **Next.js 15** s App Router
- **TypeScript** pro type safety
- **Tailwind CSS** pro styling
- **Framer Motion** pro pokročilé animace
- **canvas-confetti** pro efekt konfet
- **Lucide React** pro ikony

## 📦 Instalace

```bash
# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev
```

Aplikace bude dostupná na `http://localhost:3000`

## 🎵 Audio Setup

1. Vytvořte složku `public/music/` (už vytvořená)
2. Umístěte MP3 soubor písničky jako `public/music/dirty-little-secret.mp3`
3. Doporučený bitrate: 128-192 kbps

## 📝 Úprava textu písně

Otevřete soubor `app/components/LyricsSyncDisplay.tsx` a doplňte pole `lyrics` s časovými značkami:

```typescript
const lyrics: LyricLine[] = [
  { time: 0, text: '[Instrumental Intro]' },
  { time: 14.5, text: 'Váš text zde...' },
  // ... další řádky
];
```

**Poznámka:** Z důvodu autorských práv je v kódu pouze ukázková struktura. Text písně si musíte doplnit sami.

## 🎨 Přizpůsobení

### Barvy

Aplikace používá paletu:
- Bílá (`#FFFFFF`) - pozadí
- Černá (`#09090b`) - text
- Sytě červená (`#DC2626`) - akcenty

Barvy můžete upravit v `app/globals.css`:

```css
:root {
  --love-red: #DC2626; /* Vaše barva */
}
```

### Text otázky

V souboru `app/components/TranceEnvelope.tsx` najdete text:

```tsx
<h1 className="text-2xl font-bold text-zinc-900">
  bby, budeš mou valentýnkou? 💕
</h1>
```

### Kalendářová událost

V souboru `app/components/SuccessView.tsx` upravte detaily události:

```typescript
const event = {
  title: 'Valentýnské Rande ❤️',
  description: 'Hurá, bude mi ctí!',
  location: 'TBD',
  startDate: new Date('2026-02-14T18:00:00'),
  endDate: new Date('2026-02-14T23:00:00'),
};
```

## 🌐 Nasazení na Vercel

1. Pushněte projekt na GitHub
2. Přihlaste se na [vercel.com](https://vercel.com)
3. Klikněte na "New Project"
4. Importujte GitHub repozitář
5. Vercel automaticky rozpozná Next.js a nasadí aplikaci

### Build Command
```bash
npm run build
```

### Environment Variables
Žádné speciální proměnné prostředí nejsou potřeba.

## 📱 Mobilní Podpora

Aplikace je plně responzivní a optimalizovaná pro:
- iOS Safari
- Android Chrome
- Desktop prohlížeče

"Utíkající" tlačítko funguje jak s myší, tak s dotykovým ovládáním.

## 🔧 Řešení problémů

### Audio se nepřehrává automaticky

Moderní prohlížeče blokují autoplay. Audio se spustí až po kliknutí na tlačítko "Ano" (což je interakce uživatele).

### Konfety se nezobrazují

Zkontrolujte, že je nainstalovaná knihovna `canvas-confetti`:
```bash
npm install canvas-confetti
```

### Tlačítko "Ne" neutíká

Problém může být s JavaScript permissions. Zkontrolujte konzoli prohlížeče (F12) pro chybové hlášky.

## 📄 Licence

Tento projekt je vytvořen pro osobní použití jako valentýnské přání.

## ❤️ Autor

Vytvořeno s láskou pomocí AI asistenta Cursor.

---

**Přeji krásný Valentýn! 💕**
