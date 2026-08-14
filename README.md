# 🚀 MERN Stack Portfolio — with Auth System

A professional developer portfolio with **role-based authentication**.

---

## 🔐 Auth System Overview

| Feature | Admin (you) | Registered User | Visitor |
|---------|-------------|-----------------|---------|
| View portfolio | ✅ | ✅ | ✅ |
| Download CV | ✅ | ✅ | ✅ |
| Contact form | ✅ | ✅ | ✅ |
| Add project | ✅ | ❌ | ❌ |
| Delete project | ✅ | ❌ | ❌ |
| Edit profile | ✅ | ❌ | ❌ |
| Register account | ✅ | ✅ | ✅ |

---

## ⚡ Quick Start

### 1. Install MongoDB (Windows)
Download from https://www.mongodb.com/try/download/community
- Choose MSI installer
- Check "Install as a Service" during setup
- Then run: `net start MongoDB`

### 2. Install dependencies
```cmd
npm install
npm run install-all
```

### 3. Setup environment
```cmd
copy backend\.env.example backend\.env
```
Edit `backend/.env` — at minimum set a strong `JWT_SECRET`.

### 4. Seed database (creates admin account + sample data)
```cmd
npm run seed
```
Default admin: `admin@portfolio.com` / `admin123`
⚠️ Change these in `backend/seed.js` before running!

### 5. Generate a secure JWT secret
```cmd
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Paste the output into `backend/.env` as `JWT_SECRET=...`

### 6. Start the app
```cmd
npm run dev
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/api/health

---

## 📁 Project Structure

```
portfolio/
├── backend/
│   ├── middleware/
│   │   └── auth.js          ← JWT verification + role check
│   ├── models/
│   │   ├── User.js          ← User schema (admin/user roles)
│   │   ├── Profile.js       ← Your personal info
│   │   ├── Project.js       ← Portfolio projects
│   │   ├── Skill.js         ← Technical skills
│   │   ├── Experience.js    ← Work experience
│   │   ├── Education.js     ← Academic history
│   │   └── Certification.js ← Certifications
│   ├── routes/
│   │   ├── auth.js          ← POST /login, /register, GET /me
│   │   ├── profile.js       ← GET (public) POST (admin)
│   │   ├── projects.js      ← GET (public) POST/PUT/DELETE (admin)
│   │   └── ...              ← Same pattern for all resources
│   ├── server.js            ← Express app + MongoDB connection
│   ├── seed.js              ← Populate DB with your data
│   └── .env.example
│
└── frontend/src/
    ├── context/
    │   └── AuthContext.js   ← Global auth state (useAuth hook)
    ├── components/
    │   ├── Navbar.js        ← Shows admin controls if isAdmin
    │   ├── AuthModal.js     ← Login + Register tabs
    │   ├── Projects.js      ← Delete button only for admin
    │   ├── AddProjectModal.js ← Admin: add project form
    │   └── ...              ← All other sections
    ├── api.js               ← Axios with JWT interceptor
    └── App.js               ← Root component, fetches all data
```

---

## 🔑 How to Add a New Project

**Via UI (Admin):** Click "+ Add Project" in the navbar after logging in as admin.

**Via API:**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"New Project","description":"What it does","techStack":["React"]}'
```

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | None | Create user account |
| POST | /api/auth/login | None | Login, get JWT token |
| GET | /api/auth/me | User | Get current user |
| GET | /api/profile | None | Get your profile |
| POST | /api/profile | Admin | Update profile |
| GET | /api/projects | None | List all projects |
| POST | /api/projects | Admin | Create project |
| PUT | /api/projects/:id | Admin | Update project |
| DELETE | /api/projects/:id | Admin | Delete project |

---

## 🚀 Deployment (Render.com — Free)

1. Push to GitHub
2. Create a free MongoDB Atlas cluster → copy the connection string
3. Deploy backend on Render: set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`
4. Deploy frontend on Render (Static Site): set `REACT_APP_API_URL`

---

## 🛠️ Customise Your Data

Edit `backend/seed.js` with your real info, then:
```cmd
npm run seed
```
