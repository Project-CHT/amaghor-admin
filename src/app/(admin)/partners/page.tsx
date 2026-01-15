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
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  MoreHorizontal,
  Building
} from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'transport' | 'tour_operator';
  email: string;
  phone: string;
  location: string;
  website?: string;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  rating: number;
  totalBookings: number;
  revenue: number;
  joinedDate: string;
  lastActivity: string;
  commission: number;
  documents: {
    license: boolean;
    taxCertificate: boolean;
    insurance: boolean;
  };
  enabledFeatures: {
    revenueAnalytics: boolean;
    accounts: boolean;
    inventoryManagement: boolean;
    employeeManagement: boolean;
    bookingData: boolean;
    taxManagement: boolean;
  };
}

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Royal Palace Hotel',
      type: 'hotel',
      email: 'admin@royalpalace.com',
      phone: '+880-1711-123456',
      location: 'Dhaka, Bangladesh',
      website: 'www.royalpalace.com',
      status: 'active',
      rating: 4.8,
      totalBookings: 1547,
      revenue: 2840000,
      joinedDate: '2023-01-15',
      lastActivity: '2024-01-15',
      commission: 15,
      documents: {
        license: true,
        taxCertificate: true,
        insurance: true
      },
      enabledFeatures: {
        revenueAnalytics: false,
        accounts: false,
        inventoryManagement: false,
        employeeManagement: false,
        bookingData: false,
        taxManagement: false
      }
    },
    {
      id: '2',
      name: 'Green Valley Resort',
      type: 'hotel',
      email: 'info@greenvalley.com',
      phone: '+880-1722-234567',
      location: 'Sylhet, Bangladesh',
      website: 'www.greenvalley.com',
      status: 'active',
      rating: 4.6,
      totalBookings: 892,
      revenue: 1650000,
      joinedDate: '2023-03-20',
      lastActivity: '2024-01-14',
      commission: 12,
      documents: {
        license: true,
        taxCertificate: true,
        insurance: false
      },
      enabledFeatures: {
        revenueAnalytics: true,
        accounts: false,
        inventoryManagement: false,
        employeeManagement: false,
        bookingData: false,
        taxManagement: false
      }
    },
    {
      id: '3',
      name: 'City Express Transport',
      type: 'transport',
      email: 'booking@cityexpress.com',
      phone: '+880-1733-345678',
      location: 'Chittagong, Bangladesh',
      status: 'pending',
      rating: 0,
      totalBookings: 0,
      revenue: 0,
      joinedDate: '2024-01-10',
      lastActivity: '2024-01-12',
      commission: 10,
      documents: {
        license: true,
        taxCertificate: false,
        insurance: false
      },
      enabledFeatures: {
        revenueAnalytics: false,
        accounts: false,
        inventoryManagement: false,
        employeeManagement: false,
        bookingData: false,
        taxManagement: false
      }
    },
    {
      id: '4',
      name: 'Taste of Bengal',
      type: 'restaurant',
      email: 'orders@tastebengal.com',
      phone: '+880-1744-456789',
      location: 'Dhaka, Bangladesh',
      website: 'www.tastebengal.com',
      status: 'suspended',
      rating: 4.2,
      totalBookings: 234,
      revenue: 125000,
      joinedDate: '2023-08-12',
      lastActivity: '2024-01-05',
      commission: 8,
      documents: {
        license: true,
        taxCertificate: true,
        insurance: true
      },
      enabledFeatures: {
        revenueAnalytics: false,
        accounts: false,
        inventoryManagement: false,
        employeeManagement: false,
        bookingData: false,
        taxManagement: false
      }
    },
    {
      id: '5',
      name: 'Adventure Tours BD',
      type: 'tour_operator',
      email: 'contact@adventurebd.com',
      phone: '+880-1755-567890',
      location: 'Bandarban, Bangladesh',
      website: 'www.adventurebd.com',
      status: 'active',
      rating: 4.9,
      totalBookings: 678,
      revenue: 980000,
      joinedDate: '2023-05-08',
      lastActivity: '2024-01-15',
      commission: 18,
      documents: {
        license: true,
        taxCertificate: true,
        insurance: true
      },
      enabledFeatures: {
        revenueAnalytics: false,
        accounts: false,
        inventoryManagement: false,
        employeeManagement: false,
        bookingData: false,
        taxManagement: false
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter partners based on search and filters
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
    const matchesType = typeFilter === 'all' || partner.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'suspended': return <AlertCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <Building className="h-4 w-4" />;
      case 'restaurant': return <Users className="h-4 w-4" />;
      case 'transport': return <Globe className="h-4 w-4" />;
      case 'tour_operator': return <MapPin className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (partnerId: string, newStatus: string) => {
    setPartners(partners.map(partner => 
      partner.id === partnerId ? { ...partner, status: newStatus as Partner['status'] } : partner
    ));
  };

  const handleDeletePartner = (partnerId: string) => {
    setPartners(partners.filter(partner => partner.id !== partnerId));
  };

  const handleFeatureToggle = (partnerId: string, featureName: keyof Partner['enabledFeatures'], enabled: boolean) => {
    setPartners(partners.map(partner => 
      partner.id === partnerId ? {
        ...partner,
        enabledFeatures: {
          ...partner.enabledFeatures,
          [featureName]: enabled
        }
      } : partner
    ));
  };

  // Summary stats
  const stats = {
    total: partners.length,
    active: partners.filter(p => p.status === 'active').length,
    pending: partners.filter(p => p.status === 'pending').length,
    suspended: partners.filter(p => p.status === 'suspended').length,
    totalRevenue: partners.reduce((sum, p) => sum + p.revenue, 0),
    totalBookings: partners.reduce((sum, p) => sum + p.totalBookings, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideSearch />
      
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-2 md:px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Partner Management</h1>
              <p className="text-sm md:text-base text-gray-600">Manage hotels, restaurants, transport & tour operators</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="text-xs md:text-sm">
                  ← Back to Admin
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs md:text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Partner
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Partner</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Partner Name</Label>
                      <Input id="name" placeholder="Enter partner name" />
                    </div>
                    <div>
                      <Label htmlFor="type">Partner Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="tour_operator">Tour Operator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="partner@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="+880-xxxx-xxxxxx" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="City, Country" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input id="website" placeholder="www.example.com" />
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddDialogOpen(false)}>
                        Add Partner
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Total Partners</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Building className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Active</p>
                  <p className="text-xl font-bold text-green-600">{stats.active}</p>
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
                  <p className="text-xs text-gray-600">Suspended</p>
                  <p className="text-xl font-bold text-red-600">{stats.suspended}</p>
                </div>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">৳{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                </div>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Bookings</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hotel">Hotels</SelectItem>
              <SelectItem value="restaurant">Restaurants</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="tour_operator">Tour Operators</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Partners List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Partners ({filteredPartners.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Partner</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Performance</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartners.map((partner) => (
                    <tr key={partner.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{partner.name}</div>
                          <div className="text-sm text-gray-500 truncate flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {partner.location}
                          </div>
                          {partner.rating > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-gray-600">{partner.rating}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(partner.type)}
                          <span className="text-sm capitalize">{partner.type.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getStatusColor(partner.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(partner.status)}
                          {partner.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-32">{partner.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{partner.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="space-y-1">
                          <div>Bookings: <span className="font-medium">{partner.totalBookings}</span></div>
                          <div>Revenue: <span className="font-medium">৳{(partner.revenue / 1000).toFixed(0)}K</span></div>
                          <div>Commission: <span className="font-medium">{partner.commission}%</span></div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div>
                          <div>{new Date(partner.joinedDate).toLocaleDateString()}</div>
                          <div className="text-xs">Last: {new Date(partner.lastActivity).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPartner(partner);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Select onValueChange={(value) => handleStatusChange(partner.id, value)}>
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePartner(partner.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Partner Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Partner: {selectedPartner?.name}</DialogTitle>
            </DialogHeader>
            {selectedPartner && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Partner Name</Label>
                  <Input id="edit-name" defaultValue={selectedPartner.name} />
                </div>
                <div>
                  <Label htmlFor="edit-commission">Commission %</Label>
                  <Input id="edit-commission" type="number" defaultValue={selectedPartner.commission} />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedPartner.email} />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input id="edit-phone" defaultValue={selectedPartner.phone} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input id="edit-location" defaultValue={selectedPartner.location} />
                </div>
                <div className="col-span-2">
                  <Label>Document Status</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="license" defaultChecked={selectedPartner.documents.license} />
                      <label htmlFor="license" className="text-sm">Business License</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="tax" defaultChecked={selectedPartner.documents.taxCertificate} />
                      <label htmlFor="tax" className="text-sm">Tax Certificate</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="insurance" defaultChecked={selectedPartner.documents.insurance} />
                      <label htmlFor="insurance" className="text-sm">Insurance</label>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Premium Features Access</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="revenueAnalytics" 
                        defaultChecked={selectedPartner.enabledFeatures.revenueAnalytics}
                        onChange={(e) => handleFeatureToggle(selectedPartner.id, 'revenueAnalytics', e.target.checked)}
                      />
                      <label htmlFor="revenueAnalytics" className="text-sm">Revenue Analytics</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="accounts" 
                        defaultChecked={selectedPartner.enabledFeatures.accounts}
                        onChange={(e) => handleFeatureToggle(selectedPartner.id, 'accounts', e.target.checked)}
                      />
                      <label htmlFor="accounts" className="text-sm">Accounts Management</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="inventoryManagement" 
                        defaultChecked={selectedPartner.enabledFeatures.inventoryManagement}
                        onChange={(e) => handleFeatureToggle(selectedPartner.id, 'inventoryManagement', e.target.checked)}
                      />
                      <label htmlFor="inventoryManagement" className="text-sm">Inventory Management</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="employeeManagement" 
                        defaultChecked={selectedPartner.enabledFeatures.employeeManagement}
                        onChange={(e) => handleFeatureToggle(selectedPartner.id, 'employeeManagement', e.target.checked)}
                      />
                      <label htmlFor="employeeManagement" className="text-sm">Employee Management</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="bookingData" 
                        defaultChecked={selectedPartner.enabledFeatures.bookingData}
                        onChange={(e) => handleFeatureToggle(selectedPartner.id, 'bookingData', e.target.checked)}
                      />
                      <label htmlFor="bookingData" className="text-sm">Advanced Booking Data</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="taxManagement" 
                        defaultChecked={selectedPartner.enabledFeatures.taxManagement}
                        onChange={(e) => handleFeatureToggle(selectedPartner.id, 'taxManagement', e.target.checked)}
                      />
                      <label htmlFor="taxManagement" className="text-sm">Tax Management</label>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsEditDialogOpen(false)}>
                    Save Changes
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