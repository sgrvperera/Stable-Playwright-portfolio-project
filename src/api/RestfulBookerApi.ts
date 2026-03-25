import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { ENV } from '../config/env';
import { BookingPayload } from '../data/bookingFactory';

export class RestfulBookerApi {
  constructor(private readonly request: APIRequestContext) {}

  private get base() {
    return ENV.API_BASE_URL;
  }

  async authHealth(): Promise<APIResponse> {
    return this.request.get(`${this.base}/health`);
  }

  async login(username = ENV.ADMIN_USERNAME, password = ENV.ADMIN_PASSWORD): Promise<APIResponse> {
    return this.request.post(`${this.base}/login`, {
      data: { username, password },
    });
  }

  async validateToken(token: string): Promise<APIResponse> {
    return this.request.post(`${this.base}/validate`, {
      data: { token },
    });
  }

  async logout(token?: string): Promise<APIResponse> {
    return this.request.post(`${this.base}/logout`, {
      data: token ? { token } : {},
    });
  }

  async getBookings(roomId?: number): Promise<APIResponse> {
    const url = roomId ? `${this.base}/bookings?roomId=${roomId}` : `${this.base}/bookings`;
    return this.request.get(url);
  }

  async getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`${this.base}/bookings/${id}`);
  }

  async createBooking(payload: BookingPayload): Promise<APIResponse> {
    return this.request.post(`${this.base}/bookings`, {
      data: payload,
    });
  }

  async updateBooking(id: number, payload: BookingPayload): Promise<APIResponse> {
    return this.request.put(`${this.base}/bookings/${id}`, {
      data: payload,
    });
  }

  async deleteBooking(id: number): Promise<APIResponse> {
    return this.request.delete(`${this.base}/bookings/${id}`);
  }

  async assertLoggedIn(): Promise<void> {
    const response = await this.login();
    expect([200]).toContain(response.status());
  }
}
