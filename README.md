# ScholarSphere 🎓

> **AI-Powered Scholarship Discovery & Alumni Mentorship Marketplace**  
> University Final Year Project (FYP) Supervisor Demonstration System

---

## 🌟 Overview
**ScholarSphere** bridges the gap between ambitious students from developing nations (Pakistan, India, Nigeria, Egypt, Bangladesh, etc.) and successful alumni mentors who hold prestigious international scholarships (DAAD, Chevening, Fulbright, Erasmus Mundus, etc.).

### Key Highlights
- **LinkedIn-Inspired UI Architecture**: Fixed top navigation bar, 3-column feed dashboard (Profile summary, central recommendations feed, suggested mentors & closing soon alerts), and dedicated LinkedIn-style mentor profile pages.
- **Rule-Based AI Recommendation Engine**: Evaluates and scores scholarships from 0 to 100% against academic profiles (Field +30, Country +25, GPA +20, Degree Level +15, Full Funding +10) with human-readable match justifications.
- **First Live Call 100% Free**: An automated backend-enforced business rule where any student's initial 1:1 live strategy call with a mentor is free ($0.00) without payment; subsequent calls with that same mentor require payment.
- **Simulated Fake Checkout Flow**: Clean, realistic checkout experience with auto-formatting, 1.5s animated spinner, checkmark confirmation, and clear **"Demo Mode"** badges.
- **Pre-Populated Marketplace**: Seeded with **60 diverse students**, **50 verified mentors**, **40 international scholarships** across 10 countries, active reviews, pre-scheduled sessions, and notifications.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Router v6, Axios
- **Backend**: Node.js, Express REST API, CORS, JSON Web Tokens (JWT), Bcrypt.js
- **Database & ORM**: SQLite (file-based `dev.db`, zero setup required), Prisma ORM
- **Visuals**: Deterministic DiceBear SVG Avatars, Plus Jakarta Sans typography

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended, verified on v24.x)
- npm (v10+ recommended)

---

### 1. Backend Setup & Run

Open a terminal and run:

```bash
cd backend
npm install
npx prisma db push
npm run seed
npm run dev
```
> The backend server will run on **`http://localhost:5000`**.  
> The SQLite database will be initialized and seeded with all 110+ profiles and 40 scholarships.

---

### 2. Frontend Setup & Run

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```
> The frontend application will run on **`http://localhost:3000`**.

---

## ⚡ Vercel Deployment

ScholarSphere is pre-configured for seamless 1-click deployment on **Vercel** as a fullstack application (Express Serverless API + React Vite SPA).

