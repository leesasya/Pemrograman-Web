# Khalisya Zahra Portfolio

A responsive personal portfolio built with semantic HTML and modern CSS. It presents Khalisya's profile, selected experience, education, skills, and contact details using content from the supplied CV.

## Files

- `index.html` contains all page structure and content.
- `style.css` contains the full visual system, responsive layout, dark mode, and motion preferences.
- `asset/pp.jpeg` is the portfolio portrait.
- `asset/cv.pdf` is the downloadable CV.

## Run locally

Open `index.html` directly in a browser. No build step or package installation is required.

For a local server, run one of these commands from this directory:

```bash
npx serve .
```

or use the Live Deployment at www.well.well link.

## Design notes

- Native HTML and CSS keep the project small and portable.
- The layout adapts from an asymmetric desktop composition to a single-column mobile view.
- System color preference controls light and dark themes.
- Animations respect `prefers-reduced-motion`.
- Contact links, keyboard focus states, semantic landmarks, and descriptive image text improve accessibility.
