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
        $user = Helper::requireAdmin($authHeader);
        if (!$user) return;
        $id = Uuid::uuid4()->toString();
        $title = $data['title'] ;
        $filePath = $data['file_path'] ;
        $description = $data['description'];
        $thumbnailPath = $data['thumbnail_path'] ;
        $duration =  (int)$data['duration'] ;
        $createdBy = $user['id'];
        $updatedBy = $user['id'];
        if (!$title || !$filePath) {
            http_response_code(400);
            return ['status' => 'error', 'message' => 'Video title and file_path are required.'];
        }
        $video = new Video($id, $title, $filePath, $description, $thumbnailPath, $duration, $createdBy, $updatedBy);
        return $this->videoService->create($video);
    }
} 