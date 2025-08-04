<?php
// Database.php
// This file sets up the database connection using environment variables from the .env file.

namespace Config;

use PDO;
use PDOException;
use Exception;

class Database {
    public static function getConnection() {
        // Get database credentials from environment variables (no defaults)
        $host = $_ENV['DB_HOST'] ?? null;
        $port = $_ENV['DB_PORT'] ?? null;
        $dbname = $_ENV['DB_NAME'] ?? null;
        $user = $_ENV['DB_USER'] ?? null;
        $password = $_ENV['DB_PASSWORD'] ?? null;

        // Check if any required variable is missing
        if (!$host || !$port || !$dbname || !$user || !$password) {
            throw new Exception('Database configuration error: Please set DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD in your .env file.');
        }

        // Create a new PDO connection with port
        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
        try {
            $pdo = new PDO($dsn, $user, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch (PDOException $e) {
            throw new PDOException('Database connection failed: ' . $e->getMessage());
        }
    }
}
