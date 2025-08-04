<?php

namespace Controllers;

use Services\UserService;
use Models\User;
use Models\VideoView;
use Utils\Helper;
use Utils\Enums\VideoViewStatus;
use Ramsey\Uuid\Uuid;

class UserController {
    private $userService;
    

    public function __construct() {
        $this->userService = new UserService();
    }


    public function getProfile($userId, $authHeader) {
        $user = Helper::requireUser($authHeader);
        try {
            if (!$user) return;
            return $this->userService->getProfile($userId);
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to get profile: ' . $e->getMessage()];
        }
    }

    
    public function updateProfile($userId, $data, $authHeader) {
        $user = Helper::requireUser($authHeader);
        try {
            if (!$user) return;
        return $this->userService->updateProfile($userId, $data);
    }catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to update profile: ' . $e->getMessage()];
        }
    }

    
    public function deactivateAccount($userId, $authHeader) {
        $user = Helper::requireUser($authHeader);
        try {
            if (!$user) return;
            return $this->userService->deactivateAccount($userId);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to deactivate account: ' . $e->getMessage()]);
        }
    }

    /**
     * Handle video playback request and track viewing
     * @param string $videoId The ID of the video to play
     * @param string $userId The ID of the user watching the video
     * @param string $authHeader JWT authentication token
     * @return array Response with video playback details
     */
    public function playVideo($videoId,$authHeader) {
        $user = Helper::requireUser($authHeader);
        if (!$user) return;

        try {
            // Create a new video view record
            $videoView = new VideoView(
                Uuid::uuid4()->toString(),
                $videoId,
                $userId = $user['id'], 
                new \DateTime(),
                VideoViewStatus::getDefault(), 
                $userId,
                $userId
            );

            // Start video playback and record view
            $result = $this->userService->startVideoPlayback($videoView);
            
            if ($result['status'] === 'error') {
                http_response_code(isset($result['code']) && $result['code'] === 'VIDEO_NOT_FOUND' ? 404 : 500);
                return $result;
            }

            http_response_code(200);
            return [
                'status' => 'success',
                'message' => 'Video playback started successfully',
                'data' => [
                    'video_view_id' => $videoView->getId(),
                ]
            ];

        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'code' => 'PLAYBACK_ERROR',
                'message' => 'Failed to start video playback: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }
    public function getWatchHistory($authHeader) {
        $user = \Utils\Helper::requireUser($authHeader);
        try {
            if (!$user) return;
            return $this->userService->getWatchHistory($user['id']);
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to retrieve watch history: ' . $e->getMessage()];
        }
    }
    public function getAllEvents($authHeader) {
        $user = Helper::requireUser($authHeader);
        try {
            if (!$user) return;
            return $this->userService->getAllEvents();
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Failed to retrieve events: ' . $e->getMessage()];
        }
    }
}