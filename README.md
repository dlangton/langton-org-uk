# langton-org-uk

A lightweight family photo website for langton.org.uk, built with static HTML, CSS, and JavaScript for GitHub Pages hosting.

## Features
- Responsive home page with a rotating slideshow
- Gallery page with album filters and image lightbox
- Gallery data stored in one maintainable JS file for easy updates
- Custom domain file included for GitHub Pages deployment

## Local preview
From the project root, run:

python3 -m http.server 8000

Then open http://localhost:8000 in a browser.

## GitHub Pages deployment
1. Push this repository to GitHub.
2. In the repository settings, enable GitHub Pages and select the main branch as the publishing source.
3. The included CNAME file preserves the custom domain `langton.org.uk`.
4. Ensure the domain is configured in your DNS provider to point to GitHub Pages.
