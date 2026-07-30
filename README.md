# In Aggregate

The source for [In Aggregate](https://aoleskie.github.io), my personal site —
a small home on the internet for a few projects, occasional writing, and a
slowly growing reading list. It's plain HTML, CSS, and JavaScript with no build step,
framework, or `package.json`. The goal is something that loads quickly, is
easy to edit by hand, and will still work in fifteen years.

## What's here

```
├── index.html                  landing page
├── projects.html               project writeups, filterable by category
├── publications.html           papers, talks, and honors
├── blog/
│   ├── index.html              writing index
│   └── stochastic-cell-fate.html
├── demos/
│   ├── two-state-switch.html   interactive Gillespie-ish stochastic switch
│   └── hearts.html             Hearts (placeholder for now)
├── reading/
│   ├── index.html              the books-by-country project
│   ├── reading.css             page-specific styles for the map and list
│   ├── reading.js              D3 map + searchable list
│   └── data/
│       ├── books.json          the running list, processed from a spreadsheet
│       └── world-50m.json      Natural Earth world map TopoJSON
├── assets/
│   ├── style.css               the design system
│   ├── projects.js             category filter for the projects page
│   ├── d3.min.js               D3 v7, bundled locally
│   └── topojson-client.min.js  topojson-client v3, bundled locally
├── .nojekyll                   tells GitHub Pages: don't process with Jekyll
└── README.md                   this file
```

## Deploying

The site is set up as a GitHub Pages user site, served from the root of
`aoleskie.github.io`. To push an update:

```bash
git add .
git commit -m "describe the change"
git push
```

GitHub Pages will rebuild within a minute or two. There's no build step on
their end either — every file you push is served directly.

If you're forking this for your own site, the steps are:

1. Create a public repo on GitHub named exactly `YOUR-USERNAME.github.io`.
2. Clone this repo locally, replace the personal content, and push to your new
   remote.
3. In the new repo's **Settings → Pages**, set the source to the `main`
   branch, root folder.
4. The site will be live at `https://YOUR-USERNAME.github.io`.

## How it was built

The site was built as a testcase with Claude over a series of
conversations — design direction, copy edits, the interactive map, the
project filter, all of it iterated on in chat. The goal was to end up with
something that felt handmade and personal, not template-y. The trade-off is
that everything is a little bespoke and there's no framework keeping things
consistent for me. So far, that's been worth it.

### Design

- **Type.** [Fraunces](https://fonts.google.com/specimen/Fraunces) for
  display headlines, especially the italic cuts.
  [Newsreader](https://fonts.google.com/specimen/Newsreader) for body
  copy. [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
  for metadata, eyebrows, code, and anything that should feel terse next
  to the prose.
- **Palette.** Cream paper, near-black ink, hot magenta and teal accents
  (representing dual-channel fluorescence microscopy in my
  research, red / green was feeling a little too Christmas), and highlighter yellow as a tertiary used for inline
  emphasis and the "featured" tape on project cards.
- **Texture.** A subtle SVG noise grain layered above the background
  gives the page a paper-stock feel without being distracting.
- **Layout.** Asymmetric hero with the last name set in italic and
  indented; dashed horizontal rules between sections; a small piece of
  "tape" on the featured project card.

### Interactivity

Three interactive pieces, all written in plain JavaScript:

- **The reading map** (`reading/reading.js`). Uses
  [D3](https://d3js.org) v7 and
  [topojson-client](https://github.com/topojson/topojson-client) v3,
  both bundled locally so the page works without a CDN. The world
  geometry is the Natural Earth `countries-50m` from
  [world-atlas](https://github.com/topojson/world-atlas), keyed by ISO
  numeric (M.49) codes; the books data is keyed by ISO alpha-3 with a
  numeric ID added during processing for the join. Color encoding is a
  five-stop linear scale across the rating range.
- **The two-state switch demo** (`demos/two-state-switch.html`). A
  tau-leaping stochastic simulator running in the browser, about sixty
  lines of plain JS at the bottom of the file. Built originally as a
  teaching aid.
- **The project filter** (`assets/projects.js`). A small script that
  toggles visibility of cards and category headings based on
  `data-category` attributes. Counts on the filter pills are auto-derived
  from the cards.

### What's deliberately not here

- No build step, no bundler, no `package.json`.
- No analytics, no tracking, no third-party widgets.
- No CMS. Everything is HTML files I edit directly.

## Editing

**Replace placeholder links.** A few links in the source point to my actual
profiles (`github.com/aoleskie`, my Google Scholar page, my LinkedIn). If
you're forking this, search-and-replace those.

**Tweak the palette.** The `:root` block at the top of `assets/style.css`
is the entire color and type system. Changing `--magenta` and `--teal` will
ripple through the whole site, including the reading map.

**Add a project.** In `projects.html`, the cards live in
`<div class="grid-projects">` blocks under each category heading. Copy any
existing card, change the `data-category`, status badge, tag, headline, and
description. Then add a matching `<section>` further down the page with the
full writeup.

**Add a publication.** Copy any `<li>` inside `<ol class="pub-list">` in
`publications.html` and edit the year, title, authors, and venue. Bold the
name where appropriate.

**Add a blog post.**
1. Copy `blog/stochastic-cell-fate.html` to a new file in `blog/`.
2. Update the `<title>`, header date, `<h1>`, and body.
3. Add a `<a class="post-link">` entry to `blog/index.html`.
4. Optionally add the same entry to the "recent writing" section on
   `index.html`.

**Update the reading list.** The list is processed from a spreadsheet into
`reading/data/books.json`. To add a finished book, edit that JSON directly,
or rerun the conversion script if you've updated the source spreadsheet.
Each record has `iso`, `country`, `book`, `author`, `rating`, `status`, and
`alt`, plus an `id` field that holds the numeric M.49 code used to join the
data to the map.

## License

Code is MIT-licensed; do whatever you'd like with it. Personal content —
project writeups, blog posts, the books list — is mine and shouldn't be
copied wholesale. The fonts are loaded from Google Fonts under their
respective open licenses.