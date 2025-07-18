<?php
// services/VideoViewService.php

require_once __DIR__ . '/../models/Video_view.php';

class VideoViewService {
    private static $pdo = null;

    public function __construct() {
        if (self::$pdo === null) {
            require_once __DIR__ . '/../config/Database.php';
            self::$pdo = Database::getConnection();
        }
    }

    public function create(VideoView $videoView) {
        $id = $videoView->getId();
        $videoId = $videoView->getVideoId();
        $userId = $videoView->getUserId();
        $viewedAt = $videoView->getViewedAt()->format('Y-m-d H:i:s');
        $status = $videoView->getStatus()->value; // Use string value
        $createdBy = $videoView->getCreatedBy();
        $updatedBy = $videoView->getUpdatedBy();
        try {
            $stmt = self::$pdo->prepare("INSERT INTO video_views (id, video_id, user_id, viewed_at, status, created_by, updated_by) VALUES (:id, :video_id, :user_id, :viewed_at, :status, :created_by, :updated_by)");
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':video_id', $videoId);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':viewed_at', $viewedAt);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':created_by', $createdBy);
            $stmt->bindParam(':updated_by', $updatedBy);
            $result = $stmt->execute();
            if ($result && $stmt->rowCount() > 0) {
                return 'Video view saved';
            } else {
                throw new Exception('Video view could not be saved.');
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