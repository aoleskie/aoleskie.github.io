# oleskie.lab — personal site

A handmade portfolio + writing site. Plain HTML/CSS/JS, no build step, no
dependencies. Drop it on GitHub Pages and it works.

## what's in the box

```
├── index.html              landing page (hero, projects, writing, papers)
├── projects.html           full project deep-dives
├── publications.html       papers, talks, honors
├── blog/
│   ├── index.html          blog listing
│   └── stochastic-cell-fate.html   sample post
├── demos/
│   └── two-state-switch.html       interactive Gillespie-ish demo
├── assets/
│   ├── style.css           the entire design system
│   └── main.js             stochastic particle background
├── .nojekyll               tells GitHub Pages: don't process with Jekyll
└── README.md               this file
```

## deploy to GitHub Pages

The simplest path — a **user site** at `https://YOUR-USERNAME.github.io`:

1. On GitHub, create a new repo named exactly `YOUR-USERNAME.github.io` (replace
   with your actual GitHub username). Make it public.
2. Push these files to the `main` branch:
   ```bash
   cd path/to/this/folder
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin git@github.com:YOUR-USERNAME/YOUR-USERNAME.github.io.git
   git push -u origin main
   ```
3. In the repo's **Settings → Pages**, set Source to `main` branch, root folder.
   Save.
4. Wait ~1 minute. Visit `https://YOUR-USERNAME.github.io`.

For a **project site** (`https://YOUR-USERNAME.github.io/some-name/`) the only
difference is the repo can have any name, but you'll need to update the links
in the HTML to be relative (they already are — should just work).

## customizing

**Replace the placeholder links.** Search the HTML files for `https://github.com/`,
`https://scholar.google.com/`, `https://www.linkedin.com/` — those are
placeholders. Swap in your actual URLs.

**Tweak the palette.** Open `assets/style.css`. The first block of `:root`
variables is the entire color and type system. Change `--magenta` and `--teal`
to taste. Want a dark theme? Swap `--bg`, `--paper`, `--ink`, `--ink-soft`.

**Add a project.** In `projects.html`, copy a `<section>` block, change the
`id`, headline, and prose. Add a matching card on `index.html`.

**Add a publication.** In `publications.html`, copy any `<li>` inside the
`<ol class="pub-list">` and edit fields. Bold = your name.

**Add a blog post.**
1. Copy `blog/stochastic-cell-fate.html` → `blog/your-new-post.html`.
2. Change the `<title>`, `<header>` date, `<h1>`, and body.
3. In `blog/index.html`, add an `<a class="post-link">` entry.
4. Optionally add the same entry to the "recent writing" section of
   `index.html`.

**Add an interactive demo.** Drop a new `.html` file in `demos/`. Link it from
`projects.html` or `index.html`. The demo at `demos/two-state-switch.html` is
a working template — view-source it.

## design notes

- **Type:** Fraunces (display, italic for emphasis), Newsreader (body),
  JetBrains Mono (code, eyebrows, metadata). All from Google Fonts.
- **Palette:** warm cream paper, near-black ink, hot magenta and teal accents
  (a small homage to dual-channel fluorescence microscopy), highlighter
  yellow as a tertiary.
- **Background:** a stochastic particle field — ~38 particles doing a damped
  Brownian random walk, with faint connecting lines between nearby ones. A
  quiet visual reference to the actual research. Respects
  `prefers-reduced-motion`.
- **Texture:** SVG noise grain layered above the background to give the
  paper-stock feel.
- **Layout:** asymmetric hero (last name italic and indented), grid for
  projects, dashed rules between sections, "tape" decoration on the featured
  card.

## moving to Jekyll later (optional)

If you decide you want markdown blog posts:

1. Delete `.nojekyll`.
2. Add a `_config.yml` at the root with `title:`, `description:`, `theme:`
   if you want a theme baseline.
3. Move blog HTML files into a `_posts/` directory and rename them
   `YYYY-MM-DD-slug.md`.
4. Use Jekyll frontmatter and markdown bodies.

Until then, plain HTML is honestly fine and easier to debug.

## license

Code is yours to do whatever with. The fonts come from Google Fonts under
their respective open licenses.
