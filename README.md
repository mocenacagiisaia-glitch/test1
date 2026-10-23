# Quill — personal writing studio

A dependency-free Node.js app for editing up to 5,000 words per request. Includes local phrase polishing, optional contextual AI rewriting, local writing-pattern analysis, three tones, copy/download, and optional browser-only draft history. No accounts or app usage quotas.

## Run

Requires Node.js 22 or later. From `/workspace/test1`:

```sh
npm test
npm start
```

The default port is 3000; override with `PORT`. No dependency installation is required.

## Optional AI rewriting

Set `WRITING_API_KEY` securely in your server environment, and optionally `WRITING_API_BASE` (default `https://api.openai.com/v1`) and `WRITING_MODEL` (default `gpt-4.1-mini`), then restart. Select **AI rewrite** in the app. The endpoint must support the OpenAI chat-completions format and enough context/output for your passage. Requests time out after two minutes; truncated responses are reported rather than silently accepted. Provider fees and rate limits apply, even though this app has no quotas. Never commit credentials. `.env` is ignored, but is not loaded automatically.

Local polish performs conservative phrase substitutions, with contractions in casual mode. It is not a full contextual rewrite. Natural and professional local modes share the same conservative editing rules. The writing check evaluates a small transparent set of style patterns. It does **not** identify AI authorship or provide an AI probability score. No detector-evasion result is promised.

## Privacy and hosting

Text is sent to this app's server. Local mode makes no third-party requests. Connected mode sends text to your selected AI provider. The server does not persist submitted text. Optional draft history stores the last ten inputs in browser localStorage; it is disabled by default and can be cleared in Settings. Browser clipboard access may require HTTPS; direct keyboard paste and download remain available.

This is a personal development app with no authentication. Keep it on a trusted/private network. Add authentication, HTTPS, and abuse controls before exposing a provider-backed instance publicly. Use `HOST=127.0.0.1` to bind only to loopback outside a cloud preview environment.
