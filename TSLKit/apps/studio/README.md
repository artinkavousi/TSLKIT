# TSL Studio App

The Studio app is a Vite-powered React experience that showcases presets from `@tslstudio/tsl-kit` using the `@tslstudio/engine` renderer. It provides live parameter controls, preset galleries, tutorials, and an inspector that validates schema metadata.

## Available scripts

```bash
npm run dev --workspace @tslstudio/studio
npm run build --workspace @tslstudio/studio
npm run preview --workspace @tslstudio/studio
npm run test --workspace @tslstudio/studio
npm run lint --workspace @tslstudio/studio
npm run typecheck --workspace @tslstudio/studio
```

## Features

- **Lab** – Interactive canvas backed by `createRenderer` from `@tslstudio/engine` with Leva controls and snapshot capture.
- **Gallery** – Material and post-processing presets loaded through the agent API.
- **Tutorials** – Guided walkthroughs linked to presets for quick exploration.
- **Inspector** – Schema validation and noise registry metadata from `@tslstudio/tsl-kit`.

The app is configured for static hosting via `netlify.toml` and includes a Vitest smoke test that ensures the core sections render correctly.
