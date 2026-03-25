import { expect, Page } from '@playwright/test';

export class LocalUploadPage {
  constructor(private readonly page: Page) {}

  async load() {
    await this.page.goto('/upload');
  }

  async upload(filePath: string) {
    await this.page.locator('#uploader-name').fill('Portfolio Tester');
    await this.page.locator('#uploader-file').setInputFiles(filePath);
    await this.page.locator('#upload-form button[type="submit"]').click();
  }

  async assertUploaded(fileName: string) {
    await expect(this.page.locator('#upload-result')).toHaveText(`Uploaded: ${fileName}`);
  }
}
