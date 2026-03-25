import { test } from '../../src/fixtures/testBase';
import { HomePage } from '../../src/pages/HomePage';

test.describe('UI - Home page', () => {
  test('opens the front page and shows the booking and contact sections', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.assertLoaded();
  });
});
