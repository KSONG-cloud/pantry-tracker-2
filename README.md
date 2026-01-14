# Pantry Tracker 2

Pantry Tracker 2 is a small full-stack application for tracking pantry items. It uses a React + TypeScript + Vite frontend (`client/`) and a TypeScript Express backend (`server/`) with PostgreSQL for persistence.

This README documents how to set up the project, run the client and server in development, and build for production.

**Quick links**
- Client: [client](client)
- Server: [server](server)

**Stack**
- Frontend: React, TypeScript, Vite
- Backend: Node.js, TypeScript, Express
- Database: PostgreSQL (via `pg`)

## Prerequisites
- Node.js (v18+ recommended) and npm
- PostgreSQL (local or remote)

## Repository layout

- `client/` — React front-end (Vite)
    - `src/` — app source files
    - `package.json` — client scripts (`npm run dev`, `build`, etc.)
- `server/` — Express API written in TypeScript
    - `src/` — server source (routes, controllers, service, database)
    - `package.json` — server scripts (`npm run dev`, `build`, `start`)
- `shared/` — shared types

## Setup

1. Install dependencies for client and server:

```bash
# from repository root
cd client
npm install

cd ../server
npm install
```

2. Configure the server environment

Create a `.env` file in `server/` (or set environment variables) with database settings:

```env
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=your_db_host
DB_NAME=pantry_db
DB_PORT=5432
PORT=3001
```

3. Prepare your PostgreSQL database

Create the database and tables expected by the server. (Currently, this project does not include migration tooling; create tables manually or add migrations as needed.)

## Development

Start the server in dev mode (auto-reloads on source changes):

```bash
cd server
npm run dev
```

Start the client dev server (Vite, HMR):

```bash
cd client
npm run dev
```

Open the app in the browser (Vite will display the host/port, typically `http://localhost:5173`). The frontend talks to the backend API (default `http://localhost:3001`).

If you prefer a single terminal, open two panes and run the two commands above concurrently.

## Build & Production

Build the client and server for production:

```bash
# client
cd client
npm run build

# server (transpile TypeScript)
cd ../server
npm run build

# then run the compiled server
npm start
```

## API (selected endpoints)

- `GET /users/:id/pantry` — returns pantry items for a user (joined with food names)
- `GET /users/:id/food-groups` — returns the account's food groups

The server is implemented in `server/src` with a route/controller/service/repository layering:

- `server/src/route/route.ts` — route definitions
- `server/src/controller/controller.ts` — request handlers
- `server/src/service/food.service.ts` — business logic
- `server/src/database/food.repository.ts` — raw DB queries

## Notes & Tips

- The server reads DB configuration from environment variables (`DB_USER`, `DB_PASS`, `DB_HOST`, `DB_NAME`, `DB_PORT`).
- The server `dev` script uses `nodemon` + `ts-node` loader to run TypeScript with automatic reloads; if you prefer `ts-node-dev` you can change the script in `server/package.json`.
- The front-end uses Vite and supports HMR; edits to React components should update the UI without a full reload.
- To stage only parts of a file for commit in Git use `git add -p <file>` or in VS Code use the Source Control diff view and stage selected ranges.

## Contributing

If you want to add features or fix bugs:

1. Create an issue describing the change.
2. Create a feature branch.
3. Implement changes and run the dev servers to verify behavior.
4. Submit a pull request.

## License

See the `LICENSE` file in the repository root.

---
If you'd like, I can also:
- Add a `.env.example` file under `server/` with the expected variables, or
- Add a small SQL schema file for the initial tables. Which would you like next?
