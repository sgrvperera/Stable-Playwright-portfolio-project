import path from 'path';
import { test } from '../../src/fixtures/testBase';
import { LocalUploadPage } from '../../src/pages/LocalUploadPage';

test.describe('UI - File upload fixture', () => {
  test('uploads a file in a deterministic local fixture', async ({ page }) => {
    const upload = new LocalUploadPage(page);
    const filePath = path.resolve(process.cwd(), 'tests/assets/upload.txt');

    await upload.load();
    await upload.upload(filePath);
    await upload.assertUploaded('upload.txt');
  });
});
