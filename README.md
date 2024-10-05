# Paperless document downloader

This tool should help with downloading documents stored in paperless.

To install dependencies:

```bash
bun install
```

To download all documents:

```bash
bun run downloader.js --url YOU_PAPERLESS_URL --token HERE_YOU_PAPERLESS_TOKEN
```

To download only some documents:

```bash
bun run downloader.js --url YOU_PAPERLESS_URL --token HERE_YOU_PAPERLESS_TOKEN --documents 1,25,12 (your docuemtn_ids)
```
