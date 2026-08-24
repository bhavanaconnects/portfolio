# M Bhavana — Portfolio Website

A modern, responsive personal portfolio built with plain **HTML5, CSS3, and vanilla JavaScript** — no frameworks or build tools required.

## Structure

```
portfolio/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── profile.jpg
│   └── project-images/
└── README.md
```

## Running locally

Just open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Sections

Home · About Me · Education · Skills · Experience & Internships · Projects · Certifications · Contact

## Notes

- Colors and typography are controlled with CSS variables at the top of `style.css`.
- The contact form validates input in the browser but is **not connected to a backend or email service** — hook it up to something like Formspree, EmailJS, or your own API endpoint if you want it to actually send messages.
- Replace `assets/profile.jpg` and the SVG placeholders in the Projects section with real screenshots any time.
