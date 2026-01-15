'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Building,
  Search,
  Settings,
  Crown,
  TrendingUp,
  Package,
  Users,
  Calculator,
  FileBarChart,
  CreditCard,
  CheckCircle,
  XCircle,
  Save,
  RefreshCw
} from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  propertyType: string;
  location: string;
  joinedDate: string;
  status: 'active' | 'inactive' | 'pending';
  subscriptionTier: 'regular' | 'premium';
  features: {
    revenueAnalytics: boolean;
    accounts: boolean;
    inventoryManagement: boolean;
    employeeManagement: boolean;
    bookingData: boolean;
    taxManagement: boolean;
  };
}

const featureDescriptions = {
  revenueAnalytics: {
    name: 'Revenue Analytics',
    description: 'Advanced revenue tracking, forecasting, and financial reporting',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  accounts: {
    name: 'Financial Accounts',
    description: 'Comprehensive account management and financial tracking',
    icon: CreditCard,
    color: 'text-blue-600'
  },
  inventoryManagement: {
    name: 'Inventory Management',
    description: 'Track and manage hotel inventory, supplies, and assets',
    icon: Package,
    color: 'text-orange-600'
  },
  employeeManagement: {
    name: 'Employee Management',
    description: 'Staff scheduling, payroll, and HR management tools',
    icon: Users,
    color: 'text-purple-600'
  },
  bookingData: {
    name: 'Advanced Booking Data',
    description: 'Detailed booking analytics, trends, and performance metrics',
    icon: FileBarChart,
    color: 'text-indigo-600'
  },
  taxManagement: {
    name: 'Tax Management',
    description: 'Automated tax calculations, reporting, and compliance',
    icon: Calculator,
    color: 'text-red-600'
  }
};

export default function PMSFeaturesManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Mock partners data with PMS features
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Ahmed Rahman',
      email: 'ahmed@grandpalace.com',
      phone: '+880 1711-123456',
      propertyName: 'Grand Palace Hotel',
      propertyType: 'Hotel',
      location: 'Dhaka, Bangladesh',
      joinedDate: '2024-01-15',
      status: 'active',
      subscriptionTier: 'regular',
      features: {
        revenueAnalytics: false,
        accounts: false,
        inventoryManagement: false,
        employeeManagement: false,
        bookingData: false,
        taxManagement: false,
      }
    },
    {
      id: '2',
      name: 'Fatima Khan',
      email: 'fatima@greenvalley.com',
      phone: '+880 1722-234567',
      propertyName: 'Green Valley Resort',
      propertyType: 'Resort',
      location: 'Sylhet, Bangladesh',
      joinedDate: '2024-03-20',
      status: 'active',
      subscriptionTier: 'premium',
      features: {
        revenueAnalytics: true,
        accounts: false,
        inventoryManagement: true,
        employeeManagement: false,
        bookingData: true,
        taxManagement: false,
      }
    },
    {
      id: '3',
      name: 'Karim Hassan',
      email: 'karim@citycenter.com',
      phone: '+880 1733-345678',
      propertyName: 'City Center Boutique',
      propertyType: 'Boutique Hotel',
      location: 'Chittagong, Bangladesh',
      joinedDate: '2024-05-10',
      status: 'pending',
      subscriptionTier: 'regular',
      features: {
        revenueAnalytics: false,
        accounts: false,
        inventoryManagement: false,
        employeeManagement: false,
        bookingData: false,
        taxManagement: false,
      }
    },
    {
      id: '4',
      name: 'Nasir Ali',
      email: 'nasir@seasideinn.com',
      phone: '+880 1744-456789',
      propertyName: 'Seaside Inn',
      propertyType: 'Inn',
      location: 'Cox\'s Bazar, Bangladesh',
      joinedDate: '2024-06-15',
      status: 'active',
      subscriptionTier: 'regular',
      features: {
        revenueAnalytics: false,
        accounts: true,
        inventoryManagement: false,
        employeeManagement: true,
        bookingData: false,
        taxManagement: true,
      }
    }
  ]);

  const getFilteredPartners = () => {
    return partners.filter(partner => {
      const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          partner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          partner.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || partner.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTierColor = (tier: string) => {
    return tier === 'premium' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700';
  };

  const toggleFeature = (partnerId: string, feature: keyof Partner['features']) => {
    setPartners(partners.map(partner => 
      partner.id === partnerId 
        ? { 
            ...partner, 
            features: { 
              ...partner.features, 
              [feature]: !partner.features[feature] 
            } 
          }
        : partner
    ));
  };

  const enableAllFeatures = (partnerId: string) => {
    setPartners(partners.map(partner => 
      partner.id === partnerId 
        ? { 
            ...partner, 
            features: { 
              revenueAnalytics: true,
              accounts: true,
              inventoryManagement: true,
              employeeManagement: true,
              bookingData: true,
              taxManagement: true,
            } 
          }
        : partner
    ));
  };

  const disableAllFeatures = (partnerId: string) => {
    setPartners(partners.map(partner => 
      partner.id === partnerId 
        ? { 
            ...partner, 
            features: { 
              revenueAnalytics: false,
              accounts: false,
              inventoryManagement: false,
              employeeManagement: false,
              bookingData: false,
              taxManagement: false,
            } 
          }
        : partner
    ));
  };

  const saveChanges = async () => {
    setIsLoading(true);
    setSaveMessage('');
    
    try {
      // Save each partner's features to localStorage for testing
      // In production, this would be API calls
      partners.forEach(partner => {
        localStorage.setItem(
          `partner_features_${partner.id}`, 
          JSON.stringify(partner.features)
        );
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveMessage('Changes saved successfully! Partners can now see their updated features in PMS.');
    } catch (error) {
      setSaveMessage('Error saving changes. Please try again.');
    }
    
    setIsLoading(false);
    
    setTimeout(() => setSaveMessage(''), 5000);
  };

  const countEnabledFeatures = (features: Partner['features']) => {
    return Object.values(features).filter(Boolean).length;
  };

  // Load saved features from localStorage on component mount
  useEffect(() => {
    setPartners(currentPartners => 
      currentPartners.map(partner => {
        const savedFeatures = localStorage.getItem(`partner_features_${partner.id}`);
        if (savedFeatures) {
          try {
            return { ...partner, features: JSON.parse(savedFeatures) };
          } catch {
            return partner;
          }
        }
        return partner;
      })
    );
  }, []);

  const filteredPartners = getFilteredPartners();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideSearch />
      
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="h-6 w-6" />
                PMS Features Management
              </h1>
              <p className="text-sm md:text-base text-gray-600">Enable or disable pro features for hotel partners</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="text-xs md:text-sm">
                  ← Back to Admin
                </Button>
              </Link>
              <Button 
                onClick={saveChanges}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-xs md:text-sm px-4"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
          
          {saveMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {saveMessage}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Total Partners</p>
                  <p className="text-lg font-bold text-gray-900">{partners.length}</p>
                </div>
                <Building className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Active Partners</p>
                  <p className="text-lg font-bold text-green-600">{partners.filter(p => p.status === 'active').length}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Premium Users</p>
                  <p className="text-lg font-bold text-purple-600">{partners.filter(p => p.subscriptionTier === 'premium').length}</p>
                </div>
                <Crown className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Pro Features Active</p>
                  <p className="text-lg font-bold text-orange-600">
                    {partners.reduce((acc, p) => acc + countEnabledFeatures(p.features), 0)}
                  </p>
                </div>
                <Settings className="h-5 w-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search partners or properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-48"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Partners List */}
        <div className="space-y-6">
          {filteredPartners.map((partner) => (
            <Card key={partner.id}>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                      🏨
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{partner.name}</h3>
                      <p className="text-gray-600">{partner.propertyName}</p>
                      <p className="text-sm text-gray-500">{partner.email} • {partner.phone}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(partner.status)}>{partner.status}</Badge>
                        <Badge className={getTierColor(partner.subscriptionTier)}>
                          {partner.subscriptionTier === 'premium' ? '👑 Premium' : '📦 Regular'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {countEnabledFeatures(partner.features)}/6 features enabled
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => enableAllFeatures(partner.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      Enable All
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => disableAllFeatures(partner.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Disable All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(featureDescriptions).map(([featureKey, feature]) => {
                    const FeatureIcon = feature.icon;
                    const isEnabled = partner.features[featureKey as keyof Partner['features']];
                    
                    return (
                      <div key={featureKey} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 min-h-[80px]">
                        <div className={`p-2 rounded-lg ${isEnabled ? 'bg-green-100' : 'bg-gray-100'} flex-shrink-0`}>
                          <FeatureIcon className={`h-4 w-4 ${isEnabled ? feature.color : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm text-gray-900 leading-tight">{feature.name}</h4>
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={() => toggleFeature(partner.id, featureKey as keyof Partner['features'])}
                              className="ml-2 flex-shrink-0"
                            />
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredPartners.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No partners found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}