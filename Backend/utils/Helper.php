<?php
// Helper.php
// This file provides security helper functions like password hashing and verification.

namespace Utils;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Utils\enums\UserRole ;
use Exception;

class Helper {
    

    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    
    public static function hashPassword($password) {
        // Use PHP's password_hash function for security
        return password_hash($password, PASSWORD_DEFAULT);
    }

  
    public static function verifyPassword($password, $hash) {
        // Use password_verify to check if password matches the hash
        return password_verify($password, $hash);
    }

    
    public static function generateToken(array $userData): string {
        $key = $_ENV['JWT_SECRET'] ; 
        $payload = [
            'iat' => time(),
            'exp' => time() + 3600, // Token valid for 1 hour
            'data' => $userData
        ];
        return JWT::encode($payload, $key, 'HS256');
    }

    
    public static function verifyToken(string $token): array {
        try {
            $key = $_ENV['JWT_SECRET'];
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $payload = json_decode(json_encode($decoded), true);
            
            // Check if we have data in the payload
            if (!isset($payload['data'])) {
                throw new Exception('Invalid token structure: missing data');
            }

            // Check expiration
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                throw new Exception('Token has expired');
            }

            return $payload;
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    } 
    public static function requireAdmin($token) {
      
        if (!$token || substr_count($token, '.') !== 2) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid or missing JWT token.']);
            return null;
        }
        try {
            $payload = Helper::verifyToken($token);
            $userData = $payload['data'] ?? null;
            if (!$userData || ($userData['role'] ?? null) !== UserRole::ADMIN->value) {
                http_response_code(403);
                echo json_encode(['status' => 'error', 'message' => 'Admin privileges required.']);
                return null;
            }
            return $userData;
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token.']);
            return null;
        }
    }
    
    public static function requireUser($token) {
        if (!$token || substr_count($token, '.') !== 2) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid or missing JWT token.']);
            return null;
        }
        try {
            $payload = Helper::verifyToken($token);
            $userData = $payload['data'] ?? null;
            if (!$userData) {
                http_response_code(403);
                echo json_encode(['status' => 'error', 'message' => 'User privileges required.']);
                return null;
            }
            return $userData;
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token.']);
            return null;
        }
    }
}