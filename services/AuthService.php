<?php
// AuthService.php
// This service handles authentication logic like registering and logging in users.

namespace Services;

use Ramsey\Uuid\Uuid;
use Config\Database;
use Models\User;
use Utils\Security;

class AuthService {
    // Database connection (shared for all AuthService instances)
    private static $pdo = null;

    /**
     * Constructor: Initializes the database connection
     */
    public function __construct() {
        if (self::$pdo === null) {
            self::$pdo = Database::getConnection();
        }
    }

    /**
     * Register a new user account
     * @param User $userObj The user to register
     * @return string Success or error message
     */
    public function RegisterAccount(User $userObj) {
        // Get user details from the User object
        $username = $userObj->getUsername();
        $email = $userObj->getEmail();
        $password = $userObj->getPassword();
        $role = UserRole::getDefault();
        $status = UserStatus::getDefault();

        // Check if required fields are filled
        if (empty($username) || empty($email) || empty($password)) {
            throw new \Exception('Name, email and password are required fields.');
        }

        // Hash the password for security
        $passwordHash = Utils\Security::hashPassword($password);
        // Generate a unique user ID
        $userId = Uuid::uuid4()->toString();

        try {
            // Prepare SQL to insert the new user
            $stmt = self::$pdo->prepare("INSERT INTO users (id, username, email, password_hash, role, status, created_by) VALUES (:id, :username, :email, :password, :role, :status, :createdBy)");
            $stmt->bindParam(':id', $userId);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $passwordHash);
            $roleValue = $role->value;
            $statusValue = $status->value;
            $stmt->bindParam(':role', $roleValue);
            $stmt->bindParam(':status', $statusValue);
            $stmt->bindParam(':createdBy', $userId);

            $result = $stmt->execute();

            // Check if the user was saved
            if ($result && $stmt->rowCount() > 0) {
                $userObj->setId($userId);
                return 'User saved';
            } else {
                throw new \Exception('User could not be saved.');
            }
        } catch (\PDOException $e) {
            // Print and throw database errors
            echo "$e->getMessage()";
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    /**
     * Log in a user
     * @param User $userObj The user trying to log in
     * @return string Success or error message
     */
    public function Login(User $userObj) {
        // Get email and password from the User object
        $email = $userObj->getEmail();
        $password = $userObj->getPassword();

        try {
            // Prepare SQL to find the user by email
            $stmt = self::$pdo->prepare("SELECT * FROM users WHERE email = :email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            // Check if a user with this email exists
            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch(\PDO::FETCH_ASSOC);
                $userpassword = $user['password_hash'];

                // Verify the password
                if (\Utils\Security::verifyPassword($password, $userpassword)) {
                    // Generate JWT token with user details
                    $token = \Utils\Security::generateToken([
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'email' => $user['email'],
                        'role' => $user['role'],
                        'status' => $user['status'] ?? null
                    ]);
                    return [
                        'status' => 'success',
                        'message' => 'Login successful',
                        'token' => $token
                    ];
                } else {
                    return [
                        'status' => 'error',
                        'message' => 'Invalid password.'
                    ];
                }
            } else {
                return [
                    'status' => 'error',
                    'message' => 'User not found.'
                ];
            }
        } catch (\PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage()
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Server error: ' . $e->getMessage()
            ];
        }
    }
}