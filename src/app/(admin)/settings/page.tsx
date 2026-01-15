'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Save,
  Globe,
  Palette,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Settings,
  Shield,
  Bell,
  CreditCard,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';

export default function WebsiteSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  // Mock settings data
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Amaghor',
      tagline: 'Your Gateway to Bangladesh Tourism',
      description: 'Discover the beauty of Bangladesh with our comprehensive travel and accommodation services.',
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.ico',
      language: 'bn',
      timezone: 'Asia/Dhaka',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true
    },
    contact: {
      email: 'info@amaghor.com',
      phone: '+880 1712345678',
      address: 'House 123, Road 456, Dhanmondi, Dhaka, Bangladesh',
      supportEmail: 'support@amaghor.com',
      bookingEmail: 'booking@amaghor.com',
      emergencyPhone: '+880 1987654321'
    },
    social: {
      facebook: 'https://facebook.com/amaghor',
      instagram: 'https://instagram.com/amaghor',
      twitter: 'https://twitter.com/amaghor',
      youtube: 'https://youtube.com/@amaghor',
      linkedin: 'https://linkedin.com/company/amaghor',
      whatsapp: '+8801712345678'
    },
    appearance: {
      primaryColor: '#16a34a',
      secondaryColor: '#1d4ed8',
      fontFamily: 'Inter',
      darkMode: false,
      rtlSupport: false,
      customCss: '',
      logoPosition: 'left',
      footerText: '© 2024 Amaghor. All rights reserved.'
    },
    payments: {
      currency: 'BDT',
      currencySymbol: '৳',
      bkashEnabled: true,
      nagadEnabled: true,
      cardPaymentsEnabled: true,
      sslcEnabled: true,
      paymentGateway: 'sslcommerz',
      taxRate: 5.0,
      serviceCharge: 2.5
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      bookingConfirmations: true,
      paymentAlerts: true,
      systemAlerts: true,
      marketingEmails: false,
      notificationEmail: 'admin@amaghor.com'
    },
    security: {
      twoFactorAuth: true,
      passwordMinLength: 8,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      ipWhitelist: '',
      sslEnabled: true,
      corsEnabled: true,
      apiRateLimit: 1000
    }
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Settings saved successfully!');
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideSearch />
      
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-2 md:px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Website Settings</h1>
              <p className="text-sm md:text-base text-gray-600">Configure your website's global settings and preferences</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="text-xs md:text-sm">
                  ← Back to Admin
                </Button>
              </Link>
              <Button 
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-xs md:text-sm px-4"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                      <Input
                        value={settings.general.siteName}
                        onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                        placeholder="Enter site name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <Select value={settings.general.language} onValueChange={(value) => handleInputChange('general', 'language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                    <Input
                      value={settings.general.tagline}
                      onChange={(e) => handleInputChange('general', 'tagline', e.target.value)}
                      placeholder="Enter site tagline"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Textarea
                      value={settings.general.description}
                      onChange={(e) => handleInputChange('general', 'description', e.target.value)}
                      placeholder="Enter site description"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Site Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <Select value={settings.general.timezone} onValueChange={(value) => handleInputChange('general', 'timezone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                          <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                        <p className="text-xs text-gray-500">Temporarily disable the website for maintenance</p>
                      </div>
                      <Switch
                        checked={settings.general.maintenanceMode}
                        onCheckedChange={(checked) => handleInputChange('general', 'maintenanceMode', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Allow User Registration</label>
                        <p className="text-xs text-gray-500">Allow new users to register on the website</p>
                      </div>
                      <Switch
                        checked={settings.general.allowRegistration}
                        onCheckedChange={(checked) => handleInputChange('general', 'allowRegistration', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Require Email Verification</label>
                        <p className="text-xs text-gray-500">Users must verify their email before accessing the site</p>
                      </div>
                      <Switch
                        checked={settings.general.requireEmailVerification}
                        onCheckedChange={(checked) => handleInputChange('general', 'requireEmailVerification', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Contact Settings */}
          {activeTab === 'contact' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Email</label>
                    <Input
                      type="email"
                      value={settings.contact.email}
                      onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                      placeholder="Enter primary email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input
                      value={settings.contact.phone}
                      onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                  <Textarea
                    value={settings.contact.address}
                    onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
                    placeholder="Enter business address"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                    <Input
                      type="email"
                      value={settings.contact.supportEmail}
                      onChange={(e) => handleInputChange('contact', 'supportEmail', e.target.value)}
                      placeholder="Enter support email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Booking Email</label>
                    <Input
                      type="email"
                      value={settings.contact.bookingEmail}
                      onChange={(e) => handleInputChange('contact', 'bookingEmail', e.target.value)}
                      placeholder="Enter booking email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                  <Input
                    value={settings.contact.emergencyPhone}
                    onChange={(e) => handleInputChange('contact', 'emergencyPhone', e.target.value)}
                    placeholder="Enter emergency phone number"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Media Settings */}
          {activeTab === 'social' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Facebook className="h-4 w-4 text-blue-600" />
                      Facebook
                    </label>
                    <Input
                      value={settings.social.facebook}
                      onChange={(e) => handleInputChange('social', 'facebook', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Instagram className="h-4 w-4 text-pink-600" />
                      Instagram
                    </label>
                    <Input
                      value={settings.social.instagram}
                      onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Twitter className="h-4 w-4 text-blue-400" />
                      Twitter
                    </label>
                    <Input
                      value={settings.social.twitter}
                      onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Youtube className="h-4 w-4 text-red-600" />
                      YouTube
                    </label>
                    <Input
                      value={settings.social.youtube}
                      onChange={(e) => handleInputChange('social', 'youtube', e.target.value)}
                      placeholder="https://youtube.com/@yourchannel"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Continue with other tabs... */}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 px-6"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}