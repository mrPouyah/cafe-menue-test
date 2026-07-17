# Image Prompt Analyzer (Android)

A React Native (Expo) Android app that turns any photo into a detailed,
ready-to-use AI image-generation prompt — using an API key you provide
yourself.

## How it works

1. Open **Settings**, pick a provider (OpenAI, Google Gemini, or Anthropic
   Claude), and paste in your own API key. The key is stored only on-device
   via the Android Keystore (`expo-secure-store`) and is sent directly from
   your phone to that provider's API — never to any other server.
2. On the **Home** screen, upload or photograph an image and tap
   **Analyze Image**. The app sends it to your chosen vision model and
   returns one detailed prompt describing the subject, composition,
   lighting, color palette, style, and mood — ready to paste into
   Midjourney, Stable Diffusion, DALL-E, etc.
3. Optionally, upload a **reference photo** showing a specific style,
   lighting, or composition you want, and tap **Generate Exact Prompt**.
   The app re-analyzes both images together and rewrites the prompt so the
   original subject is described exactly in the reference photo's style.

## Project layout

```
android-app/
  App.tsx                    # navigation shell (Home / Settings)
  src/
    types/                   # shared TS types
    storage/apiKeyStore.ts   # secure, per-provider API key storage
    providers/                # one adapter per vision API + shared prompts
      openai.ts / gemini.ts / claude.ts
    screens/
      HomeScreen.tsx          # upload -> analyze -> refine with reference flow
      SettingsScreen.tsx      # provider picker + API key entry
    components/
      ImagePickerButton.tsx   # camera/library picker
      ResultCard.tsx          # prompt display + copy-to-clipboard
```

## Running it

Requires Node.js 18+ and an Android device or emulator.

```bash
cd android-app
npm install

# Easiest: run in Expo Go on a physical device (scan the QR code)
npm start

# Or build/run a full native Android app (requires Android Studio/SDK)
npm run android
```

Before your first native build, it's worth running
`npx expo install --check` to make sure every dependency is pinned to the
exact version your installed Expo SDK expects.

## Notes on the providers

- **OpenAI** — calls `gpt-4o` via `/v1/chat/completions` with the image as
  a base64 `image_url`.
- **Gemini** — calls `gemini-1.5-flash` via `generateContent` with the image
  as `inline_data`.
- **Claude** — calls `claude-sonnet-5` via `/v1/messages` with the image as
  a base64 `image` content block.

All three adapters implement the same `VisionProvider.analyzeImage()`
interface (`src/providers/types.ts`), so swapping or adding a provider only
means adding one new file plus a registry entry in `src/providers/index.ts`.

## Permissions

The app requests camera and photo library access only when you tap
**Take Photo** / **Choose from Library** — declared in `app.json` via the
`expo-image-picker` config plugin.
