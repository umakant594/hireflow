# HireFlow

HireFlow is a recruitment dashboard for managing jobs, candidates, applications, interviews, and settings.

## Tech stack
- Frontend: React + Vite + TypeScript
- Backend: Express + Prisma + SQLite

## Local development

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, open the repository and go to Settings > Pages.
3. Set the source to GitHub Actions.
4. Push to the `main` branch.
5. GitHub Actions will build and publish the frontend from `.github/workflows/deploy.yml`.

> The frontend uses a hash router for static hosting compatibility, and the API URL can be configured with the `VITE_API_URL` environment variable.

## Notes

- The frontend is designed for static hosting on GitHub Pages.
- The backend API is separate and should be deployed to a service such as Render, Railway, or another Node host.
