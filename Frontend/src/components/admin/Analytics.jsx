import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import CountUp from 'react-countup';
import { 
  Users, 
  Video,
  Calendar,
  TrendingUp,
  Eye,
  BarChart3,
  UserPlus,
  Clock,
  Loader2 
} from 'lucide-react';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const Analytics = () => {
  const [viewStats, setViewStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [eventStats, setEventStats] = useState(null);
  const [loading, setLoading] = useState({
    views: true,
    users: true,
    events: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      await Promise.all([
        fetchViewStats(),
        fetchUserStats(),
        fetchEventStats()
      ]);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchViewStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/Admin/statistics/views`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch view statistics');
      
      const data = await response.json();
      if (data.status === 'success') {
        setViewStats(data.data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load view statistics: ${error.message}`
      });
    } finally {
      setLoading(prev => ({ ...prev, views: false }));
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/Admin/statistics/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user statistics');
      
      const data = await response.json();
      if (data.status === 'success') {
        setUserStats(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load user statistics: ${error.message}`
      });
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchEventStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/Admin/statistics/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch event statistics');
      
      const data = await response.json();
      if (data.status === 'success') {
        setEventStats(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load event statistics: ${error.message}`
      });
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d');
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  const CustomTooltip = ({ active, payload, label, valuePrefix = "", valueSuffix = "" }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {valuePrefix}{entry.value.toLocaleString()}{valueSuffix}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed platform statistics and insights</p>
        </div>
      </div>

      <Tabs defaultValue="views" className="space-y-6">
        <TabsList>
          <TabsTrigger value="views" className="space-x-2">
            <Eye className="h-4 w-4" />
            <span>Views</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Events</span>
          </TabsTrigger>
        </TabsList>

        {/* Views Analytics */}
        <TabsContent value="views">
          {loading.views ? (
            <LoadingSpinner />
          ) : viewStats ? (
            <div className="grid gap-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Total Views</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <CountUp
                        end={viewStats.total_views}
                        duration={2}
                        separator=","
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">All-time views</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Recent Views</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <CountUp
                        end={viewStats.views_last_24h}
                        duration={2}
                        separator=","
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Views in last 24 hours</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Unique Viewers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <CountUp
                        end={viewStats.unique_viewers}
                        duration={2}
                        separator=","
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Individual viewers</p>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Views Trend</CardTitle>
                  <CardDescription>View count for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={viewStats.weekly_trend}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="view_date" tickFormatter={formatDate} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip valueSuffix=" views" />} />
                        <Area 
                          type="monotone" 
                          dataKey="view_count" 
                          name="Views"
                          stroke="#8884d8" 
                          fillOpacity={1} 
                          fill="url(#viewsGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Videos */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Viewed Content</CardTitle>
                  <CardDescription>Videos with highest view counts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={viewStats.top_videos}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="title" 
                          width={150}
                          tick={({ x, y, payload }) => (
                            <text x={x} y={y} dy={4} textAnchor="end" fill="currentColor" className="text-sm">
                              {payload.value.length > 20 
                                ? payload.value.substring(0, 20) + '...' 
                                : payload.value}
                            </text>
                          )}
                        />
                        <Tooltip content={<CustomTooltip valueSuffix=" views" />} />
                        <Bar 
                          dataKey="view_count" 
                          name="Views"
                          fill="#8884d8"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center text-red-600">Failed to load view statistics</div>
          )}
        </TabsContent>

        {/* Users Analytics */}
        <TabsContent value="users">
          {loading.users ? (
            <LoadingSpinner />
          ) : userStats ? (
            <div className="grid gap-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Total Users</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <CountUp
                        end={userStats.total_active_users}
                        duration={2}
                        separator=","
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Active platform users</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <UserPlus className="h-4 w-4" />
                      <span>New Users</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <CountUp
                        end={userStats.new_users_last_30_days}
                        duration={2}
                        separator=","
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Joined in last 30 days</p>
                  </CardContent>
                </Card>
              </div>

              {/* User Roles Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>User Role Distribution</CardTitle>
                  <CardDescription>Breakdown of users by role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(userStats.users_by_role).map(([role, count]) => ({
                            name: role.charAt(0).toUpperCase() + role.slice(1),
                            value: count
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                            return (
                              <text
                                x={x}
                                y={y}
                                fill="currentColor"
                                textAnchor={x > cx ? 'start' : 'end'}
                                dominantBaseline="central"
                                className="text-sm font-medium"
                              >
                                {name} ({(percent * 100).toFixed(0)}%)
                              </text>
                            );
                          }}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {Object.entries(userStats.users_by_role).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip valueSuffix=" users" />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* User Growth Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jan', users: userStats.total_active_users - userStats.new_users_last_30_days },
                          { month: 'Current', users: userStats.total_active_users }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip valueSuffix=" users" />} />
                        <Line
                          type="monotone"
                          dataKey="users"
                          name="Total Users"
                          stroke="#00C49F"
                          strokeWidth={2}
                          dot={{ stroke: '#00C49F', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center text-red-600">Failed to load user statistics</div>
          )}
        </TabsContent>

        {/* Events Analytics */}
        <TabsContent value="events">
          {loading.events ? (
            <LoadingSpinner />
          ) : eventStats ? (
            <div className="grid gap-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Active Events</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <CountUp
                        end={eventStats.total_active_events}
                        duration={2}
                        separator=","
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Currently active events</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>New Events</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <CountUp
                        end={eventStats.new_events_last_30_days}
                        duration={2}
                        separator=","
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Created in last 30 days</p>
                  </CardContent>
                </Card>
              </div>

              {/* Event Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Status Distribution</CardTitle>
                  <CardDescription>Breakdown of events by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(eventStats.events_by_status).map(([status, count]) => ({
                          status: status.charAt(0).toUpperCase() + status.slice(1),
                          count: count
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip valueSuffix=" events" />} />
                        <Bar dataKey="count" name="Events">
                          {Object.entries(eventStats.events_by_status).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Event Growth Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Growth</CardTitle>
                  <CardDescription>New events over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Last Month', events: eventStats.total_active_events - eventStats.new_events_last_30_days },
                          { month: 'Current', events: eventStats.total_active_events }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip valueSuffix=" events" />} />
                        <Line
                          type="monotone"
                          dataKey="events"
                          name="Total Events"
                          stroke="#FFBB28"
                          strokeWidth={2}
                          dot={{ stroke: '#FFBB28', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center text-red-600">Failed to load event statistics</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
