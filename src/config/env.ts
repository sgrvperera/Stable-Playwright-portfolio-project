import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  BASE_URL: process.env.BASE_URL ?? 'http://127.0.0.1:3100',
  API_BASE_URL: process.env.API_BASE_URL ?? 'http://127.0.0.1:3100/api',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME ?? 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? 'password',
} as const;
