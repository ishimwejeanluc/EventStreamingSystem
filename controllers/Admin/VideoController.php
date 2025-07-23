<?php
// VideoController.php
// This controller handles admin-only actions for videos, enforcing JWT and admin role checks.

namespace Controllers\Admin;

use Services\Admin\VideoService;
use Utils\Helper;
use Utils\Enums\UserRole;
use Ramsey\Uuid\Uuid;
use Utils\Enums\VideoStatus;
use Models\Video;

class VideoController {
    private $videoService;

    public function __construct() {
        $this->videoService = new VideoService();
    }

    

    public function createVideo(array $data, $authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        if (!$admin) return;
        try {
            $id = Uuid::uuid4()->toString();
            $title = $data['title'] ;
            $filePath = $data['file_path'] ;
            $description = $data['description'];
            $thumbnailPath = $data['thumbnail_path'] ;
            $duration =  (int)$data['duration'] ;
           $createdBy = $admin['id'];
        if (!$title || !$filePath) {
            http_response_code(400);
            return ['status' => 'error', 'message' => 'Video title and file_path are required.'];
        }
        $video = new Video($id, $title, $filePath, $description, $thumbnailPath, $duration,null, $createdBy,null);
        return $this->videoService->create($video);
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to create video: ' . $e->getMessage()];
        }
    }

    public function getVideo($id, $authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        try {
            if (!$admin) return;
            return $this->videoService->getById($id);
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to retrieve video: ' . $e->getMessage()];
        }
    }

    public function updateVideo($id, $data, $authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        try {
            if (!$admin) return;
            return $this->videoService->update($id, $data, $admin['id']);
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to update video: ' . $e->getMessage()];
        }
    }

    public function deleteVideo($id, $authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        try {
            if (!$admin) return;
            return $this->videoService->delete($id, $admin['id']);
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to delete video: ' . $e->getMessage()];
        }
    }

    public function getAllVideos($authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        try {
            if (!$admin) return;
            return $this->videoService->getAll();
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to retrieve videos: ' . $e->getMessage()];
        }
    }
} 