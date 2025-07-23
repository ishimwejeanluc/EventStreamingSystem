<?php
// services/Admin/StatisticsService.php
// This service handles statistics and analytics calculations

namespace Services\Admin;

use Config\Database;
use Utils\Enums\UserStatus;
use Utils\Enums\EventStatus;
use Utils\Enums\VideoStatus;
use Utils\Enums\VideoViewStatus;

class StatisticsService {
    private static $pdo = null;

    public function __construct() {
        if (self::$pdo === null) {
            self::$pdo = Database::getConnection();
        }
    }

    /**
     * Get user-related statistics
     * @return array User statistics
     */
    public function getUserStats() {
        try {
            // Total active users
            $activeUsersStmt = self::$pdo->query("
                SELECT COUNT(*) as count FROM users 
                WHERE status = '".UserStatus::ACTIVE->value."'
            ");
            $activeUsers = $activeUsersStmt->fetch(\PDO::FETCH_ASSOC)['count'];

            // New users in last 30 days
            $newUsersStmt = self::$pdo->query("
                SELECT COUNT(*) as count FROM users 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            ");
            $newUsers = $newUsersStmt->fetch(\PDO::FETCH_ASSOC)['count'];

            // Users by role
            $usersByRoleStmt = self::$pdo->query("
                SELECT role, COUNT(*) as count FROM users 
                GROUP BY role
            ");
            $usersByRole = $usersByRoleStmt->fetchAll(\PDO::FETCH_KEY_PAIR);

            http_response_code(200);
            return [
                
                    'total_active_users' => $activeUsers,
                    'new_users_last_30_days' => $newUsers,
                    'users_by_role' => $usersByRole
                ]
;
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'code' => 'USER_STATS_ERROR',
                'message' => 'Failed to get user statistics: ' . $e->getMessage(),
                
            ];
        }
    }

    /**
     * Get event-related statistics
     * 
     */
    public function getEventStats() {
        try {
            // Active events
            $activeEventsStmt = self::$pdo->query("
                SELECT COUNT(*) as count FROM events 
                WHERE status = '".EventStatus::ACTIVE->value."'
            ");
            $activeEvents = $activeEventsStmt->fetch(\PDO::FETCH_ASSOC)['count'];

            // Events in last 30 days
            $recentEventsStmt = self::$pdo->query("
                SELECT COUNT(*) as count FROM events 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            ");
            $recentEvents = $recentEventsStmt->fetch(\PDO::FETCH_ASSOC)['count'];

            // Events by status
            $eventsByStatusStmt = self::$pdo->query("
                SELECT status, COUNT(*) as count FROM events 
                GROUP BY status
            ");
            $eventsByStatus = $eventsByStatusStmt->fetchAll(\PDO::FETCH_KEY_PAIR);

            http_response_code(200);
            return [

                    'total_active_events' => $activeEvents,
                    'new_events_last_30_days' => $recentEvents,
                    'events_by_status' => $eventsByStatus
                ];
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'code' => 'EVENT_STATS_ERROR',
                'message' => 'Failed to get event statistics: ' . $e->getMessage(),
              
            ];
        }
    }

    /**
     * Get video-related statistics
     * @return array Video statistics
     */
    public function getVideoStats() {
        try {
            // Active videos
            $activeVideosStmt = self::$pdo->query("
                SELECT COUNT(*) as count FROM videos 
                WHERE status = '".VideoStatus::ACTIVE->value."'
            ");
            $activeVideos = $activeVideosStmt->fetch(\PDO::FETCH_ASSOC)['count'];

            // Videos uploaded in last 30 days
            $recentVideosStmt = self::$pdo->query("
                SELECT COUNT(*) as count FROM videos 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            ");
            $recentVideos = $recentVideosStmt->fetch(\PDO::FETCH_ASSOC)['count'];

            // Total video duration
            $totalDurationStmt = self::$pdo->query("
                SELECT SUM(duration) as total_duration FROM videos 
                WHERE status = '".VideoStatus::ACTIVE->value."'
            ");
            $totalDuration = $totalDurationStmt->fetch(\PDO::FETCH_ASSOC)['total_duration'];

            http_response_code(200);
            return [
                [
                    'total_active_videos' => $activeVideos,
                    'new_videos_last_30_days' => $recentVideos,
                    'total_video_hours' => round($totalDuration / 3600, 2)
                ]
            ];
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'code' => 'VIDEO_STATS_ERROR',
                'message' => 'Failed to get video statistics: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }

    /**
     * Get engagement-related statistics
     * @return array Engagement statistics
     */
    public function getEngagementStats() {
        try {
            // Total views
            $totalViewsStmt = self::$pdo->query("
                SELECT COUNT(*) as count FROM video_views 
                WHERE status = '".VideoViewStatus::COMPLETED->value."'
            ");
            $totalViews = $totalViewsStmt->fetch(\PDO::FETCH_ASSOC)['count'];

            // Views in last 30 days
            $recentViewsStmt = self::$pdo->query("
                SELECT COUNT(*) as count FROM video_views 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            ");
            $recentViews = $recentViewsStmt->fetch(\PDO::FETCH_ASSOC)['count'];

            // Average watch time
            $avgWatchTimeStmt = self::$pdo->query("
                SELECT AVG(watch_duration) as avg_duration FROM video_views 
                WHERE status = '".VideoViewStatus::COMPLETED->value."'
            ");
            $avgWatchTime = $avgWatchTimeStmt->fetch(\PDO::FETCH_ASSOC)['avg_duration'];

            // Most viewed videos
            $popularVideosStmt = self::$pdo->query("
                SELECT v.title, COUNT(vv.id) as view_count 
                FROM videos v 
                JOIN video_views vv ON v.id = vv.video_id 
                WHERE vv.status = '".VideoViewStatus::COMPLETED->value."'
                GROUP BY v.id 
                ORDER BY view_count DESC 
                LIMIT 5
            ");
            $popularVideos = $popularVideosStmt->fetchAll(\PDO::FETCH_ASSOC);

            http_response_code(200);
            return [
                'total_video_views' => $totalViews,
                'views_last_30_days' => $recentViews,
                'avg_watch_time_minutes' => round($avgWatchTime / 60, 2),
                'top_5_videos' => $popularVideos
            ];
        } catch (\Exception $e) {
            http_response_code(500);
            return [
                'status' => 'error',
                'code' => 'ENGAGEMENT_STATS_ERROR',
                'message' => 'Failed to get engagement statistics: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }

    
    
}
