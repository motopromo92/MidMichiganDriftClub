# MMDC partnership collateral

Print documents for sponsor conversations. Each is an HTML file that renders to
a fixed US Letter page, so what you see on screen is exactly what comes out as
a PDF — no reflow surprises between the two.

| File | Pages | Use |
|---|---|---|
| `one-pager.html` | 1 | Leave-behind. Hand across the table, or attach to a first email. |
| `partnership-prospectus.html` | 7 | The full 2027 season and media proposal. Partner-agnostic. |
| `arroyo-grand-nationals-proposal.html` | 4 | Series title-partnership pitch for Arroyo. **Private — not for redistribution.** |

## Making PDFs

```bash
./docs/build-pdfs.sh
```

Writes to `docs/pdf/`. Pass a directory to write elsewhere. Or open any file in
a browser and print to PDF — margins are already set, so use default settings
and turn **off** "Headers and footers".

## Editing

- Copy lives in the HTML. Shared styling is in `print.css`.
- `print.css` intentionally repeats the brand tokens from the site's
  `styles.css` rather than importing it: these files have to render correctly
  from `file://` during PDF export, with no dependency on the site.
- Photos are in `assets/` as JPEGs. That is deliberate — Chrome passes JPEG
  through to the PDF untouched, while a WebP or PNG gets re-encoded losslessly
  and pushed the prospectus from under 1 MB to nearly 10 MB.
- Each page is one `<section class="sheet">`. Content must fit inside it;
  anything taller is silently clipped in the PDF rather than flowing onto the
  next page. After editing, check every sheet still fits:

  ```js
  // in the browser console, with the doc open
  [...document.querySelectorAll('.sheet')]
    .map((s,i) => ({ page: i+1, overflow: s.scrollHeight - s.clientHeight }))
    .filter(x => x.overflow > 2)
  ```

  An empty result means every page fits.

## Keeping it honest

Numbers here match the live site and the approved proposal. If the season
changes, update these alongside `/partnerships/` so a sponsor is never holding
a document that disagrees with the website.
