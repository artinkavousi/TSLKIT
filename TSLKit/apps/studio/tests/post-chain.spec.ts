import { expect, test } from '@playwright/test';

import { listPostPassMetadata } from '@tslstudio/tsl-kit/post';

test('post chain metadata renders consistently', async ({ page }) => {
  const metadata = listPostPassMetadata();
  const sorted = [...metadata].sort((a, b) => a.id.localeCompare(b.id));

  const cards = sorted
    .map(
      (item) => `
        <article class="card">
          <header>
            <h2>${item.label}</h2>
            <span class="chip">${item.id}</span>
          </header>
          <p>${item.description}</p>
          <footer>${item.tags.join(' · ')}</footer>
        </article>
      `
    )
    .join('');

  await page.setViewportSize({ width: 960, height: 720 });
  await page.setContent(
    `
      <html>
        <head>
          <style>
            body { background: #020617; color: #e2e8f0; font-family: 'Inter', system-ui, -apple-system, sans-serif; margin: 0; padding: 24px; }
            main { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
            .card { border-radius: 16px; border: 1px solid rgba(148, 163, 184, 0.35); padding: 16px; background: rgba(30, 41, 59, 0.65); display: flex; flex-direction: column; gap: 12px; }
            .card header { display: flex; justify-content: space-between; align-items: center; }
            .chip { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; background: rgba(15, 23, 42, 0.8); padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(148, 163, 184, 0.35); }
            footer { font-size: 12px; color: rgba(148, 163, 184, 0.85); }
          </style>
        </head>
        <body>
          <main>${cards}</main>
        </body>
      </html>
    `,
    { waitUntil: 'domcontentloaded' }
  );

  await expect(page.locator('main')).toHaveScreenshot('post-chain-metadata.png', { animations: 'disabled' });
});
