# Source material

Drop flat `.md` (or `.txt`) files here to use as pipeline input. Each file is a
self-contained piece of source material (notes, an article, a transcript, etc.).

Run one by name with the `--source` flag (no path, no extension needed):

```bash
npm run run -- --source worldcup                 # mock (offline)
npm run run -- --source worldcup --provider openai
```

`--source <name>` resolves to `pipeline/sources/<name>.md`. You can still pass an
arbitrary path with `--input <path>` instead.

These files are committed (unlike `pipeline/artifacts/`, which is runtime output).
Add real source documents here as the project grows.
