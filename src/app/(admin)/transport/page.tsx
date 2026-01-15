'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Truck, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Ban
} from 'lucide-react';

export default function AdminTransportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock transport booking data
  const transportBookings = [
    {
      id: 'CNG1234567890',
      type: 'cng',
      typeName: 'CNG Auto Rickshaw',
      typeIcon: '🛺',
      from: 'Dhanmondi',
      to: 'Gulshan',
      date: '2024-12-15',
      time: '2:30 PM',
      status: 'completed',
      customerName: 'Rahman Ahmed',
      customerPhone: '01712345678',
      totalAmount: 180,
      paidAmount: 180,
      remainingAmount: 0,
      passengers: 2,
      vehicleType: 'Standard CNG',
      driverName: 'Karim Ahmed',
      driverPhone: '01712345679',
      bookingDate: '2024-12-15',
      completedAt: '2024-12-15T14:45:00Z'
    },
    {
      id: 'BUS2345678901',
      type: 'bus',
      typeName: 'Bus Service',
      typeIcon: '🚌',
      from: 'Dhaka',
      to: 'Cox\'s Bazar',
      date: '2024-12-20',
      time: '6:00 AM',
      status: 'confirmed',
      customerName: 'Fatima Khan',
      customerPhone: '01887654321',
      totalAmount: 1600,
      paidAmount: 800,
      remainingAmount: 800,
      passengers: 2,
      busName: 'Green Line Paribahan',
      seats: ['A12', 'A13'],
      departureTime: '6:00 AM',
      arrivalTime: '12:00 PM',
      bookingDate: '2024-12-10'
    },
    {
      id: 'BOAT3456789012',
      type: 'boat',
      typeName: 'Boat Service',
      typeIcon: '⛵',
      from: 'Sadarghat (Dhaka)',
      to: 'Barisal',
      date: '2024-12-25',
      time: '7:00 AM',
      status: 'confirmed',
      customerName: 'Hassan Ali',
      customerPhone: '01765432109',
      totalAmount: 900,
      paidAmount: 450,
      remainingAmount: 450,
      passengers: 3,
      boatName: 'MV Sundarban',
      cabinType: 'Business Class',
      departureTime: '7:00 AM',
      arrivalTime: '5:00 PM',
      bookingDate: '2024-12-12'
    },
    {
      id: 'CNG4567890123',
      type: 'cng',
      typeName: 'CNG Auto Rickshaw',
      typeIcon: '🛺',
      from: 'Airport',
      to: 'New Market',
      date: '2024-12-08',
      time: '10:15 AM',
      status: 'cancelled',
      customerName: 'Nasir Ahmed',
      customerPhone: '01923456789',
      totalAmount: 220,
      paidAmount: 110,
      remainingAmount: 0,
      refundAmount: 110,
      passengers: 1,
      vehicleType: 'AC CNG',
      bookingDate: '2024-12-07',
      cancelledAt: '2024-12-08T09:00:00Z',
      cancelReason: 'Customer requested'
    },
    {
      id: 'BUS5678901234',
      type: 'bus',
      typeName: 'Bus Service',
      typeIcon: '🚌',
      from: 'Dhaka',
      to: 'Sylhet',
      date: '2024-12-18',
      time: '11:00 PM',
      status: 'upcoming',
      customerName: 'Sarah Khan',
      customerPhone: '01811122334',
      totalAmount: 1200,
      paidAmount: 600,
      remainingAmount: 600,
      passengers: 1,
      busName: 'Royal Bengal Express',
      seats: ['B15'],
      departureTime: '11:00 PM',
      arrivalTime: '7:00 AM+1',
      bookingDate: '2024-12-13'
    }
  ];

  const transportStats = {
    total: transportBookings.length,
    upcoming: transportBookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed').length,
    completed: transportBookings.filter(b => b.status === 'completed').length,
    cancelled: transportBookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: transportBookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.paidAmount, 0),
    pendingPayments: transportBookings.reduce((sum, b) => sum + (b.remainingAmount || 0), 0),
    cngBookings: transportBookings.filter(b => b.type === 'cng').length,
    busBookings: transportBookings.filter(b => b.type === 'bus').length,
    boatBookings: transportBookings.filter(b => b.type === 'boat').length
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'upcoming': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'upcoming': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cng': return 'bg-green-50 border-green-200';
      case 'bus': return 'bg-blue-50 border-blue-200';
      case 'boat': return 'bg-cyan-50 border-cyan-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const managementItems = [
    {
      title: 'Transport Types',
      description: 'Manage transport categories (CNG, Bus, Boat, Car)',
      icon: '🚗',
      href: '/admin/transport/types',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Vehicles',
      description: 'Manage all vehicles in your fleet',
      icon: '🚚',
      href: '/admin/transport/vehicles', 
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Drivers',
      description: 'Manage driver profiles and assignments',
      icon: '👨‍✈️',
      href: '/admin/transport/drivers',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      title: 'Routes & Fares',
      description: 'Manage routes and fare structures',
      icon: '🗺️',
      href: '/admin/transport/routes',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Assignments',
      description: 'Assign drivers and vehicles to routes',
      icon: '📋',
      href: '/admin/transport/assignments',
      color: 'bg-teal-50 border-teal-200'
    },
    {
      title: 'Bookings',
      description: 'View and manage all transport bookings',
      icon: '📊',
      href: '/admin/transport/bookings',
      color: 'bg-red-50 border-red-200'
    }
  ];

  const filteredBookings = transportBookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.to.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesType = typeFilter === 'all' || booking.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const recentBookings = transportBookings.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideSearch />
      
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div>
              <Link href="/admin" className="text-blue-600 hover:underline text-sm">
                ← Back to Admin Dashboard
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Transport Management</h1>
              <p className="text-gray-600">Manage all CNG, Bus, and Boat bookings</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Link href="/admin/transport/settings">
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  Transport Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{transportStats.total}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{transportStats.upcoming}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{transportStats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{transportStats.cancelled}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">৳{Math.round(transportStats.totalRevenue / 1000)}K</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">৳{Math.round(transportStats.pendingPayments / 1000)}K</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{transportStats.cngBookings}</div>
              <div className="text-sm text-gray-600">🛺 CNG</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{transportStats.busBookings}</div>
              <div className="text-sm text-gray-600">🚌 Bus</div>
            </CardContent>
          </Card>
        </div>

        {/* Transport Management Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {managementItems.map((item) => (
              <Link key={item.title} href={item.href}>
                <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${item.color} border-2`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{item.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/transport/bookings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">All Bookings</h3>
                    <p className="text-sm text-gray-600">View and manage all transport bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/transport/payments">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Payment Management</h3>
                    <p className="text-sm text-gray-600">Track payments and pending amounts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/transport/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-600">View transport booking analytics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Bookings */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Transport Bookings</CardTitle>
              <Link href="/admin/transport/bookings">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className={`p-4 rounded-lg border-2 ${getTypeColor(booking.type)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-xl">{booking.typeIcon}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">#{booking.id}</h4>
                        <p className="text-sm text-gray-600">{booking.customerName} • {booking.from} → {booking.to}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">৳{booking.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{booking.date}</div>
                      </div>
                      <Badge className={`flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transport Type Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🛺</span>
                CNG Auto Rickshaw
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Bookings:</span>
                  <span className="font-semibold">{transportStats.cngBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-semibold text-green-600">
                    ৳{transportBookings.filter(b => b.type === 'cng' && b.status !== 'cancelled').reduce((sum, b) => sum + b.paidAmount, 0).toLocaleString()}
                  </span>
                </div>
                <Link href="/admin/transport/bookings?type=cng">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage CNG Bookings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🚌</span>
                Bus Services
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Bookings:</span>
                  <span className="font-semibold">{transportStats.busBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-semibold text-blue-600">
                    ৳{transportBookings.filter(b => b.type === 'bus' && b.status !== 'cancelled').reduce((sum, b) => sum + b.paidAmount, 0).toLocaleString()}
                  </span>
                </div>
                <Link href="/admin/transport/bookings?type=bus">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Bus Bookings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-cyan-50">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⛵</span>
                Boat Services
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Bookings:</span>
                  <span className="font-semibold">{transportStats.boatBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-semibold text-cyan-600">
                    ৳{transportBookings.filter(b => b.type === 'boat' && b.status !== 'cancelled').reduce((sum, b) => sum + b.paidAmount, 0).toLocaleString()}
                  </span>
                </div>
                <Link href="/admin/transport/bookings?type=boat">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Boat Bookings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-orange-900">Pending Payments</p>
                    <p className="text-sm text-orange-700">৳{transportStats.pendingPayments.toLocaleString()} in outstanding payments</p>
                  </div>
                  <Link href="/admin/transport/payments">
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">Upcoming Journeys</p>
                    <p className="text-sm text-blue-700">{transportStats.upcoming} bookings need attention</p>
                  </div>
                  <Link href="/admin/transport/bookings?status=upcoming">
                    <Button size="sm" variant="outline">Review</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Booking System</span>
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment Gateway</span>
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>SMS Notifications</span>
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}