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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Users,
  Activity,
  Download,
  RefreshCw,
  Settings,
  Ban,
  UserX,
  Calendar,
  MapPin
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login_success' | 'login_failed' | 'suspicious_activity' | 'data_breach' | 'account_locked' | 'permission_change' | 'password_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  email: string;
  action: string;
  ipAddress: string;
  location: string;
  device: string;
  userAgent: string;
  timestamp: string;
  resolved: boolean;
  description: string;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordComplexity: boolean;
  sessionTimeout: number;
  loginAttempts: number;
  ipWhitelist: boolean;
  encryptionEnabled: boolean;
  auditLogging: boolean;
  failedLoginNotifications: boolean;
  dataBackupEncryption: boolean;
  gdprCompliance: boolean;
}

export default function Security() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login_failed',
      severity: 'medium',
      user: 'Unknown User',
      email: 'suspicious@example.com',
      action: 'Failed Login Attempt',
      ipAddress: '192.168.1.100',
      location: 'Dhaka, Bangladesh',
      device: 'Desktop',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '2024-01-15T14:30:00Z',
      resolved: false,
      description: 'Multiple failed login attempts detected from this IP address'
    },
    {
      id: '2',
      type: 'suspicious_activity',
      severity: 'high',
      user: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      action: 'Unusual Login Location',
      ipAddress: '203.112.58.23',
      location: 'Mumbai, India',
      device: 'Mobile',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
      timestamp: '2024-01-15T10:15:00Z',
      resolved: true,
      description: 'Login from unusual geographical location detected'
    },
    {
      id: '3',
      type: 'login_success',
      severity: 'low',
      user: 'Admin User',
      email: 'admin@amaghor.com',
      action: 'Successful Admin Login',
      ipAddress: '192.168.1.50',
      location: 'Dhaka, Bangladesh',
      device: 'Desktop',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome',
      timestamp: '2024-01-15T09:00:00Z',
      resolved: true,
      description: 'Administrator successfully logged in'
    },
    {
      id: '4',
      type: 'account_locked',
      severity: 'medium',
      user: 'Mohammad Ali',
      email: 'mohammad.ali@email.com',
      action: 'Account Temporarily Locked',
      ipAddress: '58.65.157.89',
      location: 'Chittagong, Bangladesh',
      device: 'Desktop',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '2024-01-14T16:45:00Z',
      resolved: false,
      description: 'Account locked due to 5 consecutive failed login attempts'
    },
    {
      id: '5',
      type: 'permission_change',
      severity: 'high',
      user: 'Super Admin',
      email: 'superadmin@amaghor.com',
      action: 'User Permissions Modified',
      ipAddress: '192.168.1.10',
      location: 'Dhaka, Bangladesh',
      device: 'Desktop',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '2024-01-14T11:20:00Z',
      resolved: true,
      description: 'Admin permissions granted to new user account'
    },
    {
      id: '6',
      type: 'data_breach',
      severity: 'critical',
      user: 'System Alert',
      email: 'system@amaghor.com',
      action: 'Potential Data Access Attempt',
      ipAddress: '45.76.123.45',
      location: 'Unknown',
      device: 'Unknown',
      userAgent: 'Automated Script/Bot',
      timestamp: '2024-01-13T22:30:00Z',
      resolved: false,
      description: 'Unauthorized attempt to access sensitive customer data detected'
    }
  ]);

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    passwordComplexity: true,
    sessionTimeout: 30,
    loginAttempts: 5,
    ipWhitelist: false,
    encryptionEnabled: true,
    auditLogging: true,
    failedLoginNotifications: true,
    dataBackupEncryption: true,
    gdprCompliance: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [resolvedFilter, setResolvedFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter events
  const filteredEvents = securityEvents.filter(event => {
    const matchesSearch = event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.ipAddress.includes(searchTerm) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    const matchesResolved = resolvedFilter === 'all' || 
                           (resolvedFilter === 'resolved' && event.resolved) ||
                           (resolvedFilter === 'unresolved' && !event.resolved);
    
    return matchesSearch && matchesSeverity && matchesType && matchesResolved;
  });

  // Summary stats
  const stats = {
    totalEvents: securityEvents.length,
    critical: securityEvents.filter(e => e.severity === 'critical').length,
    high: securityEvents.filter(e => e.severity === 'high').length,
    medium: securityEvents.filter(e => e.severity === 'medium').length,
    low: securityEvents.filter(e => e.severity === 'low').length,
    unresolved: securityEvents.filter(e => !e.resolved).length,
    resolved: securityEvents.filter(e => e.resolved).length,
    failedLogins: securityEvents.filter(e => e.type === 'login_failed').length
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'login_success': return 'bg-green-100 text-green-800';
      case 'login_failed': return 'bg-red-100 text-red-800';
      case 'suspicious_activity': return 'bg-orange-100 text-orange-800';
      case 'data_breach': return 'bg-red-100 text-red-800';
      case 'account_locked': return 'bg-yellow-100 text-yellow-800';
      case 'permission_change': return 'bg-blue-100 text-blue-800';
      case 'password_change': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldAlert className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Shield className="h-4 w-4" />;
      case 'low': return <ShieldCheck className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const handleResolveEvent = (eventId: string) => {
    setSecurityEvents(securityEvents.map(event => 
      event.id === eventId ? { ...event, resolved: true } : event
    ));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleSettingsChange = (key: keyof SecuritySettings, value: boolean | number) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideSearch />
      
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-2 md:px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Security Center</h1>
              <p className="text-sm md:text-base text-gray-600">Monitor security events and manage system security settings</p>
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
              <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs md:text-sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Security Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Authentication Settings */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Authentication & Access</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label className="font-medium">Two-Factor Authentication</Label>
                            <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                          </div>
                          <Switch
                            checked={securitySettings.twoFactorAuth}
                            onCheckedChange={(checked) => handleSettingsChange('twoFactorAuth', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label className="font-medium">Password Complexity</Label>
                            <p className="text-sm text-gray-600">Enforce strong password requirements</p>
                          </div>
                          <Switch
                            checked={securitySettings.passwordComplexity}
                            onCheckedChange={(checked) => handleSettingsChange('passwordComplexity', checked)}
                          />
                        </div>

                        <div className="p-3 border rounded-lg">
                          <Label className="font-medium">Session Timeout (minutes)</Label>
                          <Input
                            type="number"
                            value={securitySettings.sessionTimeout}
                            onChange={(e) => handleSettingsChange('sessionTimeout', parseInt(e.target.value))}
                            className="mt-2 w-32"
                          />
                        </div>

                        <div className="p-3 border rounded-lg">
                          <Label className="font-medium">Max Login Attempts</Label>
                          <Input
                            type="number"
                            value={securitySettings.loginAttempts}
                            onChange={(e) => handleSettingsChange('loginAttempts', parseInt(e.target.value))}
                            className="mt-2 w-32"
                          />
                        </div>
                      </div>
                    </div>

                    {/* System Security */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">System Security</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label className="font-medium">IP Whitelisting</Label>
                            <p className="text-sm text-gray-600">Restrict access to approved IP addresses</p>
                          </div>
                          <Switch
                            checked={securitySettings.ipWhitelist}
                            onCheckedChange={(checked) => handleSettingsChange('ipWhitelist', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label className="font-medium">Data Encryption</Label>
                            <p className="text-sm text-gray-600">Encrypt sensitive data at rest</p>
                          </div>
                          <Switch
                            checked={securitySettings.encryptionEnabled}
                            onCheckedChange={(checked) => handleSettingsChange('encryptionEnabled', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label className="font-medium">Audit Logging</Label>
                            <p className="text-sm text-gray-600">Log all administrative actions</p>
                          </div>
                          <Switch
                            checked={securitySettings.auditLogging}
                            onCheckedChange={(checked) => handleSettingsChange('auditLogging', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notifications & Compliance */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Notifications & Compliance</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label className="font-medium">Failed Login Notifications</Label>
                            <p className="text-sm text-gray-600">Alert admins of failed login attempts</p>
                          </div>
                          <Switch
                            checked={securitySettings.failedLoginNotifications}
                            onCheckedChange={(checked) => handleSettingsChange('failedLoginNotifications', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label className="font-medium">Backup Encryption</Label>
                            <p className="text-sm text-gray-600">Encrypt all data backups</p>
                          </div>
                          <Switch
                            checked={securitySettings.dataBackupEncryption}
                            onCheckedChange={(checked) => handleSettingsChange('dataBackupEncryption', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label className="font-medium">GDPR Compliance</Label>
                            <p className="text-sm text-gray-600">Enable GDPR compliance features</p>
                          </div>
                          <Switch
                            checked={securitySettings.gdprCompliance}
                            onCheckedChange={(checked) => handleSettingsChange('gdprCompliance', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsSettingsDialogOpen(false)}>
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Total Events</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalEvents}</p>
                </div>
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Critical</p>
                  <p className="text-xl font-bold text-red-600">{stats.critical}</p>
                </div>
                <ShieldAlert className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">High</p>
                  <p className="text-xl font-bold text-orange-600">{stats.high}</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Medium</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.medium}</p>
                </div>
                <Shield className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Low</p>
                  <p className="text-xl font-bold text-green-600">{stats.low}</p>
                </div>
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Unresolved</p>
                  <p className="text-xl font-bold text-red-600">{stats.unresolved}</p>
                </div>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Resolved</p>
                  <p className="text-xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Failed Logins</p>
                  <p className="text-xl font-bold text-red-600">{stats.failedLogins}</p>
                </div>
                <UserX className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by user, email, action, IP address, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="login_success">Login Success</SelectItem>
              <SelectItem value="login_failed">Login Failed</SelectItem>
              <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
              <SelectItem value="data_breach">Data Breach</SelectItem>
              <SelectItem value="account_locked">Account Locked</SelectItem>
              <SelectItem value="permission_change">Permission Change</SelectItem>
              <SelectItem value="password_change">Password Change</SelectItem>
            </SelectContent>
          </Select>

          <Select value={resolvedFilter} onValueChange={setResolvedFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="unresolved">Unresolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Security Events Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security Events ({filteredEvents.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Severity</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Location & Device</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">IP Address</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <Badge className={`${getSeverityColor(event.severity)} flex items-center gap-1 w-fit border`}>
                          {getSeverityIcon(event.severity)}
                          {event.severity}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">{event.action}</div>
                          <Badge className={`${getTypeColor(event.type)} w-fit mt-1 text-xs`}>
                            {event.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">{event.user}</div>
                          <div className="text-sm text-gray-500 truncate">{event.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            {getDeviceIcon(event.device)}
                            <span>{event.device}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-sm text-gray-900">{event.ipAddress}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div>
                          <div>{new Date(event.timestamp).toLocaleDateString()}</div>
                          <div className="text-xs">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {event.resolved ? (
                          <Badge className="bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                            <CheckCircle className="h-3 w-3" />
                            Resolved
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsDetailDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!event.resolved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolveEvent(event.id)}
                              className="text-xs"
                            >
                              Resolve
                            </Button>
                          )}
                          {event.type === 'login_failed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs text-red-600"
                            >
                              <Ban className="h-3 w-3 mr-1" />
                              Block IP
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Event Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Security Event Details</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-6">
                {/* Event Overview */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Event Overview</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <Label className="text-sm text-gray-600">Event Type</Label>
                      <Badge className={`${getTypeColor(selectedEvent.type)} w-fit mt-1`}>
                        {selectedEvent.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Severity Level</Label>
                      <Badge className={`${getSeverityColor(selectedEvent.severity)} flex items-center gap-1 w-fit mt-1 border`}>
                        {getSeverityIcon(selectedEvent.severity)}
                        {selectedEvent.severity}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Action</Label>
                      <p className="font-medium">{selectedEvent.action}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Status</Label>
                      {selectedEvent.resolved ? (
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1 w-fit mt-1">
                          <CheckCircle className="h-3 w-3" />
                          Resolved
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 flex items-center gap-1 w-fit mt-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">User Information</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <Label className="text-sm text-gray-600">User</Label>
                      <p className="font-medium">{selectedEvent.user}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Email</Label>
                      <p className="font-medium">{selectedEvent.email}</p>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Technical Details</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <Label className="text-sm text-gray-600">IP Address</Label>
                      <p className="font-mono text-sm">{selectedEvent.ipAddress}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Location</Label>
                      <p className="font-medium">{selectedEvent.location}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Device</Label>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(selectedEvent.device)}
                        <span className="font-medium">{selectedEvent.device}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Timestamp</Label>
                      <p className="font-medium">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm text-gray-600">User Agent</Label>
                      <p className="text-sm text-gray-700 break-all">{selectedEvent.userAgent}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedEvent.description}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    Close
                  </Button>
                  {!selectedEvent.resolved && (
                    <Button onClick={() => {
                      handleResolveEvent(selectedEvent.id);
                      setIsDetailDialogOpen(false);
                    }}>
                      Mark as Resolved
                    </Button>
                  )}
                  {selectedEvent.type === 'login_failed' && (
                    <Button variant="destructive">
                      Block IP Address
                    </Button>
                  )}
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