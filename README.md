# Arli Turka — Portfolio

Built with **Vite** + **Tailwind CSS v4** (CSS-first theming). Hosted on Vercel.

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

## Theme

All colors, fonts, and custom design tokens live in `src/style.css` inside the
`@theme` block (Tailwind v4 CSS-first config — there is no `tailwind.config.js`).
Custom classes and keyframes are also in `src/style.css`; all behaviour is in
`src/main.js`.

## EmailJS setup (contact form)

The form works out of the box via a **mailto fallback**: it opens the visitor's
mail client with name, email, and message prefilled.

To send directly through EmailJS instead:

1. Create a free account at [emailjs.com](https://emailjs.com)
2. Add an Email Service (Gmail works)
3. Create a Template with variables: `{{from_name}}`, `{{reply_to}}`, `{{message}}`
4. Replace these 3 values in the project:
   - `YOUR_PUBLIC_KEY` in `index.html` (the `emailjs.init()` call)
   - `YOUR_SERVICE_ID` in `src/main.js`
   - `YOUR_TEMPLATE_ID` in `src/main.js`

The mailto fallback switches off automatically once the placeholders are
replaced.

## Profile picture

`/public/img/me.jpeg` is used by the hero avatar. Replace the file to change
the picture (keep the same filename).

## Resume

Drop `resume.pdf` in the root of the project and the **Resume** button in the
hero appears automatically. If the file is missing, the button hides itself
instead of 404-ing.

## Project thumbnails

Replace the screenshot images in `/public/img/`:
- `web-tool.png`
- `torch2grid.png`
- `quantflow.png`

Project stats (stars, forks, issues, last commit) are fetched from the
GitHub API at runtime, cached in `sessionStorage` for 10 minutes, and degrade
gracefully to a static "offline" state if the API is unreachable.

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Vercel auto-detects the settings from `vercel.json` — just click **Deploy**
4. Every push to `main` triggers a new deployment automatically
