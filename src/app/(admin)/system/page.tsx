'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Activity,
  Server,
  Database,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Shield,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

export default function SystemMonitoring() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Mock system data
  const systemHealth = {
    uptime: '99.8%',
    responseTime: 245,
    totalRequests: 1247892,
    errorRate: 0.12,
    lastIncident: '5 days ago',
    status: 'healthy'
  };

  const serverMetrics = {
    cpu: {
      usage: 45,
      cores: 8,
      temperature: 62,
      status: 'normal'
    },
    memory: {
      used: 6.2,
      total: 16,
      usage: 38.75,
      status: 'normal'
    },
    storage: {
      used: 250,
      total: 500,
      usage: 50,
      status: 'normal'
    },
    network: {
      inbound: 125.6,
      outbound: 89.2,
      connections: 1247,
      status: 'normal'
    }
  };

  const databaseMetrics = {
    queries: 15420,
    activeConnections: 24,
    slowQueries: 3,
    cacheHitRate: 94.8,
    size: 2.3,
    backupStatus: 'completed',
    lastBackup: '2 hours ago'
  };

  const trafficAnalytics = {
    pageViews: 45678,
    uniqueVisitors: 12456,
    bounceRate: 32.4,
    avgSessionDuration: 245,
    topPages: [
      { page: '/', views: 8750, percentage: 19.2 },
      { page: '/packages', views: 6420, percentage: 14.1 },
      { page: '/hotels', views: 5680, percentage: 12.4 },
      { page: '/about', views: 3210, percentage: 7.0 },
      { page: '/contact', views: 2890, percentage: 6.3 }
    ]
  };

  const securityAlerts = [
    {
      id: 1,
      type: 'info',
      message: 'SSL certificate renewed successfully',
      timestamp: '2 hours ago',
      severity: 'low'
    },
    {
      id: 2,
      type: 'warning',
      message: 'High number of failed login attempts detected',
      timestamp: '6 hours ago',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'success',
      message: 'Security scan completed - No vulnerabilities found',
      timestamp: '1 day ago',
      severity: 'low'
    }
  ];

  const errorLogs = [
    {
      id: 1,
      timestamp: '2024-12-18 14:32:15',
      level: 'error',
      message: 'Database connection timeout in payment module',
      source: 'api/payments',
      count: 1
    },
    {
      id: 2,
      timestamp: '2024-12-18 13:45:22',
      level: 'warning',
      message: 'Slow query detected: SELECT * FROM bookings',
      source: 'database',
      count: 3
    },
    {
      id: 3,
      timestamp: '2024-12-18 12:10:44',
      level: 'info',
      message: 'Backup completed successfully',
      source: 'scheduler',
      count: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'normal':
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'error':
      case 'critical':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'normal':
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideSearch />
      
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-2 md:px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">System Monitoring</h1>
              <p className="text-sm md:text-base text-gray-600">Monitor system health, performance, and analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="text-xs md:text-sm">
                  ← Back to Admin
                </Button>
              </Link>
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline" 
                size="sm" 
                className="text-xs md:text-sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Uptime</p>
                  <p className="text-lg font-bold text-green-600">{systemHealth.uptime}</p>
                </div>
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Response Time</p>
                  <p className="text-lg font-bold text-blue-600">{systemHealth.responseTime}ms</p>
                </div>
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Requests</p>
                  <p className="text-lg font-bold text-purple-600">{(systemHealth.totalRequests / 1000000).toFixed(1)}M</p>
                </div>
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Error Rate</p>
                  <p className="text-lg font-bold text-green-600">{systemHealth.errorRate}%</p>
                </div>
                <Shield className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <Badge className={getStatusColor(systemHealth.status)}>
                    {getStatusIcon(systemHealth.status)}
                    <span className="ml-1 capitalize">{systemHealth.status}</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Server Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="h-5 w-5" />
                Server Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* CPU */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <span className="text-sm font-bold">{serverMetrics.cpu.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${serverMetrics.cpu.usage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{serverMetrics.cpu.cores} cores</span>
                  <span>{serverMetrics.cpu.temperature}°C</span>
                </div>
              </div>

              {/* Memory */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Memory Usage</span>
                  </div>
                  <span className="text-sm font-bold">{serverMetrics.memory.usage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${serverMetrics.memory.usage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{serverMetrics.memory.used}GB used</span>
                  <span>{serverMetrics.memory.total}GB total</span>
                </div>
              </div>

              {/* Storage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Storage Usage</span>
                  </div>
                  <span className="text-sm font-bold">{serverMetrics.storage.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${serverMetrics.storage.usage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{serverMetrics.storage.used}GB used</span>
                  <span>{serverMetrics.storage.total}GB total</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{databaseMetrics.queries.toLocaleString()}</div>
                  <div className="text-xs text-blue-700">Total Queries</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{databaseMetrics.activeConnections}</div>
                  <div className="text-xs text-green-700">Active Connections</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cache Hit Rate</span>
                  <span className="font-bold text-green-600">{databaseMetrics.cacheHitRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database Size</span>
                  <span className="font-bold">{databaseMetrics.size}GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Slow Queries</span>
                  <Badge className="bg-yellow-100 text-yellow-700">{databaseMetrics.slowQueries}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Backup</span>
                  <Badge className="bg-green-100 text-green-700">{databaseMetrics.lastBackup}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Traffic Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{trafficAnalytics.pageViews.toLocaleString()}</div>
                  <div className="text-xs text-purple-700">Page Views</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{trafficAnalytics.uniqueVisitors.toLocaleString()}</div>
                  <div className="text-xs text-blue-700">Unique Visitors</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bounce Rate</span>
                  <span className="font-bold">{trafficAnalytics.bounceRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Session Duration</span>
                  <span className="font-bold">{Math.floor(trafficAnalytics.avgSessionDuration / 60)}m {trafficAnalytics.avgSessionDuration % 60}s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Top Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trafficAnalytics.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium truncate">{page.page}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{page.views.toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs">{page.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security & Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="mt-0.5">
                      {getStatusIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.timestamp}</p>
                    </div>
                    <Badge className={getStatusColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {errorLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="mt-0.5">
                      {getStatusIcon(log.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{log.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">{log.timestamp}</p>
                        <Badge variant="outline" className="text-xs">{log.source}</Badge>
                      </div>
                    </div>
                    {log.count > 1 && (
                      <Badge variant="outline" className="text-xs">
                        {log.count}x
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}