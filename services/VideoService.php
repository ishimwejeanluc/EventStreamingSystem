<?php
// services/VideoService.php

require_once __DIR__ . '/../models/Video.php';

class VideoService {
    private static $pdo = null;

    public function __construct() {
        if (self::$pdo === null) {
            require_once __DIR__ . '/../config/Database.php';
            self::$pdo = Database::getConnection();
        }
    }

    public function create(Video $video) {
        $id = $video->getId();
        $title = $video->getTitle();
        $description = $video->getDescription();
        $filePath = $video->getFilePath();
        $thumbnailPath = $video->getThumbnailPath();
        $duration = $video->getDuration();
        $eventId = $video->getEventId();
        $uploadedBy = $video->getUploadedBy();
        $status = $video->getStatus()->value; // Use string value
        $createdBy = $video->getCreatedBy();
        $updatedBy = $video->getUpdatedBy();
        try {
            $stmt = self::$pdo->prepare("INSERT INTO videos (id, title, description, file_path, thumbnail_path, duration, event_id, uploaded_by, status, created_by, updated_by) VALUES (:id, :title, :description, :file_path, :thumbnail_path, :duration, :event_id, :uploaded_by, :status, :created_by, :updated_by)");
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':file_path', $filePath);
            $stmt->bindParam(':thumbnail_path', $thumbnailPath);
            $stmt->bindParam(':duration', $duration);
            $stmt->bindParam(':event_id', $eventId);
            $stmt->bindParam(':uploaded_by', $uploadedBy);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':created_by', $createdBy);
            $stmt->bindParam(':updated_by', $updatedBy);
            $result = $stmt->execute();
            if ($result && $stmt->rowCount() > 0) {
                return 'Video saved';
            } else {
                throw new Exception('Video could not be saved.');
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