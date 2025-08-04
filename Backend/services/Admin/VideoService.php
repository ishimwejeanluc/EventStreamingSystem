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
        try {
            $stmt = self::$pdo->prepare("SELECT * FROM videos WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $video = $stmt->fetch(\PDO::FETCH_ASSOC);
            if (!$video) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'Video not found'];
            }
            http_response_code(200);
            return ['status' => 'success', 'message' => 'Video retrieved', 'data' => $video];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()];
        }
    }

    public function update($id, $data, $adminId) {
        try {
            // Check if video is not archived before allowing updates
            $checkStmt = self::$pdo->prepare("SELECT status FROM videos WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();
            $video = $checkStmt->fetch(\PDO::FETCH_ASSOC);
            if (!$video) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'Video not found.'];
            }
            if ($video['status'] === VideoStatus::ARCHIVED->value) {
                http_response_code(400);
                return ['status' => 'error', 'message' => 'Cannot update an archived video.'];
            }
            $fields = [];
            $params = [':id' => $id];
            if (isset($data['title'])) {
                $fields[] = 'title = :title';
                $params[':title'] = $data['title'];
            }
            if (isset($data['description'])) {
                $fields[] = 'description = :description';
                $params[':description'] = $data['description'];
            }
            if (isset($data['status']) && VideoStatus::isValid($data['status'])) {
                $fields[] = 'status = :status';
                $params[':status'] = $data['status'];
            }   
            if(isset($data['file_path'])) {
                $fields[] = 'file_path = :file_path';
                $params[':file_path'] = $data['file_path'];
            }
            if (isset($data['thumbnail_path'])) {
                $fields[] = 'thumbnail_path = :thumbnail_path';
                $params[':thumbnail_path'] = $data['thumbnail_path'];
            }
            if (isset($data['duration'])) {
                $fields[] = 'duration = :duration';
                $params[':duration'] = $data['duration'];
            }

            // Always update the updated_by and updated_at fields
            $fields[] = 'updated_by = :updated_by';
            $fields[] = 'updated_at = NOW()';
            $params[':updated_by'] = $adminId;

            if (empty($fields)) {
                http_response_code(400);
                return ['status' => 'error', 'message' => 'No valid fields to update.'];
            }
            $sql = "UPDATE videos SET ".implode(', ', $fields)." WHERE id = :id";
            $stmt = self::$pdo->prepare($sql);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'Video not found or no changes made.'];
            }
            http_response_code(200);
            return ['status' => 'success', 'message' => 'Video updated'];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()];
        }
    }

    public function delete($id, $adminId) {
        try {
            $status = VideoStatus::ARCHIVED->value;
            $stmt = self::$pdo->prepare("UPDATE videos SET status = :status, updated_by = :updated_by WHERE id = :id");
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':updated_by', $adminId);
            $stmt->execute();
            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'Video not found.'];
            }
            http_response_code(200);
            return ['status' => 'success', 'message' => 'Video archived'];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()];
        }
    }

    public function getAll() {
        try {
            $statusArchived = VideoStatus::ARCHIVED->value;
            $stmt = self::$pdo->prepare("SELECT * FROM videos WHERE status != :archived");
            $stmt->bindParam(':archived', $statusArchived);
            $stmt->execute();
            $videos = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            http_response_code(200);
            return ['status' => 'success', 'message' => 'Videos retrieved', 'data' => $videos];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()];
        }
    }
} 