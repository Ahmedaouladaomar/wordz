# Wordz

Wordz is a full-stack vocabulary learning app that combines a mobile client and a backend API. The mobile experience is built with Expo and React Native, while the backend is powered by NestJS, TypeORM, and PostgreSQL.

## What this project includes

- A mobile app for learning, practicing, and reviewing vocabulary
- User authentication, profile handling, and protected user flows
- Vocabulary and practice features such as word cards, practice sessions, and personalized data
- A backend API for auth, persistence, and application logic

## Repository structure

- mobile/: Expo + React Native client app
- backend/: NestJS API server and services

## Tech stack

### Mobile

- Expo Router
- React Native + TypeScript
- Tamagui for UI
- Zustand for state management
- React Query for API data
- Expo Secure Store and Google Sign-In support

### Backend

- NestJS
- TypeORM
- PostgreSQL
- Passport + JWT authentication
- Validation and environment-based configuration

## Prerequisites

Make sure you have the following installed:

- Node.js and npm
- Expo CLI (or use the local Expo setup via npx)
- A running PostgreSQL database

## Quick start

### 1) Install dependencies

From the repository root, run:

```bash
cd mobile && npm install
cd ../backend && npm install
```

### 2) Configure the backend environment

Copy the example environment file and update it with your local values:

```bash
cd backend
cp .example.env .env.development
```

Update the database, JWT, Google OAuth, and email settings in the created .env.development file before starting the backend.

### 3) Run database migrations

If your database is ready, run:

```bash
npm run migration:run
```

### 4) Start the backend

```bash
npm run start:dev
```

The backend should start on the configured port (default is usually 3000).

### 5) Start the mobile app

Open a new terminal and run:

```bash
cd mobile
npx expo start
```

From there you can open the app on:

- an iOS simulator
- an Android emulator
- Expo Go on your device
- the web preview

### Optional: run the mobile app directly on native targets

```bash
cd mobile
npm run android
# or
npm run ios
```

## Useful development commands

### Backend

```bash
cd backend
npm run test
npm run lint
npm run build
```

### Mobile

```bash
cd mobile
npm run lint
```

## Development notes

- The mobile app uses Expo Router-based navigation and lives under the mobile folder.
- The backend is organized as a modular NestJS application under the backend folder.
- For a smooth local workflow, keep the backend running while developing the mobile client.
