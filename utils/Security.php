<?php
// Security.php
// This file provides security helper functions like password hashing and verification.

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Security {
    

    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    /**
     * Hash a password using a secure algorithm
     * @param string $password The plain password
     * @return string The hashed password
     */
    public static function hashPassword($password) {
        // Use PHP's password_hash function for security
        return password_hash($password, PASSWORD_DEFAULT);
    }

    /**
     * Verify a password against a hash
     * @param string $password The plain password
     * @param string $hash The hashed password
     * @return bool True if the password matches, false otherwise
     */
    public static function verifyPassword($password, $hash) {
        // Use password_verify to check if password matches the hash
        return password_verify($password, $hash);
    }

    /**
     * Generate a JWT token for a user
     * @param array $userData - should include id, username, email, role
     * @return string
     */
    public static function generateToken(array $userData): string {
        $key = getenv('JWT_SECRET') ?: 'your-secret-key'; // Use env variable in production!
        $payload = [
            'iat' => time(),
            'exp' => time() + 3600, // Token valid for 1 hour
            'data' => $userData
        ];
        return JWT::encode($payload, $key, 'HS256');
    }

    /**
     * Verify a JWT token and return the payload
     * @param string $token
     * @return array
     */
    public static function verifyToken(string $token): array {
        $key = getenv('JWT_SECRET') ?: 'your-secret-key';
        return (array) JWT::decode($token, new Key($key, 'HS256'));
    }
}