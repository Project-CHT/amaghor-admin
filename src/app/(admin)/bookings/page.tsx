'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Search,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  RefreshCw,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Users,
  Building,
  Package
} from 'lucide-react';

interface Booking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partnerName: string;
  partnerType: 'hotel' | 'restaurant' | 'transport' | 'tour_package';
  serviceName: string;
  bookingDate: string;
  checkIn?: string;
  checkOut?: string;
  guests: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'paid' | 'pending' | 'partial' | 'refunded';
  bookingStatus: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
  paymentMethod: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      bookingNumber: 'AMG-2024-001',
      customerName: 'Ahmed Hassan',
      customerEmail: 'ahmed.hassan@email.com',
      customerPhone: '+880-1711-123456',
      partnerName: 'Royal Palace Hotel',
      partnerType: 'hotel',
      serviceName: 'Deluxe Room - 2 Nights',
      bookingDate: '2024-01-15',
      checkIn: '2024-02-01',
      checkOut: '2024-02-03',
      guests: 2,
      totalAmount: 15000,
      paidAmount: 15000,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      paymentMethod: 'bKash',
      specialRequests: 'Late check-in requested',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      bookingNumber: 'AMG-2024-002',
      customerName: 'Fatima Rahman',
      customerEmail: 'fatima.rahman@email.com',
      customerPhone: '+880-1722-234567',
      partnerName: 'Adventure Tours BD',
      partnerType: 'tour_package',
      serviceName: 'Cox\'s Bazar Beach Tour - 3 Days',
      bookingDate: '2024-01-14',
      checkIn: '2024-02-15',
      checkOut: '2024-02-18',
      guests: 4,
      totalAmount: 32000,
      paidAmount: 16000,
      paymentStatus: 'partial',
      bookingStatus: 'confirmed',
      paymentMethod: 'Bank Transfer',
      specialRequests: 'Vegetarian meals preferred',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T16:45:00Z'
    },
    {
      id: '3',
      bookingNumber: 'AMG-2024-003',
      customerName: 'Mohammad Ali',
      customerEmail: 'mohammad.ali@email.com',
      customerPhone: '+880-1733-345678',
      partnerName: 'Green Valley Resort',
      partnerType: 'hotel',
      serviceName: 'Family Suite - 1 Night',
      bookingDate: '2024-01-13',
      checkIn: '2024-01-20',
      checkOut: '2024-01-21',
      guests: 3,
      totalAmount: 8500,
      paidAmount: 0,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      paymentMethod: 'Nagad',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z'
    },
    {
      id: '4',
      bookingNumber: 'AMG-2024-004',
      customerName: 'Rashida Begum',
      customerEmail: 'rashida.begum@email.com',
      customerPhone: '+880-1744-456789',
      partnerName: 'Taste of Bengal',
      partnerType: 'restaurant',
      serviceName: 'Traditional Bengali Dinner for 6',
      bookingDate: '2024-01-12',
      checkIn: '2024-01-18',
      guests: 6,
      totalAmount: 4500,
      paidAmount: 4500,
      paymentStatus: 'paid',
      bookingStatus: 'completed',
      paymentMethod: 'Card',
      specialRequests: 'Birthday celebration setup',
      createdAt: '2024-01-12T18:30:00Z',
      updatedAt: '2024-01-18T20:15:00Z'
    },
    {
      id: '5',
      bookingNumber: 'AMG-2024-005',
      customerName: 'Karim Uddin',
      customerEmail: 'karim.uddin@email.com',
      customerPhone: '+880-1755-567890',
      partnerName: 'City Express Transport',
      partnerType: 'transport',
      serviceName: 'Airport Transfer - Dhaka to Chittagong',
      bookingDate: '2024-01-11',
      checkIn: '2024-01-25',
      guests: 2,
      totalAmount: 2500,
      paidAmount: 2500,
      paymentStatus: 'refunded',
      bookingStatus: 'cancelled',
      paymentMethod: 'bKash',
      specialRequests: 'AC vehicle required',
      createdAt: '2024-01-11T12:00:00Z',
      updatedAt: '2024-01-24T08:30:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.bookingStatus === statusFilter;
    const matchesPayment = paymentFilter === 'all' || booking.paymentStatus === paymentFilter;
    const matchesPartnerType = partnerTypeFilter === 'all' || booking.partnerType === partnerTypeFilter;
    
    return matchesSearch && matchesStatus && matchesPayment && matchesPartnerType;
  });

  // Summary stats
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.bookingStatus === 'confirmed').length,
    pending: bookings.filter(b => b.bookingStatus === 'pending').length,
    completed: bookings.filter(b => b.bookingStatus === 'completed').length,
    cancelled: bookings.filter(b => b.bookingStatus === 'cancelled').length,
    totalRevenue: bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalAmount, 0),
    pendingPayments: bookings.filter(b => b.paymentStatus === 'pending').reduce((sum, b) => sum + b.totalAmount, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'no_show': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPartnerTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <Building className="h-4 w-4" />;
      case 'restaurant': return <Users className="h-4 w-4" />;
      case 'transport': return <MapPin className="h-4 w-4" />;
      case 'tour_package': return <Package className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, bookingStatus: newStatus as Booking['bookingStatus'] } : booking
    ));
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Booking Management</h1>
              <p className="text-sm md:text-base text-gray-600">Manage all customer bookings and reservations</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Total Bookings</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Confirmed</p>
                  <p className="text-xl font-bold text-green-600">{stats.confirmed}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Completed</p>
                  <p className="text-xl font-bold text-blue-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Cancelled</p>
                  <p className="text-xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">৳{(stats.totalRevenue / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Pending Pay.</p>
                  <p className="text-xl font-bold text-gray-900">৳{(stats.pendingPayments / 1000).toFixed(0)}K</p>
                </div>
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bookings by booking number, customer, partner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={partnerTypeFilter} onValueChange={setPartnerTypeFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="hotel">Hotels</SelectItem>
              <SelectItem value="restaurant">Restaurants</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="tour_package">Tour Packages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bookings ({filteredBookings.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Booking</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Dates</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-blue-600">{booking.bookingNumber}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">{booking.customerName}</div>
                          <div className="text-sm text-gray-500 truncate flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {booking.customerEmail}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {booking.customerPhone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{booking.serviceName}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            {getPartnerTypeIcon(booking.partnerType)}
                            <span className="truncate">{booking.partnerName}</span>
                          </div>
                          <div className="text-xs text-gray-400 capitalize">
                            {booking.partnerType.replace('_', ' ')}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        {booking.checkIn && booking.checkOut ? (
                          <div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                            </div>
                          </div>
                        ) : booking.checkIn ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            Service: {new Date(booking.checkIn).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="text-gray-400">-</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">৳{booking.totalAmount.toLocaleString()}</div>
                          {booking.paidAmount > 0 && booking.paidAmount < booking.totalAmount && (
                            <div className="text-sm text-orange-600">
                              Paid: ৳{booking.paidAmount.toLocaleString()}
                            </div>
                          )}
                          <div className="text-xs text-gray-500">{booking.paymentMethod}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getStatusColor(booking.bookingStatus)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(booking.bookingStatus)}
                          {booking.bookingStatus}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getPaymentStatusColor(booking.paymentStatus)} w-fit`}>
                          {booking.paymentStatus}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsDetailDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select onValueChange={(value) => handleStatusChange(booking.id, value)}>
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                              <SelectItem value="no_show">No Show</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Booking Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Booking Details: {selectedBooking?.bookingNumber}</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <Label className="text-sm text-gray-600">Name</Label>
                      <p className="font-medium">{selectedBooking.customerName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Email</Label>
                      <p className="font-medium">{selectedBooking.customerEmail}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Phone</Label>
                      <p className="font-medium">{selectedBooking.customerPhone}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Guests</Label>
                      <p className="font-medium">{selectedBooking.guests} person{selectedBooking.guests > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Service Information</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <Label className="text-sm text-gray-600">Service</Label>
                      <p className="font-medium">{selectedBooking.serviceName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Partner</Label>
                      <p className="font-medium">{selectedBooking.partnerName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Service Type</Label>
                      <p className="font-medium capitalize">{selectedBooking.partnerType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Booking Date</Label>
                      <p className="font-medium">{new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                    </div>
                    {selectedBooking.checkIn && (
                      <>
                        <div>
                          <Label className="text-sm text-gray-600">Check-in</Label>
                          <p className="font-medium">{new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                        </div>
                        {selectedBooking.checkOut && (
                          <div>
                            <Label className="text-sm text-gray-600">Check-out</Label>
                            <p className="font-medium">{new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <Label className="text-sm text-gray-600">Total Amount</Label>
                      <p className="font-medium text-xl">৳{selectedBooking.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Paid Amount</Label>
                      <p className="font-medium text-xl text-green-600">৳{selectedBooking.paidAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Payment Method</Label>
                      <p className="font-medium">{selectedBooking.paymentMethod}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Payment Status</Label>
                      <Badge className={`${getPaymentStatusColor(selectedBooking.paymentStatus)} w-fit`}>
                        {selectedBooking.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Booking Status</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <Label className="text-sm text-gray-600">Current Status</Label>
                      <Badge className={`${getStatusColor(selectedBooking.bookingStatus)} flex items-center gap-1 w-fit mt-1`}>
                        {getStatusIcon(selectedBooking.bookingStatus)}
                        {selectedBooking.bookingStatus}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Last Updated</Label>
                      <p className="font-medium">{new Date(selectedBooking.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Special Requests</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    Close
                  </Button>
                  <Button>
                    Edit Booking
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
}