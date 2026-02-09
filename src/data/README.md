# Project images (works)

**Add an image:** Put the file in `public/works/` (e.g. `public/works/my-project.png`).

**Show it on the site:** Add one line to `works.json` in this folder:

```json
{ "src": "my-project.png", "alt": "My project name" }
```

**Reorder:** Change the order of the lines in `works.json`. The site shows them in that order.

No Supabase, no database — just the folder + this file.
