<?php
// controllers/Admin/UserController.php
// This controller handles admin-only user management actions

namespace Controllers\Admin;

use Services\Admin\AdminUservice;
use Models\User;
use Utils\Enums\UserRole;
use Ramsey\Uuid\Uuid;

class UserController {
    private $adminUservice;

    public function __construct() {
        $this->adminUservice = new AdminUservice();
    }

    public function create($data, $authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        if (!$admin) return;
        if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            return [
                'status' => 'error',
                'message' => 'Username, email, and password are required.'
            ];
        }

        try {
            
            $user = new User(
                Uuid::uuid4()->toString(),  
                $data['username'],
                $data['email'],
                $data['password'],
                isset($data['role']) ? UserRole::from($data['role']) : UserRole::USER->getDefault(), 
                null,
                $admin['id']  /
            );

            
            return $this->adminUservice->create($user);

        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'message' => 'Failed to create user: ' . $e->getMessage()
            ];
        }
    }

    public function update($id, $data, $authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        if (!$admin) return;
        try {
            return $this->adminUservice->update($id, $data, $admin['id']);
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'message' => 'Failed to update user: ' . $e->getMessage()
            ];
        }
    }

    public function delete($id, $authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        if (!$admin) return;
        try {
            return $this->adminUservice->delete($id, $admin['id']);
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'message' => 'Failed to delete user: ' . $e->getMessage()
            ];
        }
    }

    public function getAllUsers($authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        if (!$admin) return;
        try {
            return $this->adminUservice->getAll();
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'message' => 'Failed to retrieve users: ' . $e->getMessage()
            ];
        }
    }

    
}
