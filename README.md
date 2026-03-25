# Stable Playwright Booking Portfolio

A polished Playwright portfolio framework built around a **self-contained local booking app**. It includes UI automation, API automation, an integration flow, HTML reporting, Allure support, screenshots, traces, and GitHub Actions CI.

## What this project demonstrates

- UI + API together
- Page Object Model
- Reusable test data factories
- Positive and negative API checks
- Contact form flow
- Booking creation flow
- Admin login and dashboard verification
- File upload fixture
- HTML report, traces, screenshots, and video
- GitHub Actions CI

## Why this version is stable

This project runs against a local app started by Playwright's `webServer` option, so the test target is inside the repository and is not affected by public demo-site ads or intermittent UI changes.

## Prerequisites

- Node.js 18+ recommended
- npm
- Chromium browser installed by Playwright

## Setup

```bash
npm install
copy .env.example .env
npx playwright install --with-deps chromium
```

## Run tests

```bash
npm test
npm run test:ui
npm run test:api
npm run test:integration
```

## Reports

```bash
npm run report
npm run allure:generate
npm run allure:open
```

## CI

The GitHub Actions workflow in `.github/workflows/ci.yml` installs dependencies, starts the local server, and runs the Playwright suite.
