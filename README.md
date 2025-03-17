# Anthony Rovira - Portfolio Backend

A modern, secure, and scalable backend API built with Hono.js, TypeScript, and Firebase.

## Features

- 🔒 Secure API endpoints with rate limiting
- 📧 Email notifications using Resend
- 💾 Firebase Firestore database
- 🚀 TypeScript for type safety
- 🛡️ Security headers and CORS protection
- 📝 Input validation with Zod
- 🧹 Clean Architecture principles

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Firebase project
- Resend account
- Upstash Redis account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Security
API_SECRET=your_secure_secret_here

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_email@domain.com

# Redis Configuration (Upstash)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# CORS Configuration
ALLOWED_ORIGIN=http://localhost:3000
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/anthonyrovira_backend.git
cd anthonyrovira_backend
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Contact Form

- `POST /api/messages`
  - Rate limited: 5 requests per hour
  - Validates input data
  - Sends email notification
  - Stores message in Firebase

### Admin

- `GET /api/messages`
  - Retrieves all messages (protected)

## Project Structure

```
src/
├── config/           # Configuration files
├── features/         # Feature modules
│   └── messages/     # Message feature
├── shared/          # Shared utilities
│   ├── middleware/  # Custom middleware
│   └── errors/      # Error handling
└── index.ts         # Application entry point
```

## Security Features

- Rate limiting on API endpoints
- Security headers (XSS, CSRF, etc.)
- CORS protection
- Input validation
- Error handling
- Type safety with TypeScript

## Development

The project uses:

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Hono.js for the web framework

## License

MIT
