# MuleRouter CLI

Command-line interface for [MuleRouter](https://www.mulerouter.ai) and [MuleRun](https://www.mulerun.com) multimodal AI APIs. Generate images, videos, speech, and music from the terminal.

## Features

- **40+ model endpoints** across 6 providers (Alibaba, Google, KlingAI, Midjourney, MiniMax, OpenAI)
- **Text-to-Image**, **Text-to-Video**, **Image-to-Video**, **Text-to-Speech**, **Text-to-Music**, and more
- Async task management with `status` command for non-blocking workflows
- Automatic task polling with progress updates
- Local image file auto-conversion to base64
- Retry with exponential backoff on transient errors
- JSON output mode for scripting and AI agent integration

## Installation

```bash
npm install -g mulerouter
# or
bun add -g mulerouter
```

## Quick Start

### 1. Configure

Set your API key and site:

```bash
export MULEROUTER_API_KEY=your-api-key-here
export MULEROUTER_SITE=mulerouter   # or "mulerun"
```

Or create a `.env` file:

```env
MULEROUTER_API_KEY=your-api-key-here
MULEROUTER_SITE=mulerouter
```

Get an API key at [mulerouter.ai/app/api-keys](https://www.mulerouter.ai/app/api-keys).

### 2. List available models

```bash
mulerouter list
mulerouter list --provider google
mulerouter list --output-type video
mulerouter list --tag SOTA --json
```

### 3. Check model parameters

```bash
mulerouter params alibaba/wan2.6-t2v
mulerouter params google/nano-banana-2/edit --json
```

### 4. Generate content

**Text-to-Video:**

```bash
mulerouter run alibaba/wan2.6-t2v --prompt "A cat walking through a garden"
```

**Text-to-Image:**

```bash
mulerouter run google/nano-banana-2/generation --prompt "A serene mountain lake" --resolution 2K
```

**Image-to-Video:**

```bash
mulerouter run alibaba/wan2.6-i2v --prompt "Gentle zoom in" --image /path/to/photo.png
```

**Text-to-Speech:**

```bash
mulerouter run minimax/speech-2.8-turbo --prompt "Hello world" --voice-id "Charming_Lady"
```

**Text-to-Music:**

```bash
mulerouter run minimax/music-2.5 --prompt "upbeat pop" --lyrics-prompt "[verse]\nHello world\n[chorus]\nLa la la"
```

## Commands

### `mulerouter list`

List available model endpoints with optional filtering.

| Option | Description |
|--------|-------------|
| `--provider <name>` | Filter by provider (alibaba, google, klingai, midjourney, minimax, openai) |
| `--output-type <type>` | Filter by output type (image, video, audio) |
| `--tag <tag>` | Filter by tag (e.g., SOTA) |
| `--site <site>` | Filter by site availability (mulerouter, mulerun) |
| `--providers` | List providers only |
| `--json` | Output as JSON |

### `mulerouter params <endpoint>`

Show parameters for a model endpoint.

```bash
mulerouter params <provider>/<model>              # auto-resolves action
mulerouter params <provider>/<model>/<action>      # explicit action
```

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### `mulerouter run <endpoint>`

Run a model endpoint to generate content.

```bash
mulerouter run <provider>/<model> [--param value ...]
mulerouter run <provider>/<model>/<action> [--param value ...]
```

| Option | Description |
|--------|-------------|
| `--api-key <key>` | Override API key |
| `--base-url <url>` | Override base URL |
| `--site <site>` | Override site (mulerouter, mulerun) |
| `--no-wait` | Create task without waiting for completion |
| `--poll-interval <s>` | Polling interval in seconds (default: 20) |
| `--max-wait <s>` | Maximum wait time in seconds (default: 900) |
| `--quiet` | Suppress progress output |
| `--json` | Output as JSON |
| `--extra <KEY=VALUE>` | Pass extra parameters |

Model-specific parameters are passed as `--param-name value` (use `mulerouter params` to see available options).

### `mulerouter status <api-path> <task-id>`

Check the status of an async task. Use with `run --no-wait` for non-blocking workflows.

```bash
# Submit a task without waiting
mulerouter run alibaba/wan2.6-t2v --prompt "A cat" --no-wait --json

# Check status later
mulerouter status /vendors/alibaba/v1/wan2.6-t2v/generation <task-id>

# Poll until completion
mulerouter status /vendors/alibaba/v1/wan2.6-t2v/generation <task-id> --wait
```

| Option | Description |
|--------|-------------|
| `--wait` | Poll until task completes |
| `--poll-interval <s>` | Polling interval in seconds (default: 20) |
| `--max-wait <s>` | Maximum wait time in seconds (default: 900) |
| `--json` | Output as JSON |

### `mulerouter config`

Show current configuration and setup help.

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MULEROUTER_API_KEY` | Yes | API key for authentication |
| `MULEROUTER_BASE_URL` | One of these | Custom API base URL (takes priority) |
| `MULEROUTER_SITE` | required | Site: `mulerouter` or `mulerun` |

**Priority:** CLI arguments > environment variables > `.env` file

**Base URL resolution:** `MULEROUTER_BASE_URL` > `MULEROUTER_SITE`

- `mulerouter` → `https://api.mulerouter.ai`
- `mulerun` → `https://api.mulerun.com`

## Supported Models

### Alibaba (15 endpoints)

Wan 2.6, 2.5, 2.2, 2.1 series, Happy Horse 1.0 — text/image-to-video, text/image-to-image, VACE editing, keyframe interpolation.

### Google (7 endpoints)

Nano Banana, Nano Banana 2, Nano Banana Pro (T2I + edit), Veo 3 (T2V + I2V).

### KlingAI (7 endpoints)

Kling V3 and V3 Omni — T2V, I2V, Ref2V, V2V, video editing with multi-shot and sound.

### Midjourney (2 endpoints)

Diffusion (T2I) and Video (T2V/I2V).

### MiniMax (4 endpoints)

Speech 2.8 HD/Turbo (TTS), Music 2.0/2.5 (TTM) — mulerun only.

### OpenAI (2 endpoints)

GPT Image 2 (T2I + edit) — mulerouter only.

## Image Input

For image parameters (`--image`, `--images`, `--first-frame`, etc.), local file paths are preferred:

```bash
mulerouter run alibaba/wan2.6-i2v --image /tmp/photo.png --prompt "Zoom in"
```

Local files are validated for safety, converted to base64, and sent to the API. Supported formats: PNG, JPG, JPEG, GIF, BMP, WebP, TIFF, SVG, ICO, HEIC, HEIF, AVIF.

## Development

This project uses [bun workspaces](https://bun.sh/docs/install/workspaces).

```bash
bun install          # install all dependencies
bun run build        # build both packages (core first, then CLI)
bun run test         # run all tests
bun run typecheck    # type check both packages
bun run lint         # lint with Biome
```

## License

MIT
