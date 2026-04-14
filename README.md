# Arli Turka — Portfolio

Built with **Vite** + **Tailwind CSS v3**. Hosted on Vercel.

## Local dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to /dist
npm run preview    # preview the build locally
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Vercel auto-detects the settings from `vercel.json` — just click **Deploy**
4. Every push to `main` triggers a new deployment automatically

## EmailJS setup (contact form)

1. Create a free account at [emailjs.com](https://emailjs.com)
2. Add an Email Service (Gmail works)
3. Create a Template with variables: `{{from_name}}`, `{{reply_to}}`, `{{message}}`
4. Replace these 3 values in the project:
   - `YOUR_PUBLIC_KEY` in `index.html` (the `emailjs.init()` call)
   - `YOUR_SERVICE_ID` in `src/main.js`
   - `YOUR_TEMPLATE_ID` in `src/main.js`

## Profile picture

Replace the `src` on `<img id="pfp">` in `index.html` with your image path or URL.
Drop your `resume.pdf` in the root of the project for the Resume button to work.

## Project thumbnails

Drop your screenshot images into `/public/img/`:
- `web-tool.png`
- `torch2grid.png`
- `quantflow.png`