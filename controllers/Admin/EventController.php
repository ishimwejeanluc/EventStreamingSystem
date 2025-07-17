<?php
// EventController.php
// This controller handles admin-only actions for events, enforcing JWT and admin role checks.

namespace Controllers\Admin;

use Services\Admin\EventService;
use Utils\Security;
use Utils\Enums\UserRole;
use Ramsey\Uuid;
use Utils\Enums\EventStatus;
use \Models\Event;

class EventController {
    private $eventService;

    public function __construct() {
        $this->eventService = new EventService();
    }

    private function requireAdmin($authHeader) {
        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Missing or invalid Authorization header.']);
            return null;
        }
        $token = substr($authHeader, 7);
        try {
            $payload = Security::verifyToken($token);
            // The token payload structure is: { iat, exp, data: { id, username, email, role } }
            $userData = $payload['data'] ?? null;
            if (!$userData || ($userData['role'] ?? null) !== UserRole::ADMIN->value) {
                http_response_code(403);
                echo json_encode(['status' => 'error', 'message' => 'Admin privileges required.']);
                return null;
            }
            return $userData;
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token.']);
            return null;
        }
    }

    public function createEvent(array $data, $authHeader) {
        $user = $this->requireAdmin($authHeader);
        if (!$user) return;
        $id = Uuid::uuid4()->toString();
        $name = $data['name'] ;
        $description = $data['description'] ;
        $startDate = $data['start_date'];
        $endDate = $data['end_date'];
        $createdBy = $user['id'];
        $updatedBy = $user['id'];
        if (!$name) {
            http_response_code(400);
            return ['status' => 'error', 'message' => 'Event name is required.'];
        }
        $event = new Event($id, $name, $description, $startDate, $endDate, $status, $createdBy, $updatedBy);
        return $this->eventService->create($event);
    }
} 