import { test } from '../../src/fixtures/testBase';
import { HomePage } from '../../src/pages/HomePage';

test.describe('UI - Booking form', () => {
  test('submits the booking form successfully', async ({ page, bookingPayload }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.assertLoaded();
    await home.submitBookingForm(bookingPayload);
    await home.assertBookingSuccess();
  });
});
