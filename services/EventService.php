<?php
// services/EventService.php

require_once __DIR__ . '/../models/Event.php';

class EventService {
    private static $pdo = null;

    public function __construct() {
        if (self::$pdo === null) {
            require_once __DIR__ . '/../config/Database.php';
            self::$pdo = Database::getConnection();
        }
    }

    public function create(Event $event) {
        $id = $event->getId();
        $name = $event->getName();
        $description = $event->getDescription();
        $startDate = $event->getStartDate() ? $event->getStartDate()->format('Y-m-d H:i:s') : null;
        $endDate = $event->getEndDate() ? $event->getEndDate()->format('Y-m-d H:i:s') : null;
        $status = $event->getStatus()->value; // Use string value
        $createdBy = $event->getCreatedBy();
        $updatedBy = $event->getUpdatedBy();
        try {
            $stmt = self::$pdo->prepare("INSERT INTO events (id, name, description, start_date, end_date, status, created_by, updated_by) VALUES (:id, :name, :description, :start_date, :end_date, :status, :created_by, :updated_by)");
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':start_date', $startDate);
            $stmt->bindParam(':end_date', $endDate);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':created_by', $createdBy);
            $stmt->bindParam(':updated_by', $updatedBy);
            $result = $stmt->execute();
            if ($result && $stmt->rowCount() > 0) {
                return 'Event saved';
            } else {
                throw new Exception('Event could not be saved.');
            }
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
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