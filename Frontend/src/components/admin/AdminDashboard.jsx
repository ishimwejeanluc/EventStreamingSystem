import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CountUp from 'react-countup';
import { 
  Users, 
  Video, 
  Calendar, 
  TrendingUp, 
  Play, 
  Pause, 
  Settings,
  BarChart3,
  Upload,
  Eye,
  Clock,
  UserPlus
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/Admin/statistics/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setDashboardStats(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch dashboard statistics');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your event streaming platform</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload Video</span>
          </Button>
          <Button className="bg-gradient-primary flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Create Event</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : dashboardStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <CountUp
                  end={dashboardStats.users.total_active_users}
                  duration={2}
                  separator=","
                />
              </div>
              <p className="text-xs text-muted-foreground">
                +<CountUp
                  end={dashboardStats.users.new_users_last_30_days}
                  duration={2}
                  separator=","
                /> new users in last 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <CountUp
                  end={dashboardStats.events.total_active_events}
                  duration={2}
                  separator=","
                />
              </div>
              <p className="text-xs text-muted-foreground">
                +<CountUp
                  end={dashboardStats.events.new_events_last_30_days}
                  duration={2}
                  separator=","
                /> new events in last 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <CountUp
                  end={dashboardStats.views.data.total_views}
                  duration={2}
                  separator=","
                />
              </div>
              <p className="text-xs text-muted-foreground">
                +<CountUp
                  end={dashboardStats.views.data.views_last_24h}
                  duration={2}
                  separator=","
                /> views in last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Viewers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <CountUp
                  end={dashboardStats.views.data.unique_viewers}
                  duration={2}
                  separator=","
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Unique viewers to date
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center text-red-600">
          Failed to load dashboard statistics
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events Status Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Events Overview</span>
            </CardTitle>
            <CardDescription>Event status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats?.events.events_by_status ? (
                Object.entries(dashboardStats.events.events_by_status).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {status === 'upcoming' ? (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        ) : status === 'cancelled' ? (
                          <Pause className="h-4 w-4 text-red-500" />
                        ) : (
                          <Calendar className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{status}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        status === 'upcoming' ? 'default' : 
                        status === 'cancelled' ? 'destructive' : 
                        'secondary'
                      }>
                        <CountUp
                          end={count}
                          duration={2}
                          separator=","
                        /> events
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No events data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Views Analytics */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Views Analytics</span>
            </CardTitle>
            <CardDescription>Weekly trend and top content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Weekly Trend */}
              <div>
                <h4 className="text-sm font-medium mb-3">Weekly Views Trend</h4>
                <div className="space-y-2">
                  {dashboardStats?.views.data.weekly_trend.map((day) => (
                    <div key={day.view_date} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{new Date(day.view_date).toLocaleDateString()}</span>
                      <div className="flex-1 mx-4">
                        <Progress value={(day.view_count / Math.max(...dashboardStats.views.data.weekly_trend.map(d => d.view_count))) * 100} />
                      </div>
                      <span className="text-sm font-medium">
                        <CountUp
                          end={day.view_count}
                          duration={2}
                          separator=","
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Top Videos */}
              <div>
                <h4 className="text-sm font-medium mb-3">Top Videos</h4>
                <div className="space-y-3">
                  {dashboardStats?.views.data.top_videos.map((video, index) => (
                    <div key={video.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{video.title}</div>
                        <div className="text-sm text-muted-foreground">
                          <CountUp
                            end={video.view_count}
                            duration={2}
                            separator=","
                          /> views
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              {(!dashboardStats?.views.data.top_videos || dashboardStats.views.data.top_videos.length === 0) && (
                <div className="text-center text-muted-foreground py-4">
                  No videos watched yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col space-y-2">
              <UserPlus className="h-6 w-6" />
              <span>Add User</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-2">
              <Upload className="h-6 w-6" />
              <span>Upload Video</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>Analytics</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-2">
              <Settings className="h-6 w-6" />
              <span>Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;