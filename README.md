# GradeMaster

A modern, web-based grade management system that allows students to track classes, manage assignments, and calculate weighted GPA with real-time insights.

## Overview

GradeMaster is a full-stack web application designed for students to organize their coursework and understand their academic performance at a glance. The platform provides an intuitive interface for creating classes, defining grading sections, adding assignments, and visualizing weighted grades. It addresses the gap between traditional spreadsheets and dedicated educational platforms by offering a lightweight, responsive solution accessible from any device.

**Target Audience:** D211 Students seeking a centralized platform to track assignments, calculate grades, and visualize academic progress.

## Features

- **Class Management**: Create and organize multiple classes with custom names
- **Flexible Grading Sections**: Define weighted grading categories (exams, homework, projects, participation) with custom weights
- **Assignment Tracking**: Add assignments with letter grades and point values
- **Weighted Grade Calculation**: Automatically computes class grades based on section weights and assignment performance
- **Grade Analytics**: Visualize performance through charts and class summaries
- **User Authentication**: Secure sign-up and sign-in with profile management
- **Real-Time Synchronization**: Automatic syncing of grades to the database with debouncing
- **Persistent State**: Local storage with automatic syncing ensures data is never lost
- **Calculator Tool**: Quick grade calculator for "what-if" scenarios
- **Responsive Design**: Fully optimized for desktop and mobile devices

## Tech Stack

**Frontend:**

- Next.js 14 (App Router, SSR/SSG)
- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn/ui component library (Radix UI primitives)
- Zustand for state management
- React Hook Form with Zod validation
- Recharts for data visualization
- Lucide React for icons

**Backend:**

- Next.js API Routes
- Node.js runtime

**Database:**

- MongoDB for persistent data storage

**Authentication:**

- Firebase Auth (email/password, session management)
- Firestore for user profiles (firstName, lastName, graduationYear)

**Other Tools:**

- Sonner for toast notifications
- Date-fns for date manipulation
- React Query for data fetching (installed, ready for integration)
- ESLint for code quality

## Database / Data Design

GradeMaster uses MongoDB with a document-based architecture centered on user grade data. Below is the data model:

**Firestore Collection: users** (profile data)

- Document ID = Firebase Auth UID
- Fields: `firstName`, `lastName`, `graduationYear`, `email`

**MongoDB Collection: grades**

```
user (Firebase Auth)
┌──────────────────────────┐
│ uid (Firebase UID)       │
│ email                    │
│ profile in Firestore     │
│   firstName, lastName    │
│   graduationYear         │
└──────────────────────────┘
        ↓ userId (String)
┌──────────────────────────────────────────────────┐
│ grades (MongoDB Document)                        │
│ PK _id (ObjectId)                                │
│ userId: string                                   │
│ classes: Class[]                                 │
│   ├─ id: string                                  │
│   ├─ name: string                                │
│   └─ sections: Section[]                         │
│       ├─ id: string                              │
│       ├─ name: string                            │
│       ├─ weight: number (percentage)             │
│       └─ assignments: Assignment[]               │
│           ├─ id: string                          │
│           ├─ name: string                        │
│           ├─ letterGrade: string (A, B+, etc)    │
│           ├─ totalPoints: number                 │
│           └─ multiplier: number (optional)       │
└──────────────────────────────────────────────────┘
```

**Data Flow:**

1. User authenticates via Firebase Auth
2. Frontend Zustand store maintains local state (classes, sections, assignments)
3. Changes trigger a 300ms debounced sync to the backend
4. Next.js API route upserts the entire grade structure in MongoDB
5. On page reload, store fetches grades from MongoDB to restore state
6. State persists locally via Zustand middleware, reducing server calls

**Calculation Logic:**

- Each assignment is assigned a letter grade (A+, A, B+, etc.)
- Letter grades map to percentages (A+ = 100%, B = 70%, etc.)
- Section percentage = Weighted average of all assignments in that section
- Class percentage = Sum of (section percentage × section weight)

## System Architecture / How It Works

**Authentication Flow:**

1. User signs up/logs in via Firebase Auth; profile stored in Firestore
2. Session stored in browser (Firebase Auth persistence)
3. Protected routes check session validity via `getCurrentSession()`
4. Logout clears session and redirects to home

