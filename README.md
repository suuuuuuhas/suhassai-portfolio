# Suhassai Masetty

Interactive personal portfolio for Suhassai, built with React, TypeScript, Vite, Motion, and Phosphor Icons.

The site includes a 12-direction cursor/touch portrait, frame-by-frame topic animations, dark/light themes, mobile swipe controls, accessible accordions, and a direct WhatsApp contact path.

Production: [suhassai.online](https://suhassai.online)

## Run Locally

```bash
npm install
npm run dev
```

Verify a production build with:

```bash
npm run build
npm audit --omit=dev
```

## Work Content

Current work images live in `public/work/`.

To add more:

1. Place images in `public/work/`.
2. Open `src/content.ts`.
3. Add entries to `workItems` or `digitalProjects`.

Example:

```ts
{
  title: "Project Title",
  year: "2026",
  category: "Identity / Interface",
  image: "/work/project-title.jpg",
  description: "Short project description.",
  link: "https://example.com"
}
```

## Deploy to Vercel

```bash
npm run build
vercel link
vercel deploy --prod
```
