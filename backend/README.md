# JobConnect Backend

Node.js + Express + PostgreSQL API for the JobConnect job portal.

## Setup

```bash
npm install
cp .env.example .env    # fill in your DB credentials, JWT secret, etc.
```

Make sure PostgreSQL is running locally and the database in `DB_NAME` exists:
```bash
createdb jobportal
```

## Run

```bash
npm run dev     # nodemon, auto-restart
npm start       # plain node
```

Server starts on `http://localhost:5000`. Tables are auto-created on first run via `sequelize.sync()`.

## Test

```bash
npm test
```
Tests use the same DB connection with `force: true` sync — point `.env` at a
separate test database before running, so you don't wipe dev data.

## API Overview

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/jobs` | Public (match scores if logged in as seeker) |
| POST | `/api/jobs` | Employer |
| PUT/DELETE | `/api/jobs/:id` | Employer (owner) |
| POST | `/api/applications/:jobId` | Seeker |
| GET | `/api/applications/job/:jobId` | Employer (owner) |
| PATCH | `/api/applications/:id/status` | Employer (owner) |
| GET/PATCH | `/api/admin/*` | Admin |

## AI Match Score

`src/services/matchService.js` computes a 0–1 match score between a seeker's
profile and a job. Defaults to skill-overlap (Jaccard similarity) with no
external dependencies. Set `USE_EMBEDDINGS=true` and `OPENAI_API_KEY` in
`.env` to upgrade to semantic embedding-based matching.
