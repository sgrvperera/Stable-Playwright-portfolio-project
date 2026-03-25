import { test } from '../../src/fixtures/testBase';
import { HomePage } from '../../src/pages/HomePage';
import { buildContactMessage } from '../../src/data/contactFactory';

test.describe('UI - Contact form', () => {
  test('submits the contact form successfully', async ({ page }) => {
    const home = new HomePage(page);
    const contact = buildContactMessage();

    await home.goto();
    await home.assertLoaded();
    await home.submitContactForm(contact);
    await home.assertContactSuccess();
  });
});
