<?php
// services/VideoService.php
// This service handles video-related operations

namespace Services\Admin;

use Models\Video;
use Config\Database;
use Utils\Enums\VideoStatus;

class VideoService {
    private static $pdo = null;

    public function __construct() {
        if (self::$pdo === null) {
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
        $status = VideoStatus::getDefault()->value; 
        $createdBy = $video->getCreatedBy();
        try {
            $stmt = self::$pdo->prepare("INSERT INTO videos (id, title, description, file_path, thumbnail_path, duration,  status, created_by) VALUES (:id, :title, :description, :file_path, :thumbnail_path, :duration, :status, :created_by)");
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':file_path', $filePath);
            $stmt->bindParam(':thumbnail_path', $thumbnailPath);
            $stmt->bindParam(':duration', $duration);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':created_by', $createdBy);
            $result = $stmt->execute();
            if ($result && $stmt->rowCount() > 0) {
                return [
                    'status' => 'success',
                    'message' => 'Video saved',
                    'video_id' => $id
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Video could not be saved.'
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