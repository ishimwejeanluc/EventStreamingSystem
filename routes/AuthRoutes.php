<?php
// AuthRoutes.php
// This file defines the routes (URLs) for authentication actions like register and login.

require_once __DIR__ . '/../controllers/AuthController.php';

$authController = new AuthController();

// Route for user registration
$router->post('/api/Auth/register', function($request) use ($authController) {
    // Call the register method in AuthController
    return $authController->register($request->getBody());
});

// Route for user login
$router->post('/api/Auth/login', function($request) use ($authController) {
    // Call the login method in AuthController
    return $authController->login($request->getBody());
});