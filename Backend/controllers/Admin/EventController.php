<?php
// EventController.php
// This controller handles admin-only actions for events, enforcing JWT and admin role checks.

namespace Controllers\Admin;

use Services\Admin\EventService;
use Utils\Helper;
use Utils\Enums\UserRole;
use Utils\Enums\EventStatus;
use \Models\Event;
use Ramsey\Uuid\Uuid;


class EventController {
    private $eventService;

    public function __construct() {
        $this->eventService = new EventService();
    }

    

    public function createEvent(array $data, $authHeader) {
        $user = Helper::requireAdmin($authHeader);
        try {
            if (!$user) return;
            $id = Uuid::uuid4()->toString();
            $name = $data['name'] ;
            $description = $data['description'] ;
            $startDate = isset($data['start_date']) && $data['start_date'] ? new \DateTime($data['start_date']) : null;
            $endDate = isset($data['end_date']) && $data['end_date'] ? new \DateTime($data['end_date']) : null;
            $createdBy = $user['id'];
        $videoId = $data ['video_id'];
        if (!$name) {
            http_response_code(400);
            return ['status' => 'error', 'message' => 'Event name is required.'];
            }
        $event = new Event($id, $name, $description, $startDate, $endDate, $createdBy);
        return $this->eventService->create($event, $videoId);
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to create event: ' . $e->getMessage()];
        }
    }

    public function getEvent($id, $authHeader) {
        $user = Helper::requireAdmin($authHeader);
        if (!$user) return;
        try {
            return $this->eventService->getById($id);
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to retrieve event: ' . $e->getMessage()];
        }
    }

    public function updateEvent($id, $data, $authHeader) {
        $user = Helper::requireAdmin($authHeader);
        try {
            if (!$user) return;
            return $this->eventService->update($id, $data, $user['id']);
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to update event: ' . $e->getMessage()];
        }
    }

    public function deleteEvent($id, $authHeader) {
        $user = Helper::requireAdmin($authHeader);
        if (!$user) return;
        try{
            return $this->eventService->delete($id, $user['id']);
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to delete event: ' . $e->getMessage()];
        }
    }

    public function getAllEvents($authHeader) {
        $user = Helper::requireAdmin($authHeader);
        try {
            if (!$user) return;
            return $this->eventService->getAll();
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'message' => 'Failed to retrieve events: ' . $e->getMessage()
            ];
        }
    }
} 