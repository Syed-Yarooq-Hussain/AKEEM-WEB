# Akeem Group

Premium responsive React website for the planned Akeem Group holding company. German, English, French and Spanish editorial content, three selectable hero stories, a situation-based partnership explorer, interactive principles, a four-stage collaboration journey, a future roadmap, a technology focus area with a detail dialog, an Aid Projects section, and seven FAQs.

The guided enquiry has three stages: topic, business story and contact information. Explorer and hero actions preselect the relevant topic. Back/forward navigation preserves entered values; users can review, edit and copy their prepared enquiry. Nothing is sent to a server.

Motion includes a reading progress indicator, section reveals, chapter transitions, a pointer-responsive hero and a decorative orbit. Reduced-motion preferences are respected.

## Run

```sh
npm install
npm run dev
```

Production build: `npm run build`. Preview: `npm run preview`.

Browser verification: with the dev server on port 5173 and Microsoft Edge installed, run `node scripts/qa.cjs`. It checks hero chapters, language switching, the explorer's context handoff, enquiry stages and preserved values, review/edit, principles, process steps, roadmap, technology details, FAQs, dialogs, mobile navigation, image loading, runtime errors and overflow at 1440, 390 and 360 pixels. Screenshots are saved under `scripts/` and ignored by Git.

## Content and launch

Base translations and planned portfolio entries are in `src/main.jsx`; expanded content and interactive sections are in `src/Experience.jsx`. Styling is in `src/style.css` and `src/experience.css`. The supplied references inform the gold accents and wordmark, without implying ownership of Williams Ventures. No businesses are represented as confirmed holdings. The founder section uses a founding vision rather than an invented biography. Strategic copy describes intentions and should be reviewed by the client before publication.

Before launch: confirm company incorporation status, founder name/photo/biography, actual portfolio and permission to use brand assets. Supply business address, responsible person, contact email and legal/privacy copy. Connect the enquiry form to a real submission service; it currently prepares a local copy and explicitly does not send. Languages: DE/EN/FR/ES. The initial geographic focus is Cyprus. Supply approved photos of the well-building and children’s aid projects; no project photographs have been invented or substituted. Google Fonts and illustrative Unsplash photographs are loaded externally; replace with licensed local assets and client photographs as appropriate.

Additional verification: `node scripts/languages-qa.cjs` checks all four languages at 1440, 768, 390 and 360 pixels, including Cyprus copy, portfolio removal, aid-project navigation, enquiry completion, detail dialogs and overflow. French and Spanish content is in `src/locales.jsx` and `src/experience-locales.jsx`; aid-project content is in `src/AidProjects.jsx`.
