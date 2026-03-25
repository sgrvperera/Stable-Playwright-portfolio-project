import { test } from '../../src/fixtures/testBase';
import { AdminLoginPage } from '../../src/pages/AdminLoginPage';

test.describe('UI - Admin login', () => {
  test('logs in to the admin panel', async ({ page }) => {
    const admin = new AdminLoginPage(page);

    await admin.goto();
    await admin.login();
    await admin.assertLoggedIn();
  });
});
