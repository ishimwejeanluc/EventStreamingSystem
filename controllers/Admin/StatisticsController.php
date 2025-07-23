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
            $stats = $this->statisticsService->getVideoViewStats();
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
                'overview' => $this->statisticsService->getOverallStats(),
                'recent_events' => $this->statisticsService->getRecentEventStats(),
                'recent_views' => $this->statisticsService->getRecentViewStats(),
                'user_activity' => $this->statisticsService->getUserActivityStats()
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

    public function getOverallStats($authHeader) {
        $admin = Helper::requireAdmin($authHeader);
        if (!$admin) return;

        try {
            $stats = [
                'users' => $this->statisticsService->getUserStats(),
                'events' => $this->statisticsService->getEventStats(),
                'videos' => $this->statisticsService->getVideoStats(),
                'engagement' => $this->statisticsService->getEngagementStats(),
            ];

            return [
                'status' => 'success',
                'message' => 'Statistics retrieved successfully',
                'code' => 'STATS_RETRIEVED',
                'data' => $stats
            ];
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'message' => 'Failed to retrieve statistics: ' . $e->getMessage(),
                'code' => 'STATS_RETRIEVAL_ERROR'
            ];
        }
    }



   
    public function getPeriodStats($authHeader, $startDate, $endDate) {
        $admin = Helper::requireAdmin($authHeader);
        if (!$admin) return;

        try {
            $stats = $this->statisticsService->getPeriodStats($startDate, $endDate);

            return [
                'status' => 'success',
                'message' => 'Period statistics retrieved successfully',
                'data' => [
                    'period' => [
                        'start' => $startDate,
                        'end' => $endDate
                    ],
                    'statistics' => $stats
                ]
            ];
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'message' => 'Failed to retrieve period statistics: ' . $e->getMessage()
            ];
        }
    }
}
