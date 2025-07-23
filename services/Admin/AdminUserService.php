<?php
// services/Admin/UserService.php
// This service handles admin-only user management operations

namespace Services\Admin;

use Models\User;
use Config\Database;
use Utils\Enums\UserRole;
use Utils\Enums\UserStatus;
use Utils\Security;
use Ramsey\Uuid\Uuid;




class UserService {
    private static $pdo = null;

    public function __construct() {
        if (self::$pdo === null) {
            self::$pdo = Database::getConnection();
        }
    }

   
    public function create(User $userObj) {
        try {
            // Hash the password from the user object
            $hashedPassword = Security::hashPassword($userObj->getPassword());
            
            $stmt = self::$pdo->prepare("INSERT INTO users (id, username, email, password_hash, role, status, created_by) 
                VALUES (:id, :username, :email, :password, :role, :status, :created_by)");

            $stmt->execute([
                ':id' => $userObj->getId(),
                ':username' => $userObj->getUsername(),
                ':email' => $userObj->getEmail(),
                ':password' => $hashedPassword,
                ':role' => $UserRole::getDefault()->value,
                ':status' => UserStatus::ACTIVE->value,
                ':created_by' => $userObj->getCreatedBy()
            ]);

            http_response_code(201);
            return ['status' => 'success', 'message' => 'User created', 'data' => ['id' => $userObj->getId()]];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage(), 'data' => null];
        }
    }

    
    public function update($id, $data, $adminUserId) {
        try {
            $fields = [];
            $params = [':id' => $id];
            if (isset($data['password'])) {
                $fields[] = 'password_hash = :password';
                $params[':password'] = Security::hashPassword($data['password']);
            }
            if (isset($data['role'])) {
                $fields[] = 'role = :role';
                $params[':role'] = $data['role'];
            }
            // Always update the updated_by and updated_at fields
            $fields[] = 'updated_by = :updated_by';
            $fields[] = 'updated_at = NOW()';
            $params[':updated_by'] = $adminUserId;

            if (empty($fields)) {
                http_response_code(400);
                return ['status' => 'error', 'message' => 'No valid fields to update.', 'data' => null];
            }

            $sql = "UPDATE users SET ".implode(', ', $fields)." WHERE id = :id";
            $stmt = self::$pdo->prepare($sql);
            $stmt->execute($params);

            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'User not found or no changes made.'];
            }

            return ['status' => 'success', 'message' => 'User updated'];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()];
        }
    }

    
    public function getAll() {
        try {
        

            $sql = "SELECT id, email, role, status FROM users  WHERE status != :inactive ORDER BY created_at DESC";

            $stmt = self::$pdo->prepare($sql);
            $stmt->bindValue(':inactive', UserStatus::INACTIVE->value);
            
            
            $stmt->execute();

            $users = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            http_response_code(200); 
            return [
                'status' => 'success',
                'message' => 'Users retrieved successfully',
                'data' => [
                    'users' => $users,
                    'total' => count($users) 
                ]
            ];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage(), 'data' => null];
        }
    }


    public function delete($id, $adminUserId) {
        try {
            $stmt = self::$pdo->prepare("UPDATE users SET status = :status , updated_by = :updated_by WHERE id = :id");
            $stmt->execute([
                ':id' => $id,
                ':status' => UserStatus::INACTIVE->value,
                ':updated_by' => $adminUserId
            ]);

            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                return ['status' => 'error', 'message' => 'User not found.', 'data' => null];
            }

            return ['status' => 'success', 'message' => 'User inactivated', 'data' => null];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => 'Server error: ' . $e->getMessage(), 'data' => null];
        }
    }
}
