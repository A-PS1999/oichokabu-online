# Oicho Kabu Online

## 🎴 ~~Visit the site: https://oichokabu-online.herokuapp.com/~~ Currently not hosted

### Description
An implementation of the traditional Japanese card game, oicho kabu (おいちょかぶ). After creating an account and logging in, users can create a game room with various settings (e.g. number of players, max number of rounds and bets). Users can join an open room and, using websockets, receive updates on page state in real time to play a full game of oicho kabu. Players' chip state is persisted.

### Technologies used
* **Frontend:** React 19, TypeScript, Redux Toolkit, react-router 7, SCSS, built with Vite
* **Backend:** Node.js, Express 5, TypeScript, Socket.io, Passport (local strategy)
* **Database:** PostgreSQL via Sequelize ORM (sessions stored with `connect-pg-simple`)
* **Testing:** Vitest, Testing Library, MSW

### Requirements
* Node.js 22 or newer (Vite 8 requires 20.19+ / 22.12+) and npm
* PostgreSQL
* Git
* **Windows users:** PowerShell blocks `npm.ps1`; use `npm.cmd` (e.g. `npm.cmd run dev`) or run commands from `cmd.exe`.

### Starting up the repo
1. Install Node.js, Git and PostgreSQL if you do not have them already.

2. Create a PostgreSQL database, noting its details.

3. Clone the repository and install its dependencies:
   ```
   git clone https://github.com/A-PS1999/oichokabu-online.git
   cd oichokabu-online
   npm install
   ```

4. Create a `.env.development` file in the repo root (this is the file the dev server and dev migrations load). A working example:
   ```
   SESSION_SECRET=change-me
   CORS_ORIGIN=http://localhost:3000
   NODEMAILER_EMAIL=you@example.com
   NODEMAILER_PASS=your-email-password
   PORT=5000
   DB_USER=postgres
   DB_PASS=postgres
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/oichokabu
   VITE_API_URL=http://localhost:5000
   ```
   Variables:
   * `DATABASE_URL` (required) - full address of the database
   * `SESSION_SECRET` (required) - secret string used for session hashing
   * `CORS_ORIGIN` (required) - address of the frontend
   * `DB_USER`, `DB_PASS` - database owner credentials (used by Sequelize CLI/config)
   * `NODEMAILER_EMAIL`, `NODEMAILER_PASS` - account used for Nodemailer emails
   * `PORT` - port the backend listens on (default `5000`)
   * `VITE_API_URL` - address of the backend, read by the frontend at build/dev time
   * Optional: `DB_HOST` (default `127.0.0.1`), `DB_NAME` (default `oichokabu`)

5. Run database migrations:
   ```
   npm run db:migrate
   ```
   (equivalently `npx sequelize-cli db:migrate`, which uses `.env.development` when `NODE_ENV` is unset)

6. Start the backend:
   ```
   npm run dev:server
   ```
   Production alternative: `npm run build:server` (compiles `server/` to `server/dist/`), then `npm run start:server`. Note `start:server` does not load an env file, so the variables above must already be present in the environment.

7. In a second terminal, start the frontend:
   ```
   npm run dev
   ```
   Vite serves on `http://localhost:3000` and proxies `/api` and `/socket.io` to the backend on `:5000`. Open `http://localhost:3000` in your browser.

### Other commands
* `npm run typecheck` - typecheck the frontend and backend
* `npm run test:run` - run the Vitest test suite once (`npm test` for watch mode)
* `npm run build` - build the SPA to `build/`

### Project layout
The repo is a single package with two halves plus shared wire types.

```
src/                          Frontend (React + Redux + Vite)
  components/                 Feature/UI components, each with colocated .test.tsx
    Game/                     In-game UI (board, cards, betting, results)
  store/                      Redux Toolkit slices, typed hooks, RootState
  services/                   Axios API clients and the Socket.io singleton
  hooks/                      useGame, useSocket, and other shared hooks
  sass/                       Global SCSS (abstracts, base)
  mocks/                      MSW handlers for tests
server/                       Backend (Express + Socket.io)
  index.ts                    Express app (static serving, CORS, session, routes)
  initServer.ts               Creates the HTTP server and attaches sockets
  routes/                     REST routes (/api), with middleware guards
  sockets/                    Socket.io setup + lobby/pregame/game handlers
  game_logic/                 Pure game state machine and step functions
  db/                         Sequelize models, migrations, queries (plain JS)
  types/                      Express/passport global augmentation
shared/                       Type-only .d.ts wire contracts (api, game, socket-events)
build/                        Vite production output (gitignored)
```

**Request flow:** users authenticate over REST, browse/create rooms in the lobby, ready up in a pre-game lobby, then play in a game room. Real-time state is pushed over Socket.io, with room membership held in memory (`gameSockets` / `preGameSockets` in `server/sockets/index.ts`). Game state lives only in memory and is discarded when the last socket in a room disconnects. Player/chip data is persisted in PostgreSQL.

**Shared types:** `shared/*.d.ts` are imported by both halves via the `@shared/*` alias (configured in `tsconfig.json`, `server/tsconfig.json`, and `vite.config.mjs`).

**Game logic:** pure, server-side TypeScript in `server/game_logic/`. `index.ts` is the state machine, phase transitions are validated against the table in `phases.ts`, and single-step operations live in `game_controls/`.

### Scope for future improvements

- Move static files to a CDN
- Single player/bot mode
- Leverage Redis for persisting game state and use the Socket.io Redis adapter with it to support scaling
- Dockerize the project

### Screenshots

![Home Page](assets/Screenshot_2026-09-12_220614.png?raw=true "Home Page")

![Rules Page](assets/Screenshot_2026-09-12_220656.png?raw=true "Rules Page")

![Pre-game Lobby](assets/Screenshot_2026-09-12_220837.png?raw=true "Pre-game Lobby")

![Game Screen](assets/Screenshot_2026-09-12_220943.png?raw=true "Game Screen")

### License
GPL-3.0 license