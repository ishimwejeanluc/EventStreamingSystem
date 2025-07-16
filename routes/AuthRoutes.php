<?php
// AuthRoutes.php
// This file defines the routes (URLs) for authentication actions like register and login.

namespace Routes;

use Controllers\AuthController;

class AuthRoutes
{
    public static function handle($method, $path, $input)
    {
        $authController = new AuthController();

        if ($method === 'POST' && $path === '/api/Auth/register') {
            $result = $authController->register($input ?? []);
            echo json_encode($result);
            exit;
        }
        if ($method === 'POST' && $path === '/api/Auth/login') {
            $result = $authController->login($input ?? []);
            echo json_encode($result);
            exit;
        }

        // If no route matched
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Not found']);
    }
}