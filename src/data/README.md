# Index images

**Add an image or video:** Put the file in `public/index/` (e.g. `public/index/my-shot.webp`).

- Stills: WebP, about 2400px on the long side. PNG and JPG work too; the site
  resizes them for each screen, but WebP keeps the repo small.
- Moving: MP4 (H.264) is best and plays everywhere; WebM also works. They
  autoplay muted and loop. GIF works but is many times heavier.

**Show it on the site:** Add an entry to `index.json` in this folder:

```json
{ "src": "my-shot.webp", "width": 2400, "height": 1800, "alt": "What it shows" }
```

`width` and `height` are the file's pixel size (only the ratio matters), so the
grid can reserve the right space before it loads.

**Reorder:** Change the order of the entries in `index.json`. The site places
them left to right, each into the shortest column.
