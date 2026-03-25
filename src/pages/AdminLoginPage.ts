import { expect, Page } from '@playwright/test';
import { ENV } from '../config/env';

export class AdminLoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/admin');
  }

  async login(username = ENV.ADMIN_USERNAME, password = ENV.ADMIN_PASSWORD) {
    await this.page.locator('#username, input[name="username"]').fill(username);
    await this.page.locator('#password, input[name="password"]').fill(password);
    await this.page.locator('#login-form button[type="submit"]').click();
  }

  async assertLoggedIn() {
    await expect(this.page.getByRole('heading', { name: 'Reservations Dashboard' })).toBeVisible();
    await expect(this.page.locator('#booking-table')).toBeVisible();
  }

  async assertBookingVisible(firstname: string, lastname: string) {
    const search = this.page.locator('#booking-search');
    await search.fill(`${firstname} ${lastname}`);
    await expect(this.page.locator('#booking-table tbody tr')).toContainText(firstname);
    await expect(this.page.locator('#booking-table tbody tr')).toContainText(lastname);
  }
}
