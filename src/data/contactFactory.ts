import { randomSuffix } from '../utils/random';

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function buildContactMessage(): ContactMessage {
  const suffix = randomSuffix(5);
  return {
    name: `Ruchika QA ${suffix}`,
    email: `ruchika.${suffix}@example.com`,
    phone: '0771234567',
    subject: `Portfolio contact ${suffix}`,
    message: `This is a portfolio contact message created by Playwright (${suffix}).`,
  };
}
