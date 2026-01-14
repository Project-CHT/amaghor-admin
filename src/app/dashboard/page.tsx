'use client';

import { adminService, AdminStats } from '@/lib/services/adminService';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Users,
  Settings,
  FileText,
  BarChart3,
  Shield,
  Database,
  Globe,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Calendar,
  CreditCard,
  MessageSquare,
  Building,
  Truck
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
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

  const adminModules = [
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      color: 'bg-blue-500',
      stats: `${adminStats.totalUsers} users`,
      href: '/users'
    },
    {
      id: 'content',
      title: 'Content Management',
      description: 'Manage website content and pages',
      icon: FileText,
      color: 'bg-green-500',
      stats: '24 pages',
      href: '/content'
    },
    {
      id: 'settings',
      title: 'Website Settings',
      description: 'Configure site-wide settings',
      icon: Settings,
      color: 'bg-purple-500',
      stats: 'Last updated 2h ago',
      href: '/settings'
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      description: 'View detailed analytics and reports',
      icon: BarChart3,
      color: 'bg-orange-500',
      stats: `${adminStats.websiteViews.toLocaleString()} views`,
      href: '/analytics'
    },
    {
      id: 'partners',
      title: 'Partner Management',
      description: 'Manage hotel partners and applications',
      icon: Building,
      color: 'bg-red-500',
      stats: '25 partners',
      href: '/partners'
    },
    {
      id: 'pms-features',
      title: 'PMS Features',
      description: 'Enable/disable pro features for hotel partners',
      icon: Settings,
      color: 'bg-pink-500',
      stats: '15 pro features active',
      href: '/pms-features'
    },
    {
      id: 'bookings',
      title: 'Booking System',
      description: 'Monitor all bookings and reservations',
      icon: Calendar,
      color: 'bg-indigo-500',
      stats: `${adminStats.totalBookings} bookings`,
      href: '/bookings'
    },
    {
      id: 'payments',
      title: 'Payment Management',
      description: 'Manage payments and transactions',
      icon: CreditCard,
      color: 'bg-teal-500',
      stats: `৳${adminStats.totalRevenue.toLocaleString()}`,
      href: '/payments'
    },
    {
      id: 'transport',
      title: 'Transport Management',
      description: 'Manage CNG, Bus, and Boat bookings',
      icon: Truck,
      color: 'bg-cyan-500',
      stats: `${adminStats.totalTransportBookings} bookings`,
      href: '/transport'
    },
    {
      id: 'security',
      title: 'Security & Logs',
      description: 'Security monitoring and audit logs',
      icon: Shield,
      color: 'bg-gray-700',
      stats: 'All secure',
      href: '/security'
    },
    {
      id: 'system',
      title: 'System Health',
      description: 'Monitor system performance',
      icon: Activity,
      color: 'bg-emerald-500',
      stats: `${adminStats.systemHealth}% uptime`,
      href: '/system'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-blue-500" />;
      case 'booking': return <Calendar className="h-4 w-4 text-green-500" />;
      case 'content': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-orange-500" />;
      case 'review': return <MessageSquare className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideSearch />

      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-2 md:px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm md:text-base text-gray-600">Complete control over your website and business</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                System Healthy
              </Badge>
              <Badge className="bg-green-100 text-green-700 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total Users</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{adminStats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total Revenue</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">৳{(adminStats.totalRevenue / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-green-600">+18% this month</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Website Views</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{(adminStats.websiteViews / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-blue-600">+8% this week</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">System Health</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{adminStats.systemHealth}%</p>
                  <p className="text-xs text-green-600">All systems operational</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Modules */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {adminModules.map((module) => {
              const Icon = module.icon;
              return (
                <Link key={module.id} href={module.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 md:w-12 md:h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {module.stats}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">{module.title}</h3>
                      <p className="text-xs md:text-sm text-gray-600">{module.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">by {activity.user}</p>
                    </div>
                    <p className="text-xs text-gray-500 flex-shrink-0">{activity.time}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 text-sm">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Alerts & Notifications */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Alerts & Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">Pending Approvals</p>
                    <p className="text-xs text-yellow-700">{adminStats.pendingApprovals} items need review</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    Review
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">Unread Messages</p>
                    <p className="text-xs text-blue-700">{adminStats.unreadMessages} new support messages</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    View
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">System Backup</p>
                    <p className="text-xs text-green-700">Completed successfully at 3:00 AM</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-xs">Add User</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Building className="h-5 w-5" />
                <span className="text-xs">Manage Partners</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="text-xs">Create Page</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Settings className="h-5 w-5" />
                <span className="text-xs">Site Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}