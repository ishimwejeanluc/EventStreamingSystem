<?php
// services/UserService.php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../config/Database.php'
use Ramsey\Uuid\Uuid;

class UserService {
    private static $pdo = null;

    public function __construct() {
        if (self::$pdo === null) {
            self::$pdo = Database::getConnection();
        }
    }

    public function create(User $userObj) {
        $name = $userObj->getName();
        $email = $userObj->getEmail();
        $password = $userObj->getPassword();
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $userId = Uuid::uuid4()->toString();

        try {
            $stmt = self::$pdo->prepare("INSERT INTO users (id, name, email, password) VALUES (:id, :name, :email, :password)");
            $stmt->bindParam(':id', $userId);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $passwordHash);

            $result = $stmt->execute();

            if ($result) {
                $userObj->id = $userId;
                return 'User saved';
            } else {
                throw new Exception('User could not be saved.');
            }
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    public function getById(User userObj) {
        try {
            $stmt = self::$pdo->prepare("SELECT * FROM users WHERE id = :id");
            $stmt->bindParam(':id', userObj->getId());
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

    public function update(User userObj){

        
        try {
            
            
            $stmt = self::$pdo->prepare($sql);
            $result = $stmt->execute($params);
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
    public function setPasswordHash(string $password) {
        
        return password_hash($password, PASSWORD_DEFAULT);
        
    }

    
} 