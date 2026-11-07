# IPS Studio website

A static, responsive studio website built with HTML, CSS and vanilla JavaScript. There is no build step or third-party JavaScript dependency.

## Run it

Open `index.html` in a browser, or serve the folder with a static file server such as `npx serve .`. Google Fonts is the only runtime font dependency; portfolio images and videos are local.

## GitHub Pages

The site has no compilation or package-install step. The GitHub Actions workflow in `.github/workflows/pages.yml` packages the repository root and deploys it to GitHub Pages whenever `main` is updated. Enable GitHub Pages with **GitHub Actions** as the build and deployment source in the repository settings.

## Routes

- `index.html` — studio-focused homepage with hero, studio highlights, text-led services, verified Upwork feedback, studio process, team, and contact form. Project showcases stay on internal pages.
- `portfolio.html` — unified, filterable work gallery for 3D modeling, animation, UI/UX, game art, and any verified case studies.
- `games/index.html` — filterable published Google Play catalog. Every game card opens its individual listing.
- `services/index.html` — six studio capabilities.
- `about/index.html` — studio values, real team photographs, a work gallery, capabilities, and contact CTA.
- `3d-modeling/index.html` — studio modeling work and credited ArtStation projects.
- `animation/index.html` — supplied animation clips, loaded when a visitor starts playback.
- `game-development/index.html` — reserved for approved case studies; it stays empty until real media, credits and project details are available.

## Content sources

- `assets/js/games.js` contains the published game catalog and featured game ID. Screenshots and icons are local in `assets/games/`.
- `assets/js/services.js` contains the six service rows.
- `assets/js/portfolio3D.js` contains modeling projects, artist/source credits and local galleries under `assets/3d/`.
- `assets/js/animations.js` maps supplied local clips and posters to their original Drive files under `assets/animations/`.
- `assets/js/gameDevelopment.js` contains verified case studies only. Do not duplicate catalog listings or add unverified project claims.

## Design and behavior

- `styles.css` contains shared tokens, page layouts and responsive breakpoints.
- `assets/js/site.js` handles sticky navigation, active states and the mobile menu.
- `assets/js/gameCards.js` renders game cards on the Games catalog.
- `gamesPage.js` provides category filters for the full game catalog.
- `app.js` renders homepage service cards and handles contact form validation.
- `unifiedPortfolio.js` renders the cross-discipline gallery on `portfolio.html`; project listings remain off the homepage.
- `premiumMotion.js` handles the accessible typewriter lines and optional count-up behavior.
- The contact form is a preview and does not transmit submissions. Connect a verified endpoint before accepting messages.
