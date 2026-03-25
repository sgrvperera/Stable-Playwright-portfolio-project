import { test as base, expect } from '@playwright/test';
import { RestfulBookerApi } from '../api/RestfulBookerApi';
import { buildBookingPayload, BookingPayload } from '../data/bookingFactory';

type Fixtures = {
  apiClient: RestfulBookerApi;
  bookingPayload: BookingPayload;
};

export const test = base.extend<Fixtures>({
  apiClient: async ({ request }, use) => {
    await use(new RestfulBookerApi(request));
  },
  bookingPayload: async ({}, use) => {
    await use(buildBookingPayload());
  },
});

export { expect };
