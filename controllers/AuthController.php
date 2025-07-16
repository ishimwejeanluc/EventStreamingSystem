<?php
// AuthController.php
// This controller handles user authentication actions like register and login.

namespace Controllers;

use Services\AuthService;
use Models\User;

class AuthController {
    // Service for authentication logic
    private $authService;

    /**
     * Constructor: Initializes the AuthService
     */
    public function __construct() {
        $this->authService = new AuthService();
    }

    /**
     * Register a new user account
     * @param array $data User registration data
     * @return array Result status, message, and code
     */
    public function register(array $data) {
        // Check if required fields are provided
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            return [
                'status' => 'error',
                'message' => 'Name, email, and password are required fields.'
            ];
        }
        // Generate a unique user ID
        $id = \Ramsey\Uuid\Uuid::uuid4()->toString();
        // Create a new User object
        $user = new User(
            $id,
            $data['name'],
            $data['email'],
            $data['password'],
            null,
            null
        );
        // Call the service to register the account
        try {
            $result = $this->authService->RegisterAccount($user);
            if($result === 'User saved') {
                http_response_code(201);
                return ['status' => 'success', 'message' => 'Account registered successfully.'];
            } else {
                http_response_code(500);
                return ['status' => 'error', 'message' => $result];
            }
        } catch (\Exception $e) {
            http_response_code(500);
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Log in a user
     * @param array $data Login data (email and password)
     * @return array Result status, message, token (if success)
     */
    public function login(array $data) {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        // Check if email and password are provided
        if (empty($email) || empty($password)) {
            http_response_code(400);
            return [
                'status' => 'error',
                'message' => 'Email and password are required fields.'
            ];
        }

        // Create a User object with login credentials
        $user = new User('', '', $email, $password);

        // Call the service to attempt login
        $result = $this->authService->Login($user);

        // Set HTTP response code based on result
        if (isset($result['status']) && $result['status'] === 'success') {
            http_response_code(200);
        } else if (isset($result['message']) && ($result['message'] === 'Invalid password.' || $result['message'] === 'User not found.')) {
            http_response_code(401);
        } else {
            http_response_code(500);
        }
        return $result;
    }
}
