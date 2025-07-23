
# Event Streaming System

A PHP-based event streaming system with video management, user authentication, and analytics.

## Prerequisites

- PHP 8.0 or higher
- MySQL 5.7 or higher
- Composer
- Apache/Nginx or PHP's built-in development server

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ishimwejeanluc/EventStreamingSystem.git
cd EventStreamingSystem
```

2. Install dependencies:
```bash
composer install
```

3. Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_NAME=event_streaming
DB_USER=your_db_user
DB_PASS=your_db_password
JWT_SECRET=your_jwt_secret_key
```

4. Set up the database:
```bash
# Login to MySQL
mysql -u root -p

# Then run the SQL script
source database.sql
```

## Running the Application

### Using PHP's Built-in Development Server

1. Navigate to the project root:
```bash
cd /path/to/EventStreamingSystem
```

2. Start the PHP development server:
```bash
php -S localhost:8080 -t public/api
```

3. The API will be available at:
```
http://localhost:8080
```

### Using Apache/Nginx

Configure your web server to point to the `public/api` directory as the document root.

## Features

- User Authentication (JWT-based)
- Role-based Access Control (Admin/User)
- Event Management
- Video Management
- User Profile Management
- Statistics and Analytics
- Secure Password Handling
- Input Validation and Sanitization

## API Routes Overview

### Authentication
- `POST /api/Auth/register` - Register new user
- `POST /api/Auth/register/admin` - Register admin (protected)
- `POST /api/Auth/login` - User login

### Admin Routes
- `POST /api/Admin/events` - Create event
- `GET /api/Admin/events/{id}` - Get event details
- `PUT /api/Admin/events/{id}` - Update event
- `DELETE /api/Admin/events/{id}` - Delete event
- `POST /api/Admin/videos/upload` - Upload video
- `GET /api/Admin/statistics/dashboard` - View analytics

### User Routes
- `GET /api/users/{id}/profile` - Get user profile
- `PUT /api/users/{id}/profile` - Update profile
- `POST /api/users/play/{videoId}` - Play video

## Development Notes

1. Enable error reporting in development:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

2. Test API endpoints using Postman or cURL:
```bash
# Example: Login
curl -X POST http://localhost:8080/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

3. All protected routes require Bearer token:
```http
Authorization: Bearer your_jwt_token
```

## Note
This project includes proper error handling, input validation, and secure password handling. For production use, additional security measures should be implemented.