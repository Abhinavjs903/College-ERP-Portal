# College ERP — Backend API

Express + MongoDB backend providing JWT-based authentication for the College ERP Portal.

## Requirements

- Node.js 18+
- MongoDB (local or hosted) for running the server

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then edit values
```

Environment variables (`.env`):

| Variable         | Description                          | Example                                  |
| ---------------- | ------------------------------------ | ---------------------------------------- |
| `PORT`           | Server port                          | `5000`                                   |
| `MONGO_URI`      | MongoDB connection string            | `mongodb://localhost:27017/college-erp`  |
| `JWT_SECRET`     | Secret used to sign tokens           | a long random string                     |
| `JWT_EXPIRES_IN` | Token lifetime                       | `1d`                                     |

## Run

```bash
npm run dev     # development (nodemon)
npm start       # production
```

## Test

```bash
npm test
```

Tests use an in-memory MongoDB (`mongodb-memory-server`) — no running database required.

## API

| Method | Endpoint             | Auth   | Body                          | Description                  |
| ------ | -------------------- | ------ | ----------------------------- | ---------------------------- |
| GET    | `/api/health`        | —      | —                             | Health check                 |
| POST   | `/api/auth/register` | —      | `{ name, email, password, role? }` | Create a user, return token  |
| POST   | `/api/auth/login`    | —      | `{ email, password }`         | Authenticate, return token   |
| GET    | `/api/auth/me`       | Bearer | —                             | Current authenticated user   |

Protected routes expect an `Authorization: Bearer <token>` header. Missing,
malformed, or expired tokens are rejected with `401`.

### Example

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@college.edu","password":"secret123"}'

# Access a protected route
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token-from-login>"
```
