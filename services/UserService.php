<?php
// services/UserService.php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../utils/Helper.php';
require_once __DIR__ . '/../utils/enums/UserRole.php';
require_once __DIR__ . '/../utils/enums/UserStatus.php';
use Ramsey\Uuid\Uuid;

class UserService {
    private static $pdo = null;

    public function __construct() {
        if (self::$pdo === null) {
            self::$pdo = Database::getConnection();
        }
    }



    public function getById(User $userObj) {
        $id = $userObj->getId();
        
        // Validate required field
        if (empty($id)) {
            throw new Exception('User ID is required.');
        }

        try {
            $stmt = self::$pdo->prepare("SELECT * FROM users WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                return $user;
            } else {
                throw new Exception('User not found.');
            }
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

        public function update(User $userObj) {
        $id = $userObj->getId();
        $name = $userObj->getName();
        $email = $userObj->getEmail();
        $password = $userObj->getPassword();
        
        try {
            $sql = "UPDATE users SET name = :name, email = :email";
            
            // Only include password in update if it's not empty
            if (!empty($password)) {
                $passwordHash = Helper::hashPassword($password);
                $sql .= ", password = :password";
            }
            
            $sql .= " WHERE id = :id";
            
            $stmt = self::$pdo->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            
            if (!empty($password)) {
                $stmt->bindParam(':password', $passwordHash);
            }
            
            $result = $stmt->execute();
            if ($result && $stmt->rowCount() > 0) {
                return 'User updated';
            } else {
                throw new Exception('User could not be updated or no changes made.');
            }
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    public function delete($id) {
        try {
            $stmt = self::$pdo->prepare("DELETE FROM users WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $result = $stmt->execute();
            if ($result && $stmt->rowCount() > 0) {
                return 'User deleted';
            } else {
                throw new Exception('User could not be deleted or not found.');
            }
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }
    

    public function retrieveAll() {
        try {
            $stmt = self::$pdo->prepare("SELECT * FROM users");
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $users;
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }
    
    
} 