<?php
// AuthController.php
// This controller handles user authentication actions like register and login.

require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../models/User.php';

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
     * @return array Result status and message
     */
    public function register(array $data) {
        // Check if required fields are provided
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
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
        $result = $this->authService->RegisterAccount($user);
        if($result === 'User saved') {
            return ['status' => 'success', 'message' => 'Account registered successfully.'];
        } else {
            return ['status' => 'error', 'message' => $result];
        }
    }

    /**
     * Log in a user
     * @param array $data Login data (email and password)
     * @return array Result status and message
     */
    public function login(array $data) {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        // Check if email and password are provided
        if (empty($email) || empty($password)) {
            return [
                'status' => 'error',
                'message' => 'Email and password are required fields.'
            ];
        }

        // Create a User object with login credentials
        $user = new User('', '', $email, $password);

        // Call the service to attempt login
        $result = $this->authService->Login($user);

        // Return result based on login attempt
        if ($result === 'Login successful') {
            return ['status' => 'success', 'message' => $result];
        } else {
            return ['status' => 'error', 'message' => $result];
        }
    }
}
