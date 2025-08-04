# EventStream

EventStream is a live event stream simulator for virtual experiences. Instead of true live streaming, it plays pre-uploaded videos on the cloud as simulated live events. Admins can upload videos, schedule them as events, and manage users, while viewers join events and watch video streams in real time. The platform provides cloud-based video playback, interactive features, and robust event management tools.

## Features

- HD video streaming 
- Event management: create, edit, delete, and schedule events
- Analytics dashboard for event insights
- Role-based authentication (admin, viewer)
- User management and profile features
- Secure authentication with JWT
- Responsive, elegant UI with Tailwind CSS

## Tech Stack

- **Frontend:** React, Vite, React Router, Tailwind CSS
- **Backend:** RESTful API 
- **Authentication:** JWT (JSON Web Tokens)

## Getting Started

### Prerequisites
- Node.js 
- npm 

### Installation
```bash


# Install dependencies
$ npm install
```


# Start the development server
$ npm run dev
```


### Environment Variables
Create a `.env` file in the root directory and set your backend API base URL:
```


## Project Structure
```
stream-studio-sim/
├── src/
│   ├── components/
│   │   ├── auth/         # Login, Register, ProtectedRoute
│   │   ├── admin/        # Admin dashboard, event/user/video management
│   │   ├── user/         # User dashboard, watch history
│   │   ├── layout/       # Dashboard layout, sidebar
│   │   ├── ui/           # Reusable UI components
│   ├── pages/            # Index, NotFound, ProfilePage
│   ├── hooks/            # useAuth, useToast
│   ├── lib/              # JWT/auth utilities
│   ├── assets/           # Images and static assets
│   ├── App.jsx           # Main app component
│   ├── main.tsx          # Entry point
├── public/               # Static files
├── package.json
├── README.md
├── ...
```

## Authentication & Roles

### User Roles & Capabilities

- **Admin:**
  - Upload videos that are stored the cloud
  - Create, schedule, and manage events using uploaded videos
  - Manage users and assign roles
  - View analytics dashboard for event insights

- **Viewer:**
  - Join and watch scheduled event streams (cloud video playback)
  - Manage personal profile and check his watch history



---

**EventStream** — Next-generation event platform for virtual experiences.
