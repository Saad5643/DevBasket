# DevBasket

A collection of free tools for developers and content creators, all in one Next.js app.

## Tools

**Images:** AI image generator, image caption generator, image filter, image to PDF, JPEG to PNG, WebP to PNG, YouTube thumbnail downloader (Thumbzilla)

**PDFs:** PDF to HTML, PDF to PNG, PDF to Word

**Web dev:** colour palette generator, CSS loader generator, font changer, HTML previewer, meta tag generator

**Content:** chat generator, hashtag generator, tweet generator, YouTube content generator, word counter

**Money:** bill splitter, budget planner, invoice generator, loan calculator, ROI calculator, tax calculator

## Tech stack

Next.js 14, TypeScript, Tailwind CSS, and [Genkit](https://firebase.google.com/docs/genkit) with Google Gemini for the AI tools.

## Run it locally

```bash
git clone https://github.com/Saad5643/DevBasket.git
cd DevBasket
npm install
```

The AI tools need a Gemini API key (get one at https://aistudio.google.com/apikey). Put it in `.env.local`:

```
GEMINI_API_KEY=your_key_here
```

Then run:

```bash
npm run dev
```

Each tool lives in its own folder under `src/app/<tool-name>/page.tsx`, and AI logic is in `src/ai/flows`.

## Contributing

New tools and fixes are welcome. To add a tool, create `src/app/<your-tool>/page.tsx`, link it from the home page, and open a pull request. Please run `npm run lint` first.

## Licence

[MIT](LICENSE)
