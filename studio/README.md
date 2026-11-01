# Akeem Welfare dashboard

This Studio manages welfare projects, translated text, cover photos and galleries. The main website reads only published documents from a public Sanity dataset. No write token belongs in the website.

Studio includes a local Node 22 runtime for compatibility with current Sanity. `npm run` uses it without changing the computer's system Node version. If installation on an older system Node skips optional platform packages, rerun installation with Node 22.12 or newer before building.

## Connect your account

1. Sign up at https://www.sanity.io/manage and create the **Akeem Welfare** project on the Free plan. Create a public dataset named `production`.
2. Copy the project ID into `studio/.env.local`, using `studio/.env.example` as the template. Put the same ID in the root `.env.local`, using the root `.env.example`.
3. In Sanity project settings → API → CORS origins, add `http://localhost:3333` for Studio and `http://localhost:5173` / `http://127.0.0.1:5173` for local website preview. Enable credentials only for the Studio origin, whose editor login needs them. Add the actual website origin before launch, without credentials.
4. From this folder, run `npm install`, then `npm run dev`. Open the printed Studio URL and sign in to your Sanity account.
5. Optionally import the website's existing welfare text with `npx sanity dataset import seed.ndjson production`. This contains the existing two project descriptions in DE/EN/FR/ES, without invented photos or progress claims. Review them before import: importing creates published documents. Do not overwrite existing documents unless intended.
6. Restart the website dev server after changing its environment. For a hosted website, configure the same two `VITE_SANITY_*` variables in its build environment and rebuild once.

## Editing

Create a Welfare project, add English text (other languages are optional), upload the cover and gallery images, and describe each image for accessibility. Set its location, status and display order. Save drafts while editing; use **Publish** to show the project on the website. Unpublish or delete to remove it.

Published content is fetched when visitors load the page. Returning to the tab refreshes it when at least a minute has elapsed; Sanity CDN caching may add a short delay. Ordinary content updates do not require a website rebuild. Missing translations fall back to English, then another available language.

If Sanity is not configured or the initial request fails, the website retains its original welfare copy. A successful empty dataset shows an empty state instead of restoring deleted projects. Failed refreshes preserve the last successfully loaded projects.

For an online editor URL, run `npm run deploy` after signing in and configuring the project; follow the CLI instructions. Website hosting remains separate. Real publishing and uploads cannot be verified until an actual account/project is connected.

## Checks

Website build: `npm run build` from the parent folder. For the mocked browser integration test, start Vite with `VITE_SANITY_PROJECT_ID=qaexample` on port 5174, then run `node scripts/welfare-qa.cjs` from the parent folder. The test uses fixtures, not real published welfare claims.

Verified locally: website build, Studio build with a placeholder project ID, and mocked browser tests at 1440/390/320 pixels covering content, images, galleries, translation fallback, draft exclusion and empty/error states. Account login, real uploads and publishing still require the owner's Sanity project. The Studio dependency audit currently reports 13 moderate findings, no high or critical findings; compatible overrides address the high-severity transitive findings. Recheck dependencies before hosting the editor publicly.

Connected on 2026-11-01: project 8n7evkrc, public production dataset. Both existing welfare projects were imported and verified through the live API and website browser. Local website origins localhost:5173 and 127.0.0.1:5173 are allowed without credentials. Project photos are still awaiting owner-supplied images; no documentary images were invented. Temporary authenticated setup components were removed after successful import and CORS verification. Production website origin must be configured when its URL is known.