**Grade Management Flow:**

1. User navigates to dashboard
2. Zustand store hydrates from local storage (if available)
3. `fetchGrades()` loads persisted grades from MongoDB via `/api/grades`
4. User creates classes, sections, and adds assignments
5. Each action updates local state and triggers `syncGrades()`
6. `syncGrades()` debounces and sends updates to MongoDB
7. Grade calculations run in real-time on the client

**Key Architectural Decisions:**

- **Client-Side Calculations**: Grade calculations performed in the browser avoid server load and reduce latency
- **Debounced Sync**: 300ms debounce prevents excessive database writes during rapid user input
- **Hybrid Storage**: Local Zustand state + MongoDB persistence ensures offline-first UX with cloud backup
- **Upsert Strategy**: MongoDB upsert pattern eliminates need for separate insert/update logic
- **API Simplicity**: Single endpoint with method routing (`GET`/`POST`) keeps API minimal
- **TypeScript First**: Strong typing prevents runtime errors in grade calculations

## Installation & Setup

**Prerequisites:**

- Node.js 18+ and npm/yarn
- MongoDB instance (local or MongoDB Atlas)
- Firebase project (Auth + Firestore for profiles)

**Steps:**

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd GradeMaster
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

   ```
   # Firebase (client)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin (server: delete-user API). Use one of:
   # Option A: Path to service account JSON
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
   # Option B: Inline (e.g. for Vercel)
   # FIREBASE_ADMIN_PROJECT_ID=your_project_id
   # FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-...@....iam.gserviceaccount.com
   # FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000`

**Build for production:**

```bash
npm run build
npm start
```

## Usage

**Creating a Class:**

1. Sign in to the dashboard
2. Click "Add Class" button
3. Enter class name and confirm
4. Class appears on the dashboard

**Adding Grading Sections:**

1. Click on a class card
2. Click "Add Section"
3. Enter section name and weight (e.g., "Midterm" - 30%)
4. Total weights should sum to 100%

**Adding Assignments:**

1. Within a section, click "Add Assignment"
2. Enter assignment name, select letter grade, specify total points
3. Assignment automatically contributes to section average

**Viewing Grades:**

1. Dashboard displays overall class percentage
2. Class detail view shows section breakdowns with charts
3. Calculator tool allows "what-if" grade scenarios

**Calculator:**
Navigate to `/calculator` to quickly calculate final grades without creating a full class entry.

## Key Learnings

- **Zustand vs Redux**: Zustand's simplicity and persist middleware made state management significantly more maintainable than Redux for this use case
- **Debouncing Trade-offs**: 300ms debounce balances responsiveness with database efficiency, but UI feedback suffers with slow connections
- **Letter Grade Abstraction**: Storing letter grades instead of raw percentages improved user experience but added complexity in calculations
- **MongoDB Upsert Pattern**: Document-based upserts simplified the backend considerably compared to managing separate document operations
- **Client-Side Calculations**: Moving grade calculations to the client eliminated bottlenecks and enabled offline functionality
- **Radix UI + Tailwind**: Combining Radix UI primitives with Tailwind CSS provided excellent flexibility without sacrificing accessibility

## Future Improvements

- **Export to PDF**: Generate grade reports and transcripts
- **GPA Calculation**: Track cumulative GPA across multiple semesters
- **Grade Predictions**: "What-if" scenarios integrated throughout the app instead of just calculator
- **Collaboration**: Share classes with classmates or instructors for group projects
- **Mobile App**: React Native version for better mobile UX
- **Batch Operations**: Import/export grades via CSV
- **Notifications**: Alerts for low grades or upcoming assignment deadlines
- **Professor Sync**: Integration with LMS platforms (Canvas, Blackboard)
- **Analytics Dashboard**: Trend analysis, performance patterns, and study recommendations
- **Offline Support**: Service worker for full offline functionality
- **Multiplier Support**: Fully implement assignment multipliers for weighted assignments
- **Backup & Recovery**: Automated backups and recovery options

---

**Author:** Paritosh  
**License:** MIT
