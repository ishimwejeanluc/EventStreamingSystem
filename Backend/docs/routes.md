# API Routes Documentation

## Authentication Routes

### 1. Register User
```http
POST /api/Auth/register

Request Body:
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
}

Response:
{
    "status": "success",
    "message": "User saved",
    "user_id": "uuid-string"
}
```

### 2. Register Admin
```http
POST /api/Auth/register/admin
Authorization: Bearer {admin_token}

Request Body:
{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "secureAdminPass123"
}

Response:
{
    "status": "success",
    "message": "Admin account created successfully",
    "user_id": "uuid-string"
}
```

### 3. Login
```http
POST /api/Auth/login

Request Body:
{
    "email": "user@example.com",
    "password": "userPassword123"
}

Response:
{
    "status": "success",
    "message": "Login successful",
    "token": "jwt_token_string"
}
```

## Admin Routes

### Event Management

#### 1. Create Event
```http
POST /api/Admin/events
Authorization: Bearer {jwt_token}

Request Body:
{
    "title": "Tech Summit 2025",
    "description": "Annual Technology Summit",
    "date": "2025-08-15",
    "location": "Virtual",
    "status": "SCHEDULED"
}
```

#### 2. Get Event
```http
GET /api/Admin/events/{eventId}
Authorization: Bearer {jwt_token}

Response:
{
    "status": "success",
    "data": {
        "id": "event-uuid",
        "title": "Tech Summit 2025",
        "description": "Annual Technology Summit",
        "date": "2025-08-15",
        "status": "SCHEDULED"
    }
}
```

#### 3. Update Event
```http
PUT /api/Admin/events/{eventId}
Authorization: Bearer {jwt_token}

Request Body:
{
    "title": "Updated Title",
    "status": "IN_PROGRESS"
}
```

#### 4. Delete Event
```http
DELETE /api/Admin/events/{eventId}
Authorization: Bearer {jwt_token}
```

#### 5. List All Events
```http
GET /api/Admin/events
Authorization: Bearer {jwt_token}
```

### Video Management

#### 1. Upload Video
```http
POST /api/Admin/videos/upload
Authorization: Bearer {jwt_token}

Request Body:
{
    "title": "Session Recording",
    "description": "Recording of tech session",
    "event_id": "event-uuid",
    "duration": "01:30:00"
}
```

#### 2. Get Video
```http
GET /api/Admin/videos/{videoId}
Authorization: Bearer {jwt_token}
```

#### 3. Update Video
```http
PUT /api/Admin/videos/{videoId}
Authorization: Bearer {jwt_token}

Request Body:
{
    "title": "Updated Title",
    "status": "PUBLISHED"
}
```

#### 4. Delete Video
```http
DELETE /api/Admin/videos/{videoId}
Authorization: Bearer {jwt_token}
```

#### 5. List All Videos
```http
GET /api/Admin/videos
Authorization: Bearer {jwt_token}
```

### Statistics

#### 1. View Statistics
```http
GET /api/Admin/statistics/views
Authorization: Bearer {jwt_token}

Response:
{
    "status": "success",
    "data": {
        "total_views": 1000,
        "unique_viewers": 500,
        "average_watch_time": "00:15:30"
    }
}
```

#### 2. User Statistics
```http
GET /api/Admin/statistics/users
Authorization: Bearer {jwt_token}
```

#### 3. Event Statistics
```http
GET /api/Admin/statistics/events
Authorization: Bearer {jwt_token}
```

#### 4. Dashboard Statistics
```http
GET /api/Admin/statistics/dashboard
Authorization: Bearer {jwt_token}
```

## User Routes

### Profile Management

#### 1. Get Profile
```http
GET /api/users/{userId}/profile
Authorization: Bearer {jwt_token}

Response:
{
    "status": "success",
    "data": {
        "username": "johndoe",
        "email": "john@example.com",
        "created_at": "2025-07-01T10:00:00Z"
    }
}
```

#### 2. Update Profile
```http
PUT /api/users/{userId}/profile
Authorization: Bearer {jwt_token}

Request Body:
{
    "username": "johndoe_updated",
    "password": "newPassword123"
}
```

#### 3. Deactivate Account
```http
POST /api/users/{userId}/deactivate
Authorization: Bearer {jwt_token}
```

### Video Interaction

#### 1. Play Video
```http
POST /api/videos/{videoId}/play
Authorization: Bearer {jwt_token}

Request Body:
{
    "quality": "1080p",
    "device_info": {
        "type": "web",
        "browser": "Chrome"
    }
}

Response:
{
    "status": "success",
    "data": {
        "video_view_id": "view-uuid",
        "stream_url": "https://stream.example.com/video/{videoId}"
    }
}
```

## Response Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Headers
All authenticated endpoints require:
```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
```
