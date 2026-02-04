# Vercel Deployment Guide - CuentaCasos

This guide outlines the steps to deploy your Nuxt + Better-Auth + Turso application to Vercel.

## 1. Prepare your Turso Database

Since you are currently using `local.db`, you need a cloud database for Vercel:

1. Go to [Turso](https://turso.tech/) and create a new database.
2. Get your **Database URL** and **Auth Token**.
3. Run the schema push command against your remote Turso database:
   ```bash
   TURSO_DATABASE_URL=libsql://your-db-url TURSO_AUTH_TOKEN=your-token npm run db:push
   ```
   > [!IMPORTANT]
   > Ensure you replace the placeholders with your actual Turso credentials. This step creates the necessary tables (user, session, verification, etc.) in the cloud.

## 2. GitHub Configuration

Ensure your code is pushed to your GitHub repository.

1. Go to your **GitHub Developer Settings** -> **OAuth Apps**.
2. Update the **Homepage URL** to your Vercel URL (e.g., `https://cuenta-casos.vercel.app`).
3. Update the **Authorization callback URL** to: `https://your-app.vercel.app/api/auth/callback/github`.

## 3. Vercel Project Setup

1. Log in to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. In the **Environment Variables** section, add the following:

| Key                    | Value                                                          |
| :--------------------- | :------------------------------------------------------------- |
| `TURSO_DATABASE_URL`   | Your Turso DB URL (`libsql://...`)                             |
| `TURSO_AUTH_TOKEN`     | Your Turso Token                                               |
| `BETTER_AUTH_SECRET`   | Generate a random string (e.g., via `openssl rand -base64 32`) |
| `BETTER_AUTH_URL`      | `https://your-app.vercel.app`                                  |
| `GITHUB_CLIENT_ID`     | Your GitHub Client ID                                          |
| `GITHUB_CLIENT_SECRET` | Your GitHub Client Secret                                      |

4. Click **Deploy**.

## 4. Final Verification

- Once deployed, visit your Vercel URL.
- Test the GitHub Login.
- Create a counter to verify the Turso connection.

> [!IMPORTANT]
> If you change your Vercel domain later, remember to update `BETTER_AUTH_URL` and the GitHub Callback URL.
