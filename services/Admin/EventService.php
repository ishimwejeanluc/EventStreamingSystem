<?php
// services/EventService.php
// This service handles event-related operations

namespace Services\Admin;

use Models\Event;
use Config\Database;
use Utils\Enums\EventStatus;
use Services\Admin\VideoService ;

class EventService {
    private static $pdo = null;
    

    public function __construct() {
        if (self::$pdo === null) {
            self::$pdo = Database::getConnection();
        }
    }

    public function create(Event $event, ?string $videoId = null) {
        $id = $event->getId();
        $name = $event->getName();
        $description = $event->getDescription();
        $startDate = $event->getStartDate();
        $endDate = $event->getEndDate();
        $status = EventStatus::getDefault()->value; // Use string value
        $createdBy = $event->getCreatedBy();
        $updatedBy = $event->getUpdatedBy();
        try {
            $stmt = self::$pdo->prepare("INSERT INTO events (id, name, description, start_date, end_date, status, created_by, updated_by) VALUES (:id, :name, :description, :start_date, :end_date, :status, :created_by, :updated_by)");
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':description', $description);
            $startDateStr = $startDate ? $startDate->format('Y-m-d H:i:s') : null;
            $endDateStr = $endDate ? $endDate->format('Y-m-d H:i:s') : null;

            $stmt->bindParam(':start_date', $startDateStr);
            $stmt->bindParam(':end_date', $endDateStr);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':created_by', $createdBy);
            $stmt->bindParam(':updated_by', $updatedBy);
            $result = $stmt->execute();
            if ($result && $stmt->rowCount() > 0) {
                // If videoId is provided, update the video to link to this event
                if ($videoId) {
                    $updateStmt = self::$pdo->prepare("UPDATE videos SET event_id = :event_id WHERE id = :video_id");
                    $updateStmt->bindParam(':event_id', $id);
                    $updateStmt->bindParam(':video_id', $videoId);
                    $updateStmt->execute();
                }
                return [
                    'status' => 'success',
                    'message' => 'Event created',
                    'event_id' => $id
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Event could not be saved.'
                ];
            }
        } catch (\PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage()
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Server error: ' . $e->getMessage()
            ];
        }
    }

    public function getById($id) {
        try {
            $stmt = self::$pdo->prepare("SELECT * FROM events WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $event = $stmt->fetch(\PDO::FETCH_ASSOC);
            if (!$event) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'Event not found', 'data' => null];
            }
            http_response_code(200);
            return ['status' => 'success', 'message' => 'Event retrieved', 'data' => $event];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage(), 'data' => null];
        }
    }

    public function update($id, $data) {
        try {
            // Check if event is not cancelled before allowing updates
            $checkStmt = self::$pdo->prepare("SELECT status FROM events WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();
            $event = $checkStmt->fetch(\PDO::FETCH_ASSOC);
            if (!$event) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'Event not found.', 'data' => null];
            }
            if ($event['status'] === EventStatus::CANCELLED->value) {
                http_response_code(400);
                return ['status' => 'error', 'message' => 'Cannot update a cancelled event.', 'data' => null];
            }
            $fields = [];
            $params = [':id' => $id];
            if (isset($data['name'])) {
                $fields[] = 'name = :name';
                $params[':name'] = $data['name'];
            }
            if (isset($data['description'])) {
                $fields[] = 'description = :description';
                $params[':description'] = $data['description'];
            }
            if (isset($data['status']) && EventStatus::isValid($data['status'])) {
                $fields[] = 'status = :status';
                $params[':status'] = $data['status'];
            }
            if (empty($fields)) {
                http_response_code(400);
                return ['status' => 'error', 'message' => 'No valid fields to update.', 'data' => null];
            }
            $sql = "UPDATE events SET ".implode(', ', $fields)." WHERE id = :id";
            $stmt = self::$pdo->prepare($sql);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'Event not found or no changes made.', 'data' => null];
            }
            http_response_code(200);
            return ['status' => 'success', 'message' => 'Event updated', 'data' => null];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage(), 'data' => null];
        }
    }

    public function delete($id) {
        try {
            $status = EventStatus::CANCELLED->value;
            $stmt = self::$pdo->prepare("UPDATE events SET status = :status WHERE id = :id");
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'Event not found.', 'data' => null];
            }
            http_response_code(200);
            return ['status' => 'success', 'message' => 'Event cancelled', 'data' => null];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage(), 'data' => null];
        }
    }

    public function getAll() {
        try {
            $statusCancelled = EventStatus::CANCELLED->value;
            $stmt = self::$pdo->prepare("SELECT * FROM events WHERE status != :cancelled");
            $stmt->bindParam(':cancelled', $statusCancelled);
            $stmt->execute();
            $events = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            http_response_code(200);
            return ['status' => 'success', 'message' => 'Events retrieved', 'data' => $events];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage(), 'data' => null];
        }
    }
} 