<?php
// controllers/Admin/StatisticsController.php
// This controller handles admin statistics and analytics endpoints

namespace Controllers\Admin;

use Utils\Helper;
use Services\Admin\StatisticsService;

class StatisticsController {
    private $statisticsService;

    public function __construct() {
        $this->statisticsService = new StatisticsService();
    }

    public function getViewStatistics($authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        if (!$admin) return;

        try {
            $stats = $this->statisticsService->getViewStatistics();
            return [
                'status' => 'success',
                'message' => 'View statistics retrieved successfully',
                'data' => $stats
            ];
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'message' => 'Failed to retrieve view statistics: ' . $e->getMessage()
            ];
        }
    }

    public function getUserStatistics($authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        if (!$admin) return;

        try {
            $stats = $this->statisticsService->getUserStats();
            return [
                'status' => 'success',
                'message' => 'User statistics retrieved successfully',
                'data' => $stats
            ];
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'message' => 'Failed to retrieve user statistics: ' . $e->getMessage()
            ];
        }
    }

    public function getEventStatistics($authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        if (!$admin) return;

        try {
            $stats = $this->statisticsService->getEventStats();
            return [
                'status' => 'success',
                'message' => 'Event statistics retrieved successfully',
                'data' => $stats
            ];
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'message' => 'Failed to retrieve event statistics: ' . $e->getMessage()
            ];
        }
    }

    public function getDashboardStatistics($authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        if (!$admin) return;

        try {
            $stats = [
                'users' => $this->statisticsService->getUserStats(),
                'events' => $this->statisticsService->getEventStats(),
                'views' => $this->statisticsService->getViewStatistics()
            ];
            return [
                'status' => 'success',
                'message' => 'Dashboard statistics retrieved successfully',
                'data' => $stats
            ];
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'message' => 'Failed to retrieve dashboard statistics: ' . $e->getMessage()
            ];
        }
    }

   
}
