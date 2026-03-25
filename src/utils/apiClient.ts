export class ApiClient {
  baseUrl: string;
  token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  async login(username: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      this.token = data.token;  // <-- store token here
    }
    return response;
  }

  async fetch(path: string, options: any = {}) {
    const headers = options.headers || {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });
  }

  async deleteBooking(id: number) {
    return this.fetch(`/booking/${id}`, {
      method: 'DELETE',
    });
  }

  // other methods: createBooking, getBookings, etc.
}