import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const config = defineConfig({
  testDir: path.join(rootDir, 'apps', 'studio', 'tests'),
  snapshotDir: path.join(rootDir, 'apps', 'studio', 'tests', '__screenshots__'),
  outputDir: path.join(rootDir, 'apps', 'studio', 'test-results'),
  reporter: [['list'], ['html', { open: 'never' }]],
  fullyParallel: true,
  expect: {
    toMatchSnapshot: {
      threshold: 0.2,
    },
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: process.env.STUDIO_BASE_URL,
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    ignoreHTTPSErrors: true,
    launchOptions: {
      slowMo: process.env.CI ? 0 : 20,
    },
  },
});

export default config;
