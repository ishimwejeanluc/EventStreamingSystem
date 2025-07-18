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
        // Implement read logic
    }

    public function update($id, $data) {
        // Implement update logic
    }

    public function delete($id) {
        // Implement delete logic
    }
} 