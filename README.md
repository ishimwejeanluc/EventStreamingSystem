


# Event Streaming System

Event Streaming System is a full-stack platform for hosting, streaming, and managing  simulated live video events. It combines a PHP backend and a React frontend for cloud-based video playback, robust event management, user authentication, and analytics.

---

## Features
- HD video streaming (Cloudinary)
- Event management: create, edit, delete, schedule
- Analytics dashboard for event insights
- Role-based authentication (admin, viewer)
- User management and profile features
- Secure authentication with JWT
- Watch history tracking
- Responsive, elegant UI with Tailwind CSS

---

## Tech Stack
- **Backend:** PHP 8+, MySQL, Composer, JWT, Cloudinary
- **Frontend:** React, Vite, React Router, Tailwind CSS

---

## Getting Started

### Backend
#### Prerequisites
- PHP 8.0 or higher
- MySQL 5.7 or higher
- Composer
- Apache/Nginx or PHP's built-in server

#### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ishimwejeanluc/EventStreamingSystem.git
   cd EventStreamingSystem
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Create a `.env` file in Backend directory and configure your database  credentials and JWT secret.
4. Set up the database:
   ```bash
   source Backend/database.sql
   ```

#### Running the Backend
```bash
php -S localhost:8080 -t Backend/public/api
```

---

### Frontend
#### Prerequisites
- Node.js
- npm

#### Installation
1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Frontend` directory and set your backend API base URL.
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Project Structure
```
EventStreamingSystem/
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── public/
│   ├── database.sql
│   └── README.md
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── public/
│   ├── package.json
│   └── README.md
├── README.md (this file)
└── ...
```

---

## Authentication & Roles

### User Roles & Capabilities
- **Admin:**
  - Upload videos to the cloud
  - Create, schedule, and manage events
  - Manage users and assign roles
  - View analytics dashboard
- **Viewer:**
  - Join and watch scheduled event streams
  - Manage personal profile and view watch history

---

## License
See the license information in the respective subproject folders.

---

For more details, see the [Backend/README.md](./Backend/README.md) and [Frontend/README.md](./Frontend/README.md).
