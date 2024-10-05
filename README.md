# Paperless downloader

This tool should help with downloading all files stored in paperless.

To install dependencies:

```bash
bun install
```

To download all Documents:

```bash
bun run downloader.js --url YOU_PAPERLESS_URL --token HERE_YOU_PAPERLESS_TOKEN
```

To download only some documents:

```bash
bun run downloader.js --url YOU_PAPERLESS_URL --token HERE_YOU_PAPERLESS_TOKEN --documents 1,25,12 (your docuemtn_ids)
```
