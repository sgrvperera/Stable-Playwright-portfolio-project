import { test, expect } from '../../src/fixtures/testBase';

test.describe('API - Booking lifecycle', () => {
  test('creates, fetches, updates and deletes a booking', async ({ apiClient, bookingPayload }) => {
    const createResponse = await apiClient.createBooking(bookingPayload);
    expect(createResponse.status()).toBe(201);

    const createBody = await createResponse.json();
    expect(createBody.bookingid).toBeTruthy();
    expect(createBody.booking.firstname).toBe(bookingPayload.firstname);

    await apiClient.login();
    const bookingId = createBody.bookingid as number;

    const getResponse = await apiClient.getBooking(bookingId);
    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();
    expect(getBody.firstname).toBe(bookingPayload.firstname);
    expect(getBody.lastname).toBe(bookingPayload.lastname);

    const updatedPayload = {
      ...bookingPayload,
      firstname: `${bookingPayload.firstname}-updated`,
    };

    const updateResponse = await apiClient.updateBooking(bookingId, updatedPayload);
    expect(updateResponse.status()).toBe(200);

    const updateBody = await updateResponse.json();
    expect(updateBody.booking.firstname).toContain('-updated');

    const deleteResponse = await apiClient.deleteBooking(bookingId);
    expect(deleteResponse.status()).toBe(204);

    const deletedCheck = await apiClient.getBooking(bookingId);
    expect(deletedCheck.status()).toBe(404);
  });

  test('returns booking list for a room', async ({ apiClient }) => {
    await apiClient.login();
    const response = await apiClient.getBookings(1);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.bookings)).toBeTruthy();
  });

  test('rejects booking creation with invalid dates', async ({ apiClient, bookingPayload }) => {
    const response = await apiClient.createBooking({
      ...bookingPayload,
      bookingdates: {
        checkin: bookingPayload.bookingdates.checkout,
        checkout: bookingPayload.bookingdates.checkin,
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toContain('Checkout must be after checkin');
  });
});
