# Beav OCR

A web app that extracts text from images using OCR. Users upload an image and the app streams the extracted text back from a backend service.

## Overview

Beav OCR is a frontend-only SvelteKit application deployed to Cloudflare Pages. OCR itself is handled by a separate backend Cloudflare Worker; this app uploads the image, streams the result, and displays it.

The workflow:

1. The user uploads an image (click or drag-and-drop), max 9MB.
2. The image is stored in a global client-side store.
3. The user clicks **Extract**, which sends the image to the backend.
4. The backend streams OCR output as NDJSON chunks.
5. The extracted text appears incrementally in the output panel and can be copied.

## Tech Stack

- **Svelte 5** (runes mode) + **SvelteKit** with the Cloudflare Pages adapter
- **Tailwind CSS 4** + **daisyUI** (autumn theme) for styling
- **Iconify** for icons
- Deployed to **Cloudflare Pages** via **Wrangler**

## Getting Started

### Prerequisites

- Node.js and Bun (the lockfile is `bun.lock`, and `.npmrc` enforces the engine version with `engine-strict=true`)
- A running OCR backend (see [API Configuration](#api-configuration))

### Install

```bash
bun install
```

### Develop

```bash
bun run dev
```

### Scripts

| Command             | Description                                     |
| ------------------- | ----------------------------------------------- |
| `bun run dev`       | Start the Vite dev server                       |
| `bun run build`     | Build for production                            |
| `bun run preview`   | Preview the Cloudflare build locally (port 4173) |

## Project Structure

```
src/
├── app.html                 # HTML shell
├── lib/
│   ├── api/
│   │   ├── apiConfig.ts     # Backend URL selection (dev vs prod)
│   │   └── upload.ts        # Streaming image upload + NDJSON parsing
│   ├── components/
│   │   ├── fileUpload.svelte # Drag-and-drop / click upload zone
│   │   ├── image.svelte      # Preview of the selected image
│   │   ├── navbar.svelte     # Top navigation bar
│   │   └── output.svelte     # Extract button, text output, copy/clear
│   └── store/
│       └── store.svelte.ts   # Global $state holding the selected image
└── routes/
    ├── +layout.svelte       # Root layout (title, CSS import)
    ├── layout.css           # Tailwind + daisyUI theme setup
    └── +page.svelte         # Home page: upload, then image + output panes
```

## API Configuration

The backend URL is selected in `src/lib/api/apiConfig.ts`:

| Mode          | URL                                                |
| ------------- | -------------------------------------------------- |
| Development   | `http://127.0.0.1:8787`                            |
| Production    | `https://backend-service.pdenterprise314.workers.dev` |

The backend expects a `POST` request to `{apiUrl}/beav-ocr/upload` with the image as a `multipart/form-data` file field named `file`. It responds with a stream of NDJSON lines, one of these chunk types (`OCRStreamChunk`):

Look at [PD-Enterprise-Backend](https://github.com/PD-Enterprise/PD-Enterprise-Backend) for more details on the API.

```ts
| { type: 'delta'; delta: string }                     // partial extracted text
| { type: 'usage'; usage: { promptTokens, completionTokens, totalTokens } }
| { type: 'done' }
| { type: 'error'; message: string }
```

### Client-side validation

- No file selected -> error
- File >= 9MB -> error: "File must be smaller than 9MB"