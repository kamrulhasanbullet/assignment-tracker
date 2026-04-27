# Assignment & Learning Analytics Platform
 
A full-stack web application built with **Next.js 15**, designed to bridge the gap between instruction and evaluation. Instructors can manage assignments, review student submissions with AI-assisted feedback, and visualize performance data through interactive charts. Students can browse assignments, submit their work, and track progress in real-time.
 
---
 
## Features
 
### Instructor
- **Assignment Management** — Create assignments with title, description, difficulty level (Beginner / Intermediate / Advanced), deadline, and marks
- **Review System** — View all student submissions, update status (Accepted / Pending / Needs Improvement), and write qualitative feedback
- **AI Assistance** — Auto-improve assignment descriptions and auto-generate feedback using Claude AI
- **Learning Analytics** — Interactive dashboard with pie charts, bar charts, and line charts showing submission trends and performance data
### Student
- **Assignment Portal** — Browse all available assignments with difficulty and deadline info
- **Submission System** — Submit work via URL with a descriptive note; resubmit anytime before deadline
- **Progress Tracking** — View submission history with real-time status and instructor feedback
---
 
## Tech Stack
 
| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | MongoDB (Mongoose) |
| Auth | NextAuth.js (JWT + Credentials) |
| Charts | Recharts |
