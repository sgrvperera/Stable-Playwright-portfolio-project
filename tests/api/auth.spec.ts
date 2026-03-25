import { test, expect } from '../../src/fixtures/testBase';

test.describe('API - Auth', () => {
  test('health check is available', async ({ apiClient }) => {
    const response = await apiClient.authHealth();
    expect(response.status()).toBe(200);
  });

  test('login returns a valid session token', async ({ apiClient }) => {
    const response = await apiClient.login();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.token).toBeTruthy();
    expect(body.username).toBe('admin');
  });

  test('invalid token is rejected', async ({ apiClient }) => {
    const response = await apiClient.validateToken('invalid-token');
    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.valid).toBe(false);
  });
});
