'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Ban, 
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function AdminTransportBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Mock transport booking data (expanded)
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
      customerEmail: 'rahman@email.com',
      totalAmount: 180,
      paidAmount: 180,
      remainingAmount: 0,
      passengers: 2,
      vehicleType: 'Standard CNG',
      driverName: 'Karim Ahmed',
      driverPhone: '01712345679',
      bookingDate: '2024-12-15T10:30:00Z',
      completedAt: '2024-12-15T14:45:00Z',
      paymentMethod: 'Mobile Banking',
      notes: 'Customer requested air freshener'
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
      customerEmail: 'fatima@email.com',
      totalAmount: 1600,
      paidAmount: 800,
      remainingAmount: 800,
      passengers: 2,
      busName: 'Green Line Paribahan',
      seats: ['A12', 'A13'],
      departureTime: '6:00 AM',
      arrivalTime: '12:00 PM',
      bookingDate: '2024-12-10T15:20:00Z',
      paymentMethod: 'Credit Card',
      notes: 'Window seats requested'
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
      customerEmail: 'hassan@email.com',
      totalAmount: 900,
      paidAmount: 450,
      remainingAmount: 450,
      passengers: 3,
      boatName: 'MV Sundarban',
      cabinType: 'Business Class',
      departureTime: '7:00 AM',
      arrivalTime: '5:00 PM',
      bookingDate: '2024-12-12T09:15:00Z',
      paymentMethod: 'Bank Transfer',
      notes: 'Family trip with elderly passenger'
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
      customerEmail: 'nasir@email.com',
      totalAmount: 220,
      paidAmount: 110,
      remainingAmount: 0,
      refundAmount: 110,
      passengers: 1,
      vehicleType: 'AC CNG',
      bookingDate: '2024-12-07T18:45:00Z',
      cancelledAt: '2024-12-08T09:00:00Z',
      cancelReason: 'Customer requested',
      refundDate: '2024-12-08T12:30:00Z',
      paymentMethod: 'Mobile Banking'
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
      customerEmail: 'sarah@email.com',
      totalAmount: 1200,
      paidAmount: 600,
      remainingAmount: 600,
      passengers: 1,
      busName: 'Royal Bengal Express',
      seats: ['B15'],
      departureTime: '11:00 PM',
      arrivalTime: '7:00 AM+1',
      bookingDate: '2024-12-13T14:20:00Z',
      paymentMethod: 'Credit Card',
      notes: 'Business trip - need receipt'
    },
    // Add more mock data for better demonstration
    {
      id: 'BOAT6789012345',
      type: 'boat',
      typeName: 'Boat Service',
      typeIcon: '⛵',
      from: 'Barisal',
      to: 'Patuakhali',
      date: '2024-12-22',
      time: '8:00 AM',
      status: 'upcoming',
      customerName: 'Mohammad Hasan',
      customerPhone: '01555666777',
      customerEmail: 'hasan@email.com',
      totalAmount: 600,
      paidAmount: 300,
      remainingAmount: 300,
      passengers: 2,
      boatName: 'MV Ostrich',
      cabinType: 'Economy Class',
      departureTime: '8:00 AM',
      arrivalTime: '2:00 PM',
      bookingDate: '2024-12-14T11:30:00Z',
      paymentMethod: 'Mobile Banking'
    }
  ];

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

  const filteredBookings = transportBookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.to.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesType = typeFilter === 'all' || booking.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const bookingsByType = {
    cng: filteredBookings.filter(b => b.type === 'cng'),
    bus: filteredBookings.filter(b => b.type === 'bus'),
    boat: filteredBookings.filter(b => b.type === 'boat')
  };

  const stats = {
    total: filteredBookings.length,
    upcoming: filteredBookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed').length,
    completed: filteredBookings.filter(b => b.status === 'completed').length,
    cancelled: filteredBookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: filteredBookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.paidAmount, 0),
    pendingPayments: filteredBookings.reduce((sum, b) => sum + (b.remainingAmount || 0), 0)
  };

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    // In real app, this would call an API
    alert(`Booking ${bookingId} status updated to ${newStatus}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    // In real app, this would call an API
    if (confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
      alert(`Booking ${bookingId} has been cancelled`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideSearch />
      
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div>
              <Link href="/admin/transport" className="text-blue-600 hover:underline text-sm">
                ← Back to Transport Management
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Transport Bookings</h1>
              <p className="text-gray-600">Manage all transport bookings and reservations</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.upcoming}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">৳{Math.round(stats.totalRevenue / 1000)}K</div>
              <div className="text-sm text-gray-600">Revenue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">৳{Math.round(stats.pendingPayments / 1000)}K</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by booking ID, customer name, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="cng">🛺 CNG</SelectItem>
                  <SelectItem value="bus">🚌 Bus</SelectItem>
                  <SelectItem value="boat">⛵ Boat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({filteredBookings.length})</TabsTrigger>
            <TabsTrigger value="cng">🛺 CNG ({bookingsByType.cng.length})</TabsTrigger>
            <TabsTrigger value="bus">🚌 Bus ({bookingsByType.bus.length})</TabsTrigger>
            <TabsTrigger value="boat">⛵ Boat ({bookingsByType.boat.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters.</p>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id} className={`${getTypeColor(booking.type)} border-2`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-2xl">{booking.typeIcon}</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">#{booking.id}</h3>
                              <p className="text-sm text-gray-600">{booking.typeName}</p>
                            </div>
                          </div>
                          <Badge className={`flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Customer
                            </h4>
                            <p className="text-sm text-gray-600">{booking.customerName}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {booking.customerPhone}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              Route
                            </h4>
                            <p className="text-sm text-gray-600">{booking.from} → {booking.to}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Journey
                            </h4>
                            <p className="text-sm text-gray-600">{booking.date}</p>
                            <p className="text-sm text-gray-600">{booking.time}</p>
                          </div>
                        </div>

                        {/* Type-specific details */}
                        {booking.type === 'cng' && booking.driverName && (
                          <div className="bg-green-50 p-3 rounded-lg mb-4">
                            <p className="text-sm"><span className="font-medium">Vehicle:</span> {booking.vehicleType}</p>
                            <p className="text-sm"><span className="font-medium">Driver:</span> {booking.driverName} ({booking.driverPhone})</p>
                          </div>
                        )}

                        {booking.type === 'bus' && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-4">
                            <p className="text-sm"><span className="font-medium">Bus:</span> {booking.busName}</p>
                            <p className="text-sm"><span className="font-medium">Seats:</span> {booking.seats?.join(', ')}</p>
                            <p className="text-sm"><span className="font-medium">Journey:</span> {booking.departureTime} - {booking.arrivalTime}</p>
                          </div>
                        )}

                        {booking.type === 'boat' && (
                          <div className="bg-cyan-50 p-3 rounded-lg mb-4">
                            <p className="text-sm"><span className="font-medium">Boat:</span> {booking.boatName}</p>
                            <p className="text-sm"><span className="font-medium">Cabin:</span> {booking.cabinType}</p>
                            <p className="text-sm"><span className="font-medium">Journey:</span> {booking.departureTime} - {booking.arrivalTime}</p>
                          </div>
                        )}
                      </div>

                      <div className="lg:w-80">
                        <div className="space-y-4">
                          {/* Payment Info */}
                          <div className="bg-white p-4 rounded-lg border">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              Payment Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Total Amount:</span>
                                <span className="font-semibold">৳{booking.totalAmount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Paid:</span>
                                <span className="text-green-600 font-medium">৳{booking.paidAmount.toLocaleString()}</span>
                              </div>
                              {booking.remainingAmount > 0 && (
                                <div className="flex justify-between">
                                  <span>Remaining:</span>
                                  <span className="text-orange-600 font-medium">৳{booking.remainingAmount.toLocaleString()}</span>
                                </div>
                              )}
                              {booking.refundAmount && (
                                <div className="flex justify-between">
                                  <span>Refunded:</span>
                                  <span className="text-purple-600 font-medium">৳{booking.refundAmount.toLocaleString()}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Payment Method:</span>
                                <span className="text-gray-600">{booking.paymentMethod}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="space-y-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => setSelectedBooking(booking)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                            </Dialog>

                            {booking.status === 'confirmed' && (
                              <Button 
                                size="sm" 
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleStatusUpdate(booking.id, 'completed')}
                              >
                                Mark as Completed
                              </Button>
                            )}
                            
                            {(booking.status === 'upcoming' || booking.status === 'confirmed') && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Cancel Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Individual transport type tabs */}
          {(['cng', 'bus', 'boat'] as const).map((transportType) => (
            <TabsContent key={transportType} value={transportType} className="space-y-4">
              {bookingsByType[transportType].length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="text-6xl mb-4">
                      {transportType === 'cng' && '🛺'}
                      {transportType === 'bus' && '🚌'}
                      {transportType === 'boat' && '⛵'}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No {transportType.toUpperCase()} bookings found
                    </h3>
                    <p className="text-gray-600">Try adjusting your search or filters.</p>
                  </CardContent>
                </Card>
              ) : (
                bookingsByType[transportType].map((booking) => (
                  <Card key={booking.id} className={`${getTypeColor(booking.type)} border-2`}>
                    <CardContent className="p-6">
                      {/* Same content as in "all" tab - for brevity, showing condensed version */}
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
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Booking Details Dialog */}
        {selectedBooking && (
          <Dialog>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Booking Details - #{selectedBooking.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Customer Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedBooking.customerName}</p>
                      <p><span className="font-medium">Phone:</span> {selectedBooking.customerPhone}</p>
                      <p><span className="font-medium">Email:</span> {selectedBooking.customerEmail}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Journey Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Route:</span> {selectedBooking.from} → {selectedBooking.to}</p>
                      <p><span className="font-medium">Date:</span> {selectedBooking.date}</p>
                      <p><span className="font-medium">Time:</span> {selectedBooking.time}</p>
                      <p><span className="font-medium">Passengers:</span> {selectedBooking.passengers}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Total Amount:</span> ৳{selectedBooking.totalAmount.toLocaleString()}</p>
                      <p><span className="font-medium">Paid Amount:</span> ৳{selectedBooking.paidAmount.toLocaleString()}</p>
                      <p><span className="font-medium">Remaining:</span> ৳{(selectedBooking.remainingAmount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Payment Method:</span> {selectedBooking.paymentMethod}</p>
                      <p><span className="font-medium">Booking Date:</span> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Footer />
    </div>
  );
}