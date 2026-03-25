import { ENV } from '../../src/config/env';
import { test, expect } from '../../src/fixtures/testBase';
import { AdminLoginPage } from '../../src/pages/AdminLoginPage';

test.describe('Integration - API booking data verified in UI', () => {
  test('creates a booking by API and confirms it in the admin panel', async ({ page, apiClient, bookingPayload }) => {
    const createResponse = await apiClient.createBooking(bookingPayload);
    expect(createResponse.status()).toBe(201);

    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid as number;

    const admin = new AdminLoginPage(page);
    await admin.goto();
    await admin.login();
    await admin.assertLoggedIn();
    await admin.assertBookingVisible(bookingPayload.firstname, bookingPayload.lastname);

    const search = page.locator('#booking-search');
    await search.fill(String(bookingId));
    await expect(page.locator('#booking-table tbody tr')).toContainText(String(bookingId));

    // BEFORE deleting the booking
await apiClient.login(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
const deleteResponse = await apiClient.deleteBooking(bookingId);
expect(deleteResponse.status()).toBe(204);

    
  });
});
