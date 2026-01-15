'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Globe,
  Calendar,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from 'lucide-react';

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('visitors');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalVisitors: 45678,
      visitorsChange: 12.5,
      pageViews: 125430,
      pageViewsChange: 8.3,
      bounceRate: 32.4,
      bounceRateChange: -2.1,
      avgSessionDuration: 245,
      durationChange: 15.2,
      conversionRate: 3.8,
      conversionChange: 0.7,
      revenue: 2847500,
      revenueChange: 22.1
    },
    traffic: {
      organic: { visitors: 28430, percentage: 62.3, change: 8.5 },
      direct: { visitors: 9134, percentage: 20.0, change: -3.2 },
      social: { visitors: 5456, percentage: 11.9, change: 25.8 },
      referral: { visitors: 1589, percentage: 3.5, change: 12.1 },
      email: { visitors: 1069, percentage: 2.3, change: 18.9 }
    },
    devices: {
      mobile: { users: 25678, percentage: 56.2, change: 15.3 },
      desktop: { users: 15432, percentage: 33.8, change: -5.1 },
      tablet: { users: 4568, percentage: 10.0, change: 8.7 }
    },
    topPages: [
      { page: '/', views: 18750, percentage: 14.9, bounce: 28.5, change: 12.3 },
      { page: '/hotels', views: 15420, percentage: 12.3, bounce: 35.2, change: 8.7 },
      { page: '/packages', views: 12680, percentage: 10.1, bounce: 42.1, change: 15.2 },
      { page: '/hotel-partners', views: 8930, percentage: 7.1, bounce: 25.8, change: -2.1 },
      { page: '/about', views: 6250, percentage: 5.0, bounce: 38.9, change: 6.8 }
    ],
    countries: [
      { country: 'Bangladesh', flag: '🇧🇩', visitors: 32156, percentage: 70.4 },
      { country: 'India', flag: '🇮🇳', visitors: 4567, percentage: 10.0 },
      { country: 'United States', flag: '🇺🇸', visitors: 2834, percentage: 6.2 },
      { country: 'United Kingdom', flag: '🇬🇧', visitors: 1923, percentage: 4.2 },
      { country: 'Canada', flag: '🇨🇦', visitors: 1456, percentage: 3.2 }
    ],
    realTime: {
      activeUsers: 1247,
      currentSessions: 892,
      pagesPerSession: 3.2,
      topActivePages: [
        { page: '/', activeUsers: 156 },
        { page: '/hotels', activeUsers: 89 },
        { page: '/packages', activeUsers: 67 },
        { page: '/hotel-partners', activeUsers: 45 }
      ]
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-3 w-3" />;
    if (change < 0) return <ArrowDownRight className="h-3 w-3" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideSearch />
      
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-2 md:px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="text-sm md:text-base text-gray-600">Track website performance and user behavior</p>
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
              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 3 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visitors">Visitors</SelectItem>
              <SelectItem value="pageviews">Page Views</SelectItem>
              <SelectItem value="sessions">Sessions</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div className={`flex items-center text-xs ${getChangeColor(analyticsData.overview.visitorsChange)}`}>
                  {getChangeIcon(analyticsData.overview.visitorsChange)}
                  {Math.abs(analyticsData.overview.visitorsChange)}%
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600">Visitors</p>
                <p className="text-lg font-bold text-gray-900">{analyticsData.overview.totalVisitors.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Eye className="h-5 w-5 text-green-600" />
                <div className={`flex items-center text-xs ${getChangeColor(analyticsData.overview.pageViewsChange)}`}>
                  {getChangeIcon(analyticsData.overview.pageViewsChange)}
                  {Math.abs(analyticsData.overview.pageViewsChange)}%
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600">Page Views</p>
                <p className="text-lg font-bold text-gray-900">{analyticsData.overview.pageViews.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingDown className="h-5 w-5 text-orange-600" />
                <div className={`flex items-center text-xs ${getChangeColor(analyticsData.overview.bounceRateChange)}`}>
                  {getChangeIcon(analyticsData.overview.bounceRateChange)}
                  {Math.abs(analyticsData.overview.bounceRateChange)}%
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600">Bounce Rate</p>
                <p className="text-lg font-bold text-gray-900">{analyticsData.overview.bounceRate}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <div className={`flex items-center text-xs ${getChangeColor(analyticsData.overview.durationChange)}`}>
                  {getChangeIcon(analyticsData.overview.durationChange)}
                  {Math.abs(analyticsData.overview.durationChange)}%
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600">Avg. Duration</p>
                <p className="text-lg font-bold text-gray-900">{Math.floor(analyticsData.overview.avgSessionDuration / 60)}m {analyticsData.overview.avgSessionDuration % 60}s</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <div className={`flex items-center text-xs ${getChangeColor(analyticsData.overview.conversionChange)}`}>
                  {getChangeIcon(analyticsData.overview.conversionChange)}
                  {Math.abs(analyticsData.overview.conversionChange)}%
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600">Conversion</p>
                <p className="text-lg font-bold text-gray-900">{analyticsData.overview.conversionRate}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div className={`flex items-center text-xs ${getChangeColor(analyticsData.overview.revenueChange)}`}>
                  {getChangeIcon(analyticsData.overview.revenueChange)}
                  {Math.abs(analyticsData.overview.revenueChange)}%
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600">Revenue</p>
                <p className="text-lg font-bold text-gray-900">৳{(analyticsData.overview.revenue / 100000).toFixed(1)}L</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analyticsData.traffic).map(([source, data]) => (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium capitalize">{source}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{data.percentage}%</span>
                      <span className="text-sm font-bold">{data.visitors.toLocaleString()}</span>
                      <div className={`flex items-center text-xs ${getChangeColor(data.change)}`}>
                        {getChangeIcon(data.change)}
                        {Math.abs(data.change)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analyticsData.devices).map(([device, data]) => {
                  const Icon = device === 'mobile' ? Smartphone : device === 'desktop' ? Monitor : Tablet;
                  return (
                    <div key={device} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium capitalize">{device}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${data.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{data.percentage}%</span>
                        <span className="text-sm font-bold w-16">{data.users.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Pages and Countries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium truncate">{page.page}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-center">
                        <div className="font-bold">{page.views.toLocaleString()}</div>
                        <div className="text-gray-500">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{page.bounce}%</div>
                        <div className="text-gray-500">Bounce</div>
                      </div>
                      <div className={`flex items-center ${getChangeColor(page.change)}`}>
                        {getChangeIcon(page.change)}
                        {Math.abs(page.change)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.countries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                        {country.flag}
                      </div>
                      <span className="text-sm font-medium">{country.country}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${country.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12">{country.percentage}%</span>
                      <span className="text-sm font-bold w-16">{country.visitors.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Real-time Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analyticsData.realTime.activeUsers.toLocaleString()}</div>
                <div className="text-sm text-green-700">Active Users</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analyticsData.realTime.currentSessions.toLocaleString()}</div>
                <div className="text-sm text-blue-700">Current Sessions</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{analyticsData.realTime.pagesPerSession}</div>
                <div className="text-sm text-purple-700">Pages/Session</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">Live</div>
                <div className="text-sm text-orange-700">Status</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Most Active Pages Right Now</h4>
              <div className="space-y-2">
                {analyticsData.realTime.topActivePages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{page.page}</span>
                    <Badge className="bg-green-100 text-green-700">
                      {page.activeUsers} active
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}