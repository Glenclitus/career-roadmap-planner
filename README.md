# Career Roadmap Planner

> **Web Technology IA3 Project — 23CS2048**  
> A full-stack MERN application that helps engineering students plan their tech careers with structured, stage-by-stage learning roadmaps.

---

## Project Overview

Career Roadmap Planner lets students browse career paths (Software Developer, Data Scientist, Full-Stack Developer, and more), follow ordered learning stages, mark tasks as completed, and track their personal progress — all backed by a real MongoDB database and a secure REST API.

---

## Features

| Feature | Role |
|---------|------|
| Register & Login (JWT, HttpOnly cookie) | All |
| Role-based navigation (Admin / User) | All |
| Change password | All |
| Admin Dashboard with live statistics | Admin |
| Career Roadmap CRUD | Admin |
| User Management (create, update, delete) | Admin |
| Explore & search career roadmaps | User |
| View roadmap stages, tasks, resources | User |
| Mark tasks complete (progress persisted per user) | User |
| My Progress overview | User |
| Responsive sidebar + mobile navbar | All |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), React Router, Bootstrap 5, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | bcryptjs, JSON Web Tokens, HttpOnly cookies |
| Security | Helmet, CORS, express-validator |

---

## Architecture Overview

```
Browser (React — :5173)
       │  Axios + credentials:include
       ▼
Express Server (:5000)
       │  JWT from HttpOnly cookie → authenticate middleware
       │  role check → authorize middleware
       ▼
Mongoose ODM
       ▼
MongoDB (localhost:27017 or Atlas)
```

---

## Folder Structure

```
career-roadmap-planner/
├── client/                    # React + Vite frontend
│   └── src/
│       ├── components/        # Layout, common, roadmap components
│       ├── context/           # AuthContext (React Context)
│       ├── hooks/             # useAuth hook
│       ├── layouts/           # PublicLayout, AdminLayout, UserLayout
│       ├── pages/             # public/, admin/, user/ pages
│       ├── services/api.js    # Axios instance
│       └── utils/             # validators, formatters
│
└── server/                    # Node.js + Express backend
    ├── scripts/               # seedAdmin.js, seedRoadmaps.js
    └── src/
        ├── config/db.js       # Mongoose connection
        ├── controllers/       # Auth, Roadmap, User, Progress, Dashboard
        ├── middleware/        # authenticate, authorize, errorHandler
        ├── models/            # User, CareerRoadmap, UserProgress
        ├── routes/            # authRoutes, roadmapRoutes, etc.
        └── validators/        # express-validator chains
```

---

## Database Schema Summary

**User** — name, email, passwordHash (select:false), role (admin|user), timestamps  
**CareerRoadmap** — title, slug, description, category, difficulty, estimatedDuration, prerequisites, skills, learningStages[], projectSuggestions[], createdBy → User  
**UserProgress** — userId → User, roadmapId → CareerRoadmap, completedTaskIds[], timestamps (unique index on userId+roadmapId)

---

## API Endpoint Summary

| Method | Path | Auth | Role |
|--------|------|------|------|
| POST | /api/auth/register | — | — |
| POST | /api/auth/login | — | — |
| POST | /api/auth/logout | ✓ | any |
| GET | /api/auth/me | ✓ | any |
| PATCH | /api/auth/change-password | ✓ | any |
| GET | /api/roadmaps | ✓ | any |
| GET | /api/roadmaps/:id | ✓ | any |
| POST | /api/roadmaps | ✓ | admin |
| PUT | /api/roadmaps/:id | ✓ | admin |
| DELETE | /api/roadmaps/:id | ✓ | admin |
| GET | /api/users | ✓ | admin |
| POST | /api/users | ✓ | admin |
| GET/PUT/DELETE | /api/users/:id | ✓ | admin |
| GET | /api/progress | ✓ | user |
| GET/PUT | /api/progress/:roadmapId | ✓ | user |
| GET | /api/dashboard/stats | ✓ | admin |
| GET | /api/dashboard/activity | ✓ | admin |

---

## Prerequisites

- Node.js v18+ (tested on v26)
- npm v8+
- MongoDB Community Edition **or** a MongoDB Atlas account

---

## Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/career-roadmap-planner.git
cd career-roadmap-planner

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

---

## Environment Setup

### Local MongoDB
1. Install MongoDB Community: https://www.mongodb.com/try/download/community
2. Start the service: `mongod` (or it starts automatically as a service)

### MongoDB Atlas (cloud)
1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user and whitelist your IP
3. Copy the connection string (replace `<password>` with your password)

### Configure .env
```bash
# In the server/ folder, copy .env.example and fill in values:
cp .env.example .env
```

Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/career_roadmap_planner   # or Atlas URI
JWT_SECRET=any_long_random_string_change_this
CLIENT_URL=http://localhost:5173
NODE_ENV=development

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=Admin@123456
```

> **Important:** Use a strong, unique JWT_SECRET and ADMIN_PASSWORD in production.

---

## How to Run

### Backend (Terminal 1)
```bash
cd server
npm run dev        # starts nodemon on port 5000
```

### Frontend (Terminal 2)
```bash
cd client
npm run dev        # starts Vite on port 5173
```

Open http://localhost:5173 in your browser.

---

## How to Seed Data

### 1. Create the admin account
```bash
cd server
npm run seed:admin
```
This reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`. Safe to re-run.

### 2. Seed sample career roadmaps
```bash
npm run seed:roadmaps
```
Creates 7 realistic roadmaps (Software Developer, Data Scientist, Full-Stack Developer, Cybersecurity Analyst, Cloud Engineer, Data Analyst, AI/ML Engineer). Safe to re-run — skips existing slugs.

---

## How to Create the Initial Admin

The admin is created exclusively via the seed script (see above). Public registration **always** creates a normal user account — the role cannot be set from the browser.

---

## Example Screenshots

_(Add screenshots here after running the app)_

- Landing page
- Login / Register
- Admin Dashboard
- Roadmap Management
- Roadmap Create/Edit form
- User Management
- User Dashboard
- Roadmap Detail with task checkboxes
- My Progress

---

## Known Limitations & Future Enhancements

- Email verification not implemented (future: SendGrid/Nodemailer)
- Password reset via email not implemented
- No file upload for roadmap images
- Progress is task-level; stage-level notes are not yet supported
- No real-time collaboration or notifications

---

## IA3 Report Outline

1. **Introduction** — problem statement, objectives, scope
2. **Literature Review** — similar platforms (Roadmap.sh, Coursera), gaps addressed
3. **System Design** — ER diagram, use case diagram, system architecture
4. **Technology Stack** — justification for MERN, Bootstrap, JWT
5. **Database Design** — schema for User, CareerRoadmap, UserProgress with indexes
6. **Backend Implementation** — REST API design, middleware chain, authentication flow
7. **Frontend Implementation** — component hierarchy, routing, state management
8. **Security Measures** — HttpOnly cookies, bcrypt, helmet, role guards, input validation
9. **Testing** — describe each test scenario from Section 13 and its result
10. **Challenges & Solutions** — issues encountered and how they were resolved
11. **Screenshots** — annotated screenshots of all major pages
12. **Conclusion** — what was achieved, limitations, future work
13. **References** — MongoDB docs, Express docs, React docs, etc.

---

*Course: Web Technology · Code: 23CS2048 · Type: Individual Full-Stack Project*
