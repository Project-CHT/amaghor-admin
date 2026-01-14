'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Users,
  Settings,
  FileText,
  BarChart3,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
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

  /* 
    State for Admin Stats
    Fetching real data from AdminService
  */
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({
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
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { adminService } = await import('@/lib/services/adminService');
        const stats = await adminService.getDashboardStats();

        // Merge with existing structure
        setAdminStats(prev => ({
          ...prev,
          ...stats
        }));
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

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
      href: '/admin/users'
    },
    {
      id: 'content',
      title: 'Content Management',
      description: 'Manage website content and pages',
      icon: FileText,
      color: 'bg-green-500',
      stats: '24 pages',
      href: '/admin/content'
    },
    {
      id: 'settings',
      title: 'Website Settings',
      description: 'Configure site-wide settings',
      icon: Settings,
      color: 'bg-purple-500',
      stats: 'Last updated 2h ago',
      href: '/admin/settings'
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      description: 'View detailed analytics and reports',
      icon: BarChart3,
      color: 'bg-orange-500',
      stats: `${adminStats.websiteViews.toLocaleString()} views`,
      href: '/admin/analytics'
    },
    {
      id: 'partners',
      title: 'Partner Management',
      description: 'Manage hotel partners and applications',
      icon: Building,
      color: 'bg-red-500',
      stats: '25 partners',
      href: '/admin/partners'
    },
    {
      id: 'pms-features',
      title: 'PMS Features',
      description: 'Enable/disable pro features for hotel partners',
      icon: Settings,
      color: 'bg-pink-500',
      stats: '15 pro features active',
      href: '/admin/pms-features'
    },
    {
      id: 'bookings',
      title: 'Booking System',
      description: 'Monitor all bookings and reservations',
      icon: Calendar,
      color: 'bg-indigo-500',
      stats: `${adminStats.totalBookings} bookings`,
      href: '/admin/bookings'
    },
    {
      id: 'payments',
      title: 'Payment Management',
      description: 'Manage payments and transactions',
      icon: CreditCard,
      color: 'bg-teal-500',
      stats: `৳${adminStats.totalRevenue.toLocaleString()}`,
      href: '/admin/payments'
    },
    {
      id: 'transport',
      title: 'Transport Management',
      description: 'Manage CNG, Bus, and Boat bookings',
      icon: Truck,
      color: 'bg-cyan-500',
      stats: `${adminStats.totalTransportBookings} bookings`,
      href: '/admin/transport'
    },
    {
      id: 'security',
      title: 'Security & Logs',
      description: 'Security monitoring and audit logs',
      icon: Shield,
      color: 'bg-gray-700',
      stats: 'All secure',
      href: '/admin/security'
    },
    {
      id: 'system',
      title: 'System Health',
      description: 'Monitor system performance',
      icon: Activity,
      color: 'bg-emerald-500',
      stats: `${adminStats.systemHealth}% uptime`,
      href: '/admin/system'
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
    <div className="min-h-screen bg-gray-50/50">
      <Header hideSearch />

      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-2 md:px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Complete control over your website and business operations</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs bg-white/50 backdrop-blur-sm">
                <Activity className="h-3 w-3 mr-1" />
                System Healthy
              </Badge>
              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all transform hover:-translate-y-1">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 pointer-events-none">+12%</Badge>
              </div>
              <p className="text-gray-500 text-sm font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{adminStats.totalUsers.toLocaleString()}</h3>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-all transform hover:-translate-y-1">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700 pointer-events-none">+18%</Badge>
              </div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">৳{(adminStats.totalRevenue / 100000).toFixed(1)}L</h3>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-all transform hover:-translate-y-1">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <Badge className="bg-purple-100 text-purple-700 pointer-events-none">+8%</Badge>
              </div>
              <p className="text-gray-500 text-sm font-medium">Website Views</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{(adminStats.websiteViews / 1000).toFixed(0)}K</h3>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gradient-to-br from-emerald-50 to-white hover:shadow-lg transition-all transform hover:-translate-y-1">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-emerald-600" />
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 pointer-events-none">Stable</Badge>
              </div>
              <p className="text-gray-500 text-sm font-medium">System Health</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{adminStats.systemHealth}%</h3>
            </CardContent>
          </Card>
        </div>

        {/* Admin Modules */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {adminModules.map((module) => {
              const Icon = module.icon;
              return (
                <Link key={module.id} href={module.href}>
                  <Card className="border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full group bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${module.color} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {module.stats}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{module.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{module.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-gray-100 shadow-sm">
            <CardHeader className="pb-2 border-b border-gray-100">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="mt-1 p-2 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">by {activity.user}</p>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0">{activity.time}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-sm text-primary hover:text-primary/80 hover:bg-primary/5">
                View All Activity log
              </Button>
            </CardContent>
          </Card>

          {/* Alerts & Notifications */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-2 border-b border-gray-100">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-gray-400" />
                Alerts & Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-yellow-800">Pending Approvals</p>
                    <p className="text-xs text-yellow-700 mt-1">{adminStats.pendingApprovals} items need review</p>
                    <Button size="sm" variant="ghost" className="h-auto p-0 text-xs text-yellow-800 font-bold mt-2 hover:bg-transparent hover:underline">
                      Review Now &rarr;
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-blue-800">Unread Messages</p>
                    <p className="text-xs text-blue-700 mt-1">{adminStats.unreadMessages} new support messages</p>
                    <Button size="sm" variant="ghost" className="h-auto p-0 text-xs text-blue-800 font-bold mt-2 hover:bg-transparent hover:underline">
                      View Inbox &rarr;
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-green-800">System Backup</p>
                    <p className="text-xs text-green-700 mt-1">Completed successfully at 3:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-gray-100 shadow-sm bg-gray-900 text-white overflow-hidden relative">

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <CardHeader className="pb-4 relative z-10">
            <CardTitle className="text-lg font-bold text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 bg-white/10 border-white/10 text-white hover:bg-white/20 hover:border-white/20 transition-all border-dashed">
                <Users className="h-6 w-6" />
                <span className="text-sm font-medium">Add User</span>
              </Button>
              <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 bg-white/10 border-white/10 text-white hover:bg-white/20 hover:border-white/20 transition-all border-dashed">
                <Building className="h-6 w-6" />
                <span className="text-sm font-medium">Manage Partners</span>
              </Button>
              <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 bg-white/10 border-white/10 text-white hover:bg-white/20 hover:border-white/20 transition-all border-dashed">
                <FileText className="h-6 w-6" />
                <span className="text-sm font-medium">Create Page</span>
              </Button>
              <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 bg-white/10 border-white/10 text-white hover:bg-white/20 hover:border-white/20 transition-all border-dashed">
                <Settings className="h-6 w-6" />
                <span className="text-sm font-medium">Site Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}