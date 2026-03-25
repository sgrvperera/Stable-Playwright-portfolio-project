# Playwright Stable Booking Portfolio

A polished Playwright automation framework that demonstrates **UI + API testing, integration testing, local test app automation, reporting, and CI readiness**. This project was built as a freelancer-ready portfolio piece to showcase how a real-world test automation framework should be structured, maintained, and presented.

## Why this project exists

This repository was created to simulate the kind of work a professional QA automation engineer would deliver for a real client:

* UI automation for a booking workflow
* API automation for booking lifecycle and auth flow
* Integration testing where API-created data is verified in the UI
* File upload coverage
* Clean Page Object Model architecture
* Test data and reusable fixtures
* HTML report, traces, and failure artifacts
* GitHub Actions CI pipeline

The goal is to present a framework that looks and feels like a **client-grade automation project** rather than a basic practice repo.

## Key highlights

* **Playwright + TypeScript**
* **UI and API tests in one framework**
* **Integration test**: create booking by API, verify in UI, delete by API
* **Page Object Model (POM)** for maintainable UI automation
* **Reusable API client** for auth and booking operations
* **Local deterministic test app** to avoid flaky external dependencies
* **HTML report generation**
* **Trace viewer and screenshots on failure**
* **Video capture on failure**
* **GitHub Actions CI workflow**
* **Designed for portfolio and freelance presentation**

## What this framework demonstrates

### UI testing

* Home page validation
* Booking form submission
* Admin login
* Contact form submission
* File upload flow

### API testing

* Health check
* Login and session token validation
* Booking creation, update, fetch, and delete
* Negative validation for invalid dates
* Invalid token rejection
* Booking list retrieval for a room

### Integration testing

* Create a booking using API
* Verify booking data in the UI admin panel
* Delete the booking using API

### Reporting and debugging

* HTML report
* Playwright traces
* Screenshots on failure
* Video on failure

## Tech stack

* **Playwright**
* **TypeScript**
* **Node.js**
* **GitHub Actions**
* **HTML reporting**
* **Local web app server** for stable execution

## Project structure

```text
playwright-stable-booking-portfolio/
├─ src/
│  ├─ api/
│  ├─ fixtures/
│  ├─ pages/
│  ├─ utils/
│  └─ config/
├─ tests/
│  ├─ api/
│  ├─ ui/
│  └─ integration/
├─ app/
│  └─ local-booking-app/
├─ test-results/
├─ playwright-report/
├─ .github/
│  └─ workflows/
├─ .env.example
├─ playwright.config.ts
├─ package.json
└─ README.md
```

## Folder overview

### `src/pages`

Contains Page Object Model classes for UI screens such as booking, admin login, contact form, and home page.

### `src/api`

Contains reusable API client logic for authentication and booking operations.

### `src/fixtures`

Contains custom fixtures and reusable setup logic for tests.

### `src/utils`

Contains helper functions, test data builders, and reusable utilities.

### `tests/api`

Contains API-level checks such as health, auth, and booking lifecycle tests.

### `tests/ui`

Contains browser-based UI automation scenarios.

### `tests/integration`

Contains end-to-end integration checks that connect API and UI workflows.

### `app/local-booking-app`

Contains the local deterministic booking application used for testing.

## Prerequisites

* Node.js 18+ recommended
* npm
* Git
* VS Code recommended

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Create your local environment file

Copy `.env.example` to `.env` and adjust values if needed.

### 3) Install Playwright browsers

```bash
npx playwright install --with-deps chromium
```

## Running tests

### Run the full suite

```bash
npm test
```

### Run only UI tests

```bash
npx playwright test tests/ui
```

### Run only API tests

```bash
npx playwright test tests/api
```

### Run integration tests only

```bash
npx playwright test tests/integration
```

### Run headed mode

```bash
npx playwright test --headed
```

### Open the HTML report

```bash
npm run report
```

### Generate Allure results

```bash
npm run allure:generate
```

### Open Allure report

```bash
npm run allure:open
```

## Environment variables

Example `.env.example`:

```env
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000/api
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
```

## CI/CD

This project includes a GitHub Actions workflow that runs the Playwright test suite automatically on push and pull request events.

Typical CI flow:

1. Install dependencies
2. Install Playwright browsers
3. Run tests
4. Upload reports and artifacts

## Portfolio value

This project is useful for freelance profiles because it demonstrates:

* real automation framework structure
* maintainable design with POM
* UI and API testing together
* data-driven and integration-style thinking
* CI workflow knowledge
* reporting and debugging maturity
* ability to create stable automation around a realistic application

## Suggested Upwork/Freelancer description

You can describe this project as:

> A Playwright TypeScript automation framework covering UI, API, and integration testing for a booking application. The framework uses Page Object Model, reusable API clients, fixtures, local test data, HTML reporting, traces, screenshots, videos on failure, and GitHub Actions CI.

## Troubleshooting

### Browsers not installed

```bash
npx playwright install --with-deps chromium
```

### Old test results causing confusion

```bash
rm -rf test-results playwright-report
```

### Environment file missing

Make sure `.env` exists in the project root.

### Tests fail because the local app is not running

Start the app or rerun the suite using the configured Playwright web server command.

## Notes

* This project is intentionally structured to look like a **client-ready automation framework**.
* It is meant to show organization, maintainability, and practical testing skill.
* The local app design helps avoid unstable external demo-site behavior and makes CI much more reliable.

## License

This project is created for learning, portfolio, and freelance demonstration purposes.

---

If you are reviewing this repository as a recruiter or client, this project is intended to demonstrate professional Playwright automation capability across UI, API, and CI workflows.
