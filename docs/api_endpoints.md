# API Documentation

## Admin Routes

### 1. Create Event
```http
POST /api/Admin/events
Authorization: Bearer {jwt_token}

Request Body:
{
    "title": "Summer Tech Conference 2025",
    "description": "Annual technology conference featuring latest innovations",
    "date": "2025-08-15",
    "location": "Virtual",
    "status": "SCHEDULED",
    "max_attendees": 1000
}

Response:
{
    "status": "success",
    "message": "Event created successfully",
    "data": {
        "event_id": "uuid-string",
        "title": "Summer Tech Conference 2025",
        "created_by": "admin-uuid"
    }
}
```

### 2. Upload Video
```http
POST /api/Admin/videos/upload
Authorization: Bearer {jwt_token}

Request Body:
{
    "title": "Introduction to AI",
    "description": "Learn the basics of Artificial Intelligence",
    "duration": "01:30:00",
    "event_id": "event-uuid",
    "status": "READY",
    "metadata": {
        "resolution": "1080p",
        "format": "MP4",
        "size": "1.2GB"
    }
}

Response:
{
    "status": "success",
    "message": "Video uploaded successfully",
    "data": {
        "video_id": "video-uuid",
        "title": "Introduction to AI",
        "created_by": "admin-uuid"
    }
}
```

## User Routes

### 1. Update Profile
```http
PUT /api/users/{userId}/profile
Authorization: Bearer {jwt_token}

Request Body:
{
    "username": "johndoe",
    "password": "newSecurePassword123",
    "email": "john.doe@example.com"
}

Response:
{
    "status": "success",
    "message": "Profile updated successfully",
    "data": {
        "username": "johndoe",
        "email": "john.doe@example.com",
        "updated_at": "2025-07-23T10:30:00Z"
    }
}
```

### 2. Play Video
```http
POST /api/videos/{videoId}/play
Authorization: Bearer {jwt_token}

Request Body:
{
    "start_time": "00:00:00",
    "quality": "1080p",
    "device_info": {
        "type": "web",
        "browser": "Chrome",
        "os": "MacOS"
    }
}

Response:
{
    "status": "success",
    "message": "Video playback started successfully",
    "data": {
        "video_view_id": "view-uuid",
        "stream_url": "https://stream.example.com/video/{videoId}",
        "start_time": "2025-07-23T10:35:00Z"
    }
}
```

## Authentication Headers
All endpoints require the following header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...
```

## Common Response Codes
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Notes
- All timestamps are in UTC
- IDs are UUID v4 format
- Responses always include a status and message field
- Success responses include a data object with relevant information
- Error responses include an error code and message
