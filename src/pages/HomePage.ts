import { expect, Locator, Page } from '@playwright/test';
import { BookingPayload } from '../data/bookingFactory';
import { ContactMessage } from '../data/contactFactory';

export class HomePage {
  readonly page: Page;
  readonly bookingHeading: Locator;
  readonly contactHeading: Locator;
  readonly bookingResult: Locator;
  readonly contactResult: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookingHeading = page.getByRole('heading', { name: 'Booking request' });
    this.contactHeading = page.getByRole('heading', { name: 'Contact us' });
    this.bookingResult = page.locator('#booking-result');
    this.contactResult = page.locator('#contact-success');
  }

  async goto() {
    await this.page.goto('/');
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/$/);
    await expect(this.bookingHeading).toBeVisible();
    await expect(this.contactHeading).toBeVisible();
  }

  async submitBookingForm(payload: BookingPayload) {
    await this.page.locator('#firstname').fill(payload.firstname);
    await this.page.locator('#lastname').fill(payload.lastname);
    await this.page.locator('#email').fill(payload.email);
    await this.page.locator('#phone').fill(payload.phone);
    await this.page.locator('#roomid').selectOption(String(payload.roomid));
    await this.page.locator('#checkin').fill(payload.bookingdates.checkin);
    await this.page.locator('#checkout').fill(payload.bookingdates.checkout);
    if (payload.depositpaid) {
      await this.page.locator('#depositpaid').check();
    }
    await this.page.locator('#notes').fill(payload.notes ?? '');
    await this.page.locator('#booking-form button[type="submit"]').click();
    await expect(this.bookingResult).toBeVisible();
  }

  async assertBookingSuccess() {
    await expect(this.bookingResult).toContainText('Booking created successfully');
  }

  async submitContactForm(message: ContactMessage) {
    await this.page.locator('#contact-name').fill(message.name);
    await this.page.locator('#contact-email').fill(message.email);
    await this.page.locator('#contact-phone').fill(message.phone);
    await this.page.locator('#subject').fill(message.subject);
    await this.page.locator('#message').fill(message.message);
    await this.page.locator('#contact-form button[type="submit"]').click();
    await expect(this.contactResult).toBeVisible();
  }

  async assertContactSuccess() {
    await expect(this.contactResult).toHaveText(/Thanks for getting in touch/i);
  }
}
