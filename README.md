# Used Cars Market

![CI](https://github.com/lukaszmareckiwork-lgtm/UsedCarsMarket/actions/workflows/ci.yml/badge.svg)
![Frontend Deployment](https://github.com/lukaszmareckiwork-lgtm/UsedCarsMarket/actions/workflows/azure-static-web-apps-ambitious-beach-082d32c1e.yml/badge.svg)
![Backend Deployment](https://github.com/lukaszmareckiwork-lgtm/UsedCarsMarket/actions/workflows/main_usedcarsmarket-api.yml/badge.svg)

This project is a demonstration marketplace called "Used Cars Market". It showcases a full-stack application built with React on the frontend and ASP.NET on the backend. It is a portfolio project for a fullstack React + ASP.NET developer and is intended to demonstrate architecture, CI/CD, and a set of example features — not to be a fully production-ready system.

Core demo features (visible in the UI):
- Login / Register — user authentication flows (simple demo-friendly rules apply).
- Favourite offers — save offers to a favourites list.
- Search & filters — search for offers with filters (make, model, price, year, features).
- Add offer — create a new listing (image upload and basic metadata supported).

Key points:
- The frontend is a Vite + React + TypeScript app.
- The backend is an ASP.NET Core API.
- The whole project is deployed to Azure and the deployments are triggered via GitHub Actions.

## Live Demo

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ambitious-beach-082d32c1e.6.azurestaticapps.net)

Live demo: https://ambitious-beach-082d32c1e.6.azurestaticapps.net

> ⚠️ **Cold-start notice:**
this demo is deployed using cost-effective Azure serverless resources (including a serverless database tier). Serverless databases can auto-pause when idle to save cost; the first request after a pause may experience additional latency while the database resumes (a "cold start"). If you notice a short delay (~1 minute) when opening the demo, that's likely the serverless DB resuming. This behaviour is expected for low-cost serverless plans — to avoid it in production you can choose a provisioned tier or keep the service warm with periodic pings.

Demo account & password policy:
- You can interact with the demo using a public demo account or by creating your own account.
- The UI intentionally uses relaxed password restrictions for convenience in this demo (see the frontend UI notes). Do not use the demo account or its credentials for anything sensitive.

Data hygiene:
- The demo environment may be periodically restored from baseline backups to keep the dataset tidy and to avoid long-term data drift or abuse. Expect demo data to be reset from time to time.

## Tech Stack

![React](https://img.shields.io/badge/React-✔-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-✔-blue)
![Vite](https://img.shields.io/badge/Vite-✔-646CFF)
![ASP.NET](https://img.shields.io/badge/.NET-✔-512BD4)
![Azure](https://img.shields.io/badge/Azure-Cloud-0078D4)

Modern full-stack web application deployed on Azure using GitHub Actions and OIDC-based authentication.

More detail on tooling and libraries:
- Frontend: React + TypeScript, built with Vite. Testing uses Jest and React Testing Library. The project includes image/gallery helpers and a small set of static assets bundled with the app.
- Backend: ASP.NET Core, EF Core (migrations live under `api/Migrations`), and typical DI patterns. Tests use xUnit, FluentAssertions and Moq; integration tests rely on `Microsoft.AspNetCore.Mvc.Testing` and an in-memory/SQLite provider for lightweight test runs.
- CI/CD: GitHub Actions drive automated builds and deployments to Azure Static Web Apps and an Azure-hosted API. The workflows also run the example unit/integration tests.

- Mapping & geo: Mapbox (`mapbox-gl`) plus `@mapbox/mapbox-gl-draw` and `@mapbox/mapbox-gl-geocoder` for map interactions and drawing tools; `@turf/turf` for geometry helpers.

## Testing policy

 - Frontend: example unit tests are provided (Jest + React Testing Library). These tests exercise components and small logic units to demonstrate testing practices.
 - Backend: example unit tests and integration tests are present in `api.Tests`. The tests use xUnit, FluentAssertions and Moq; integration tests use `Microsoft.AspNetCore.Mvc.Testing` and a SQLite provider to exercise API endpoints and database interactions in a lightweight manner.

These tests are illustrative and are included in CI to demonstrate automated testing. A complete production test strategy would also include broader integration test coverage and full end-to-end (E2E) tests (for example using Playwright or Cypress) that exercise the full stack (UI -> API -> DB). E2E tests were intentionally omitted from this portfolio project.

## Quality, SEO & Accessibility

Basic SEO and accessibility considerations are applied to the frontend (semantic markup, accessible forms and ARIA where needed, descriptive meta tags). For production sites you should add automated audits to CI, for example:
- Lighthouse audits (performance, accessibility, best practices, SEO) run in CI and fail builds when thresholds are not met.
- Automated accessibility scans (axe, Pa11y) as part of the PR pipeline.

This repository includes only a basic set of accessibility and SEO improvements as examples; for a production system, formalising these checks (Lighthouse reports, regression alerts, and automated fixes where possible) is recommended.

## Running locally (short)

See the repository for more detailed instructions, but at a high level:
- Start the API (Visual Studio, `dotnet run`, or via your IDE) and ensure any required configuration (connection strings) is set.
- Start the frontend (`npm install` then `npm run dev`) and point it to the running API.

## Notes

This README improves the high-level explanation for the demo. For full developer onboarding, consult the repository's `api/` and `frontend/` folders.

## Author

- Name: Łukasz Marecki
- Email: lukaszmarecki.work@gmail.com
- LinkedIn: https://www.linkedin.com/in/łukasz-marecki-651b52346

## License & Attribution

All Rights Reserved © 2026 Łukasz Marecki

This repository is for demonstration and portfolio purposes only.  
Cloning, republishing, or claiming this project as your own is prohibited.  
The live demo is publicly accessible for evaluation purposes only.