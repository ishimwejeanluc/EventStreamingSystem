<?php
// services/UserService.php
// This service handles regular user operations (self-service)

namespace Services;

use Models\User;
use Config\Database;
use Utils\Enums\UserStatus;
use Utils\Enums\VideoStatus;
use Utils\Enums\VideoViewStatus;
use Utils\Security;
use Models\VideoView;

class UserService {
    private static $pdo = null;

    public function __construct() {
        if (self::$pdo === null) {
            self::$pdo = Database::getConnection();
        }
    }

    
    public function updateProfile($userId, $data) {
        try {
            // Check if user exists and is active
            $checkStmt = self::$pdo->prepare("SELECT status FROM users WHERE id = :id");
            $checkStmt->bindParam(':id', $userId);
            $checkStmt->execute();
            
            $user = $checkStmt->fetch(\PDO::FETCH_ASSOC);
            if (!$user) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'User not found.'];
            }
            if ($user['status'] !== UserStatus::ACTIVE->value) {
                http_response_code(400);
                return ['status' => 'error', 'message' => 'Account is not active.'];
            }

            // Users can only update specific fields
            $fields = [];
            $params = [':id' => $userId];
            
            if (isset($data['username'])) {
                $fields[] = 'username = :username';
                $params[':username'] = $data['username'];
            }
            if (isset($data['password'])) {
                $fields[] = 'password_hash = :password';
                $params[':password'] = Security::hashPassword($data['password']);
            }
            
            if (empty($fields)) {
                http_response_code(400);
                return ['status' => 'error', 'message' => 'No valid fields to update.'];
            }
            
            // Always update the updated_by and updated_at fields
            $fields[] = 'updated_by = :updated_by';
            $fields[] = 'updated_at = NOW()';
            $params[':updated_by'] = $userId;  // User is updating their own profile
            
            $sql = "UPDATE users SET ".implode(', ', $fields)." WHERE id = :id";
            $stmt = self::$pdo->prepare($sql);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'user not found or no changes made.'];
            }
            http_response_code(200);
            return ['status' => 'success', 'message' => 'user updated'];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()];
        }
    }

    

   
    public function deactivateAccount($userId) {
        try {
            $stmt = self::$pdo->prepare("UPDATE users SET 
                status = :new_status,
                updated_by = :updated_by,
                updated_at = NOW()
                WHERE id = :id AND status = :current_status");
            
            $stmt->execute([
                ':id' => $userId,
                ':new_status' => UserStatus::INACTIVE->value,
                ':current_status' => UserStatus::ACTIVE->value,
                ':updated_by' => $userId  // User is deactivating their own account
            ]);

            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'Account not found or already inactive.'];
            }

            return ['status' => 'success', 'message' => 'Account deactivated'];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()];
        }
    }

   
    public function getProfile($userId) {
        try {
            $stmt = self::$pdo->prepare("SELECT id, username, email 
                FROM users WHERE id = :id AND status != :inactive");
            
            $stmt->execute([
                ':id' => $userId,
                ':inactive' => UserStatus::INACTIVE->value
            ]);

            $user = $stmt->fetch(\PDO::FETCH_ASSOC);
            if (!$user) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'User not found'];
            }

            

            return ['status' => 'success', 'message' => 'Profile retrieved', 'data' => $user];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()];
        }
    }


    public function startVideoPlayback(VideoView $videoView) {
        try {
            // Insert video view record
            $stmt = self::$pdo->prepare("
                INSERT INTO video_views (
                    id, video_id, user_id, viewed_at, 
                    status
                ) VALUES (
                    :id, :video_id, :user_id, NOW(),
                    :status
                )
            ");

            $stmt->execute([
                ':id' => $videoView->getId(),
                ':video_id' => $videoView->getVideoId(),
                ':user_id' => $videoView->getUserId(),
                ':status' => VideoViewStatus::VALID->value,
               
            ]);
            return [
                'status' => 'success',
                'message' => 'Video playback started',
                'data' => [
                    'video_view_id' => $videoView->getId(),
                    'video_id' => $videoView->getVideoId()
                ]
            ];
        } catch (\PDOException $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'code' => 'PLAYBACK_ERROR',
                'message' => 'Database error: ' . $e->getMessage(),
            
            ];
        
    }
    }
} 