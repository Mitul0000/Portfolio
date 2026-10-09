# Digifello

REST API for a developer portfolio platform: user accounts with email OTP verification, a blog with comments, a free/paid tools showcase, and a custom tool request system.

Built with **Node.js, Express 5, MongoDB (Mongoose)** and **Nodemailer** (Gmail SMTP).

## Features

- **Authentication**: register, email OTP verification, login, logout, forgot/reset password
- **Token security**: short-lived access tokens, rotating refresh tokens with reuse (theft) detection and a security alert email
- **Blogs**: list and read posts, with a view counter
- **Comments**: public reading, logged-in users can post
- **Tools**: separate endpoints for free and paid tools
- **Tool requests**: logged-in users submit a custom tool request (with budget); the admin is notified by email

## Requirements

- Node.js 18 or newer
- A MongoDB database (local or MongoDB Atlas)
- A Gmail account with an **App Password** (for sending emails)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env        # then fill in the values (see below)

# 3. Run
npm run dev                 # development (auto-restart with nodemon)
npm start                   # production
```

The server runs on `http://localhost:3000` by default.

## Environment variables

| Variable | Description |
|---|---|
| `PORT` | Port to listen on (default `3000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for access tokens |
| `REFRESH_SECRET` | Secret for refresh tokens |
| `FORGOT_SECRET` | Secret for password reset tokens |
| `EMAIL_USER` | Gmail address used to send emails |
| `EMAIL_PASS` | Gmail **App Password** (not your normal password) |
| `ADMIN_EMAIL` | Receives "New Tool Requested" notifications |
| `APP_NAME` | Sender name and name shown in email templates |
| `FRONTEND_URL` | Frontend base URL, used in reset links (no trailing slash) |

Use three different long random strings for the secrets. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

To create a Gmail App Password: Google Account, Security, turn on 2-Step Verification, then App passwords.

## Project structure

```
.
├── app.js                 # Express app and server start
├── config/db.js           # MongoDB connection
├── controller/            # Request handlers
├── middleware/isAuth.js   # JWT access-token check
├── models/                # Mongoose schemas
├── router/                # Route definitions
└── utils/
    ├── generateTokens.js  # Access + refresh token creation
    ├── sendMail.js        # Nodemailer wrapper
    └── emailTemplates/    # HTML emails (OTP, reset, alert, tool request)
```

## API reference

Base URL: `http://localhost:3000/api`

Routes marked 🔒 need the header `Authorization: Bearer <accessToken>`.

### Auth: `/auth`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/register` | `firstName, lastName, email, password, confirmPassword, terms` | Create an account. Returns `userId` |
| POST | `/generate-otp` | `userId` | Email a 6-digit OTP (valid 10 minutes) |
| POST | `/verify-otp` | `userId, otpReceiver` | Verify the email address |
| POST | `/login` | `email, password` | Returns `userId` and `token: { accessToken, refreshToken }`. Email must be verified |
| POST | `/refresh` | `refreshToken` | Returns a new access and refresh token |
| POST | `/logout` 🔒 | none | Revokes the user's refresh tokens |
| POST | `/forgot-password` | `email` | Email a reset link (valid 5 minutes) |
| POST | `/reset-password/:id/:token` | `New_password, Confirm_password` | Set a new password |

**Password rules:** at least 8 characters, with a lowercase letter, an uppercase letter and a special character.

### Blogs: `/blog`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/get-all` | List blogs (title, thumbnail, tag, views, createdAt) |
| GET | `/get/:blogId` | Full blog; increases its view count |

### Comments: `/comment`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/get/:blogId` | none | Comments for a blog, with author name |
| POST | `/post` 🔒 | `blogId, content` | Add a comment (author is the logged-in user) |

### Tools: `/tools`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/free-tools` | All tools of type `FREE` |
| GET | `/paid-tools` | All tools of type `PAID` |

### Tool requests: `/request`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/tool-request` 🔒 | `name, email, toolDescription, budget` | Submit a request; the admin is emailed |
| GET | `/get-requests` 🔒 | none | The logged-in user's own requests and their status |

Request status is `PENDING`, `APPROVED` or `REJECTED`, with an `adminMessage` field.

### Response format

Most responses look like this:

```json
{ "success": true, "message": "..." }
```

Errors use `success: false` with a `message` (or an `errors` array for validation failures).

## How authentication works

1. Register, then verify the email with an OTP.
2. Login returns an **access token** (15 minutes) and a **refresh token** (7 days).
3. Send the access token in the `Authorization` header.
4. When it expires, call `/auth/refresh` with the refresh token. Each refresh issues a **new** refresh token, and the old one stops working.
5. If an old refresh token is used again, the server treats it as theft, revokes all tokens for that user, returns `419` and emails a security alert.

Refresh tokens are stored hashed (SHA-256), not in plain text.

## Data models

| Model | Main fields |
|---|---|
| `User` | firstName, lastName, email (unique), password (hashed), isVerified |
| `OTP` | userId, hashed otp, auto-deleted after 10 minutes |
| `TokenFamily` | userId, currentToken (hash), tokenFamily (hash history), auto-deleted after 7 days |
| `Blog` | title, content, thumbnail, tag, views |
| `Comment` | blogId, userId, content |
| `Tools` | name, shortDescription, thumbnail, tag, type (`FREE` / `PAID`), link |
| `ToolRequest` | createdBy, name, email, toolDescription, budget, status, adminMessage |
| `Service` | name, shortDescription, longDescription, thumbnail, tag, link (model only, not used yet) |

## Adding content

There is no admin API yet. Add blogs and tools directly in MongoDB (Compass, `mongosh` or Atlas), and change a tool request's `status` and `adminMessage` there too.

Example blog document:

```json
{
  "title": "My first post",
  "content": "Post body...",
  "thumbnail": "https://example.com/image.jpg",
  "tag": "AI"
}
```

## Deployment checklist

- Set all environment variables on your host (see the table above), with `FRONTEND_URL` as your real frontend address.
- Use MongoDB Atlas, with an IP allowlist and backups.
- Run with `npm start`.
- Serve over HTTPS.
- Restrict CORS to your frontend domain (currently open to all origins in `app.js`).
- Do not commit `.env`. Rotate any secret that was ever committed.

## Known limitations

- No admin endpoints: managing blogs, tools and request approvals is manual.
- `Service` and `Consultancy` files are empty placeholders; the services section is handled by the frontend.
- No rate limiting yet on login, OTP and password reset.
- Gmail SMTP has a daily sending limit. For high volume, use a provider such as Resend, SendGrid or Brevo.
- Debug `console.log` statements in the refresh flow print tokens; remove them in production.

## License

ISC