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
        if (!$user) return;
        $id = Uuid::uuid4()->toString();
        $name = $data['name'] ;
        $description = $data['description'] ;
        $startDate = isset($data['start_date']) && $data['start_date'] ? new \DateTime($data['start_date']) : null;
        $endDate = isset($data['end_date']) && $data['end_date'] ? new \DateTime($data['end_date']) : null;
        $createdBy = $user['id'];
        $updatedBy = $user['id'];
        $videoId = $data ['video_id'];
        if (!$name) {
            http_response_code(400);
            return ['status' => 'error', 'message' => 'Event name is required.'];
        }
        $event = new Event($id, $name, $description, $startDate, $endDate, $createdBy, $updatedBy);
        return $this->eventService->create($event, $videoId);
    }
} 