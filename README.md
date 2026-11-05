# SPY

Ayg‘oqchi o‘yini (bitta telefonda). Next.js + TypeScript + Tailwind CSS 4 + shadcn/ui uslubidagi komponentlar + Lucide.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

- `data/categories.ts` — 30 ta tayyor kategoriya (har biri 10 so‘z + maslahat, 3 tilda)
- `data/translations.ts` — uz / ru / kg matnlari
- `store/` — zustand (o‘yin holati saqlanmaydi, sirli so‘z xotirada qoladi)
- `public/bg-city.svg` — fon rasmi

## Onlayn rejim

Backendsiz, WebRTC (PeerJS) orqali. Xona egasining telefoni server vazifasini bajaradi (`lib/online/session.ts`).
Ulanishni boshlash uchun PeerJS ning bepul ochiq xizmati ishlatiladi; ba’zi tarmoqlarda (TURN yo‘q) ulanish ishlamasligi mumkin.
