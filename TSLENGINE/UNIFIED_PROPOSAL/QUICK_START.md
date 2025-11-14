# Quick Start — Engine & Website Workspace

## Base Application Setup
1. Scaffold the Next.js App Router project with TypeScript and Tailwind: `npx create-next-app@latest <project> --ts --eslint --tailwind`.
2. Install the rendering, state, and animation deps (`three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `zustand`, `gsap`).
3. Add the content, AI, and tooling packages (`contentlayer`, `next-contentlayer`, `ai`, `zod`, `@mlc-ai/web-llm`, `tweakpane`, `@tweakpane/plugin-essentials`).
4. Bring in the DX suite for search and testing (`pagefind`, `vitest`, `playwright`, `@playwright/test`, `biome`).
5. Copy the starter file map (layout, persistent canvas, scenes, CMS, AI agents, workflows, CI) as described in the engine-first WebGPU starter reference.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L21-L105】

## WebGPU Initialization Checklist
- Use `WebGPURenderer` inside the shared `<Canvas>` and call `await renderer.init()` before first render to avoid premature draw calls.【F:DOCS/proposal v1/proposal.md†L65-L126】【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L132-L192】
- Preserve WebGL fallback in the renderer factory for unsupported devices while surfacing capability banners.
- Ensure the persistent canvas sits alongside the CMS/overlay root so engine scenes can hydrate independently of page routing.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L109-L192】

## Documentation & Automation Prep
- Initialize MDX/Contentlayer for knowledge capture and example galleries.
- Configure GitHub Actions (quality, build, deploy) from the starter file map so each phase can enforce lint/tests before merging.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L43-L105】
- Create AI agent endpoints (`ux-assistant`, `builder`) early to dogfood JSON-schema driven APIs as modules come online.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L43-L105】

## Phase 3+ Additions
- Mount compute presets via `LAB_PRESET_REGISTRY` and `createSceneFromPreset` so agents can request particle/fluid kernels with metadata-rich responses.
- Wire post-processing chains (bloom, motion blur, depth of field) by reading `packages/tsl-kit/src/post` descriptors and mapping them to composer passes.
- Expose runtime guards with `initWebGPUScene` capability hooks, telemetry samples, and the inspector store so dashboards reflect adapter + FPS data.
- Expand the Next.js app with `/portfolio`, `/lab`, and `/admin` routes showcasing hero scenes, lab controls, and release checklists driven by preset metadata.
