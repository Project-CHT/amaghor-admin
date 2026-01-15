'use client';

import { adminService, AdminStats } from '@/lib/services/adminService';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Eye,
  Calendar,
  MessageSquare,
  CreditCard,
  Building
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Use real stats with fallback to zeroes
  const adminStats = stats || {
    totalUsers: 0,
    activeUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    websiteViews: 0,
    systemHealth: 100,
    totalPackages: 0,
    pendingApprovals: 0,
    unreadMessages: 0,
    totalTransportBookings: 0,
    activeTransportBookings: 0
  };

  const recentActivity = [
    { time: '2 min ago', action: 'New user registration', user: 'Rahman Ahmed', type: 'user' },
    { time: '5 min ago', action: 'Hotel booking confirmed', user: 'Fatima Khan', type: 'booking' },
    { time: '10 min ago', action: 'Package created', user: 'Admin', type: 'content' },
    { time: '15 min ago', action: 'Payment processed', user: 'Karim Hassan', type: 'payment' },
    { time: '20 min ago', action: 'Review submitted', user: 'Nasir Ali', type: 'review' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-blue-500" />;
      case 'booking': return <Calendar className="h-4 w-4 text-green-500" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-sm text-gray-500">Welcome back to the admin control center.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white">
            <Activity className="h-3 w-3 mr-1" />
            System Healthy
          </Badge>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Online
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{adminStats.totalUsers.toLocaleString()}</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +12% this month
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">৳{(adminStats.totalRevenue / 100000).toFixed(1)}L</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +18% this month
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{adminStats.totalBookings}</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +5% this week
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Partner Requests</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{adminStats.pendingApprovals}</h3>
              <p className="text-xs text-orange-600 mt-1">Pending review</p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="mt-0.5 p-1.5 bg-gray-50 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <div className="space-y-4">
          <Card className="shadow-sm border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Pending Approvals</h4>
                  <p className="text-xs text-gray-500 mt-1">{adminStats.pendingApprovals} items waiting for your review.</p>
                  <Button size="sm" variant="secondary" className="mt-3 w-full h-8 text-xs">Review Items</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Support Messages</h4>
                  <p className="text-xs text-gray-500 mt-1">{adminStats.unreadMessages} new messages need attention.</p>
                  <Button size="sm" variant="secondary" className="mt-3 w-full h-8 text-xs">View Inbox</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}