### Quick Deployment Steps:
1. Import this repository into **[Vercel](https://vercel.com/new)**.
2. Vercel automatically detects the root configuration (`vercel.json` and `api/index.js`).
3. Set the following **Environment Variables** in Vercel Project Settings:
   - `DATABASE_URL`: Connection string for PostgreSQL database (e.g. Supabase, Neon, Railway, or Render Postgres).
   - `JWT_SECRET`: Secret string for signing auth tokens (e.g., `your_secure_jwt_secret`).
   - `FRONTEND_URL` (optional): Allowed CORS origin URL.
4. Click **Deploy**. Vercel will build both the frontend assets and backend serverless endpoints automatically!

---

## 🔑 Demo Login Credentials

On the **Sign In page (`/login`)**, click on the **"Try Demo Accounts"** helper box to log in with 1 click without typing.

| Account Type | Name | Email | Password | Profile Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | Ahmed Khan | `student.ahmed@demo.com` | `Demo1234` | CS @ FAST-NUCES, GPA 3.6, Prefers Germany/Canada. Has 1 completed session with Sara + 1 upcoming paid session. |
| **Student** | Dr. Fatima Zahra | `student.fatima@demo.com` | `Demo1234` | Medicine @ KEMU, GPA 3.9, Prefers UK (Chevening). Has 1 upcoming free call with Hassan. |
| **Student** | Ali Raza | `student.ali@demo.com` | `Demo1234` | Business @ IBA, GPA 3.1, Budget-conscious. **0 sessions booked** (ideal for testing the 1st Free Live Call flow). |
| **Mentor** | Sara Chen | `mentor.sara@demo.com` | `Demo1234` | DAAD Scholar @ TU Berlin. Services: SOP Review ($35), Visa Guidance ($25), Application Audit ($45). |
| **Mentor** | Hassan Tariq | `mentor.hassan@demo.com` | `Demo1234` | Chevening Scholar @ LSE. Services: Interview Prep ($30), SOP Review ($40). |

---

## 🧪 Supervisor Meeting Demonstration Script

### Flow 1: Transparent AI Scholarship Scoring
1. Log in as **Ahmed Khan** (`student.ahmed@demo.com`).
2. Notice the **AI Recommendation Feed** in the center column.
3. Observe the top match: **"DAAD Postgraduate Scholarships in STEM"** with **100% Match**.
4. Read the breakdown: *Matches field of CS (+30) • Preferred country: Germany (+25) • GPA 3.60 meets 3.40 (+20) • Graduate match (+15) • Fully funded (+10)*.

### Flow 2: Live Profile Edit & Dynamic Score Recalculation
1. Click **"Edit Profile"** in the left sidebar or top banner.
2. Change **Field of Study** from *Computer Science* to *Business*, set **GPA** to *3.0*, and change preferred countries to *Turkey*.
3. Click **"Save Profile Changes"**.
4. Return to the feed: observe that the top recommended scholarship has dynamically switched to **"Türkiye Bursları Government Full Scholarship"** with a recalculated 100% match score!

### Flow 3: Live Session Booking (First Free vs Second Paid)
1. Sign in as **Ali Raza** (`student.ali@demo.com`) who has zero previous sessions.
2. Navigate to **Mentors** (`/mentors`) and choose **Sara Chen** or **Hassan Tariq**.
3. On the mentor profile, view the **"Book a 1:1 Live Strategy Call"** card.
4. Note the green badge: **"1st Session FREE ($0.00)"**.
5. Pick a date/time and click **"Book Free Session Now"** -> instantly confirmed with zero payment required!
6. Try booking a **second live session** with that **same mentor**:
   - The system dynamically detects an existing session.
   - The badge updates to **Standard Rate ($25.00)**.
   - Clicking book now opens the **Fake Checkout Modal**.
   - Review dummy card inputs and click **"Authorize & Pay $25.00"** -> 1.5s simulated spinner -> checkmark animation -> confirmed as paid.

### Flow 4: Async Mentor Service Booking
1. On any mentor's profile, scroll to **"Mentorship Services Offered"**.
2. Click **"Book This Service"** (e.g. SOP Review for $35).
3. Complete the mock checkout.
4. You are redirected to **Services (`/bookings`)** where the booking is recorded with status **"confirmed"** and payment status **"paid"**.

### Flow 5: Video Call Simulator
1. Navigate to **Live Calls (`/live-sessions`)**.
2. Click **"Join Call"** on any upcoming session.
3. An interactive video call room modal displays camera/mic controls and the supervisor demo note: *"This would launch the video call in the full version — demo only."*

### Flow 6: Mentor Dashboard View
1. Log in as **Sara Chen** (`mentor.sara@demo.com`).
2. Navigate to `/mentor-dashboard`.
3. Review incoming live calls, student async booking requests, student ratings, and catalog services.
4. Click **"Add / Edit Notes"** on any live session to leave debrief feedback for the student.

---

## 🗂️ Project Structure

```
ScholarSphere/
├── README.md
├── backend/
│   ├── package.json
│   ├── .env
│   ├── dev.db                      # SQLite database file
│   ├── prisma/
│   │   ├── schema.prisma           # 11 data models
│   │   └── seed.js                 # 110+ users, 40 scholarships, sessions, reviews
│   └── src/
│       ├── server.js               # Express API entry point
│       ├── db.js                   # Prisma Client
│       ├── middleware/auth.js      # JWT authentication & roles
│       ├── utils/
│       │   └── recommendationEngine.js # 0-100 scoring algorithm
│       └── routes/
│           ├── auth.js             # Signup, login, me
│           ├── scholarships.js     # Catalog, recommendations, save
│           ├── mentors.js          # Directory, profile, live eligibility
│           ├── bookings.js         # Async services
│           ├── liveSessions.js     # Live calls & 1st session free logic
│           ├── payments.js         # Fake mock checkout
│           ├── notifications.js    # In-app notifications
│           ├── students.js         # Profile management
│           └── stats.js            # Marketplace statistics
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.jsx                 # Routes & protected routes
        ├── index.css               # Tailwind & styles
        ├── context/AuthContext.jsx # User session & token state
        ├── services/api.js         # Axios interceptor
        ├── utils/avatar.js         # Deterministic DiceBear avatars
        ├── components/
        │   ├── Navbar.jsx          # LinkedIn top navigation & notifications
        │   ├── LeftProfileCard.jsx # LinkedIn left profile column
        │   ├── RightSuggestedCard.jsx # Suggested mentors & closing soon
        │   ├── Layout.jsx          # 3-column LinkedIn container
        │   ├── ScholarshipCard.jsx # Match badges & breakdown
        │   ├── MentorCard.jsx      # Marketplace mentor cards
        │   ├── FakeCheckoutModal.jsx # Simulated payment drawer
        │   └── JoinCallModal.jsx   # Video call simulator
        └── pages/
            ├── LandingPage.jsx
            ├── LoginPage.jsx
            ├── SignupPage.jsx
            ├── RecommendationsFeed.jsx
            ├── BrowseScholarshipsPage.jsx
            ├── ScholarshipDetailPage.jsx
            ├── MentorMarketplacePage.jsx
            ├── MentorProfilePage.jsx
            ├── LiveSessionsPage.jsx
            ├── MyBookingsPage.jsx
            ├── SavedScholarshipsPage.jsx
            ├── StudentProfilePage.jsx
            ├── MentorDashboardPage.jsx
            └── NotificationsPage.jsx
```

---

## 🛡️ Demo Mode Disclaimer
*ScholarSphere is a demonstration prototype developed for academic evaluation. All payments are simulated with zero actual financial transactions, and video calls are simulated via UI state modals.*
