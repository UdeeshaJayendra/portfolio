# Getting Started — Your Setup (MongoDB Atlas)

You said you already have a MongoDB Atlas URI and want to keep the placeholder
data for now and edit it yourself later. Here's exactly what to do, in order.

## 1. Install dependencies
```bash
npm install
npm run install-all
```

## 2. Connect to your Atlas database
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and paste your real Atlas connection string into
`MONGODB_URI` (replace the whole placeholder line). Make sure:
- `<username>` and `<password>` are your real Atlas DB user credentials
  (not your Atlas login — a separate "Database User" you create under
  Database Access in Atlas).
- The database name `portfolio` stays right after `.net/` and before the `?`.
- In Atlas → Network Access, add your IP (or `0.0.0.0/0` temporarily for
  testing — tighten this before going live).

## 3. Generate a real JWT secret
Don't skip this — it's what keeps your admin login secure.
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output into `backend/.env` as `JWT_SECRET=...`

## 4. Seed the database (placeholder data for now)
```bash
npm run seed
```
This creates an admin account and fills the DB with sample projects/skills/etc.
Default admin login: `admin@portfolio.com` / `admin123`

**Before you go live, edit `backend/seed.js`** and replace every line marked
`// ← Change` with your real name, bio, projects, skills, experience,
education, and social links, then re-run `npm run seed`. Also change the
admin email/password there — don't ship the defaults.

## 5. Run it
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

Log in with the admin account (top-right "Sign In") to see the "+ Add
Project" button and confirm the auth system works end-to-end.

## 6. Before you submit this for your internship
- [ ] Replace all placeholder content in `backend/seed.js` with your real info
- [ ] Change the admin email/password in `seed.js`
- [ ] Re-run `npm run seed` after editing
- [ ] Double check `backend/.env` is NOT committed (`.gitignore` already
      excludes it — verify with `git status` before your first commit)
- [ ] Push to GitHub, deploy backend (Render/Railway) + frontend (Vercel/
      Render Static Site) — see the Deployment section in `README.md`
- [ ] Test the live "Download CV" and "Contact form" buttons on the deployed
      version, not just localhost

## Why this version (not the other one)
This is the auth-protected version: only you (the seeded admin) can add or
delete projects or edit your profile — visitors and registered users can only
view and download your CV. The other zip you had left the write API open to
anyone, which is a real security gap you don't want in a portfolio you're
using to apply for jobs.
