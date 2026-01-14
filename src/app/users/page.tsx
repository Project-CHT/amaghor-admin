'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Shield,
  CheckCircle,
  X,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff' | 'customer';
  status: 'active' | 'inactive' | 'suspended';
  joinedDate: string;
  lastLogin: string;
  permissions: string[];
  avatar: string;
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from API
  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const { adminService } = await import('@/lib/services/adminService');
        // Map API response to UI User type
        const apiUsers = await adminService.listUsers(1, 100, searchQuery, selectedRole, selectedStatus);

        const mappedUsers: User[] = apiUsers.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || 'N/A',
          role: u.role as any,
          status: (u.status || 'active') as any,
          joinedDate: u.joinedDate || u.created_at || new Date().toISOString().split('T')[0],
          lastLogin: u.lastLogin || 'Never',
          permissions: [],
          avatar: u.avatar || '👤'
        }));

        setUsers(mappedUsers);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Debounce search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedRole, selectedStatus]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer' as const,
    permissions: [] as string[]
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100/80 text-red-700 border-red-200';
      case 'manager': return 'bg-blue-100/80 text-blue-700 border-blue-200';
      case 'staff': return 'bg-purple-100/80 text-purple-700 border-purple-200';
      case 'customer': return 'bg-gray-100/80 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100/80 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-100/80 text-gray-700 border-gray-200';
      case 'suspended': return 'bg-red-100/80 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddUser = async () => {
    setIsLoading(true);
    try {
      const { adminService } = await import('@/lib/services/adminService');
      const success = await adminService.createUser({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      });

      if (success) {
        alert('User added successfully!');
        setShowAddUser(false);
        setNewUser({ name: '', email: '', phone: '', role: 'customer', permissions: [] });
        // Ideally trigger fetchUsers() here, but setting timeout will trigger useEffect dep since we don't depend on a trigger
        // For now, simple page reload or we can add a refresh trigger to dependency
        window.location.reload();
      } else {
        alert('Failed to add user');
      }
    } catch (error) {
      console.error('Failed to create user', error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    // Optimistic update or API call
    // For now just console log as example
    console.log('Toggle status for', userId);
  };

  const deleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const { adminService } = await import('@/lib/services/adminService');
        await adminService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (e) {
        console.error(e);
        alert("Failed to delete user");
      }
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    customers: users.filter(u => u.role === 'customer').length
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header hideSearch />

      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-2 md:px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
              <p className="text-gray-500 mt-1">Manage users, roles, and permissions system-wide</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
                  ← Back to Dashboard
                </Button>
              </Link>
              <Button
                onClick={() => setShowAddUser(true)}
                className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Admins</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.admins}</p>
                </div>
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customers</p>
                  <p className="text-2xl font-bold text-gray-600 mt-1">{stats.customers}</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="glass p-4 rounded-xl mb-6 flex flex-col sm:flex-row gap-4 border border-gray-100 shadow-sm bg-white/50 backdrop-blur-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-transparent focus:bg-white transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-40 bg-white border-transparent">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40 bg-white border-transparent">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Users List */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-400" />
              Registered Users <span className="text-gray-400 font-normal">({users.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-gray-100">
              {users.map((user) => (
                <div key={user.id} className="group p-4 hover:bg-gray-50/80 transition-colors -mx-6 px-6 cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl shadow-inner">
                        {user.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-gray-900">{user.name}</h3>
                          <Badge variant="outline" className={`${getRoleColor(user.role)} border px-2 py-0 h-5 text-[10px] uppercase tracking-wider font-bold`}>
                            {user.role}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap text-sm text-gray-500 gap-x-4">
                          <span>{user.email}</span>
                          <span className="text-gray-300">|</span>
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 ml-16 sm:ml-0">
                      <div className="text-right sm:text-left min-w-[100px]">
                        <div className="text-xs text-gray-400 mb-0.5 flex items-center justify-end sm:justify-start gap-1">
                          <Clock className="h-3 w-3" /> Last Active
                        </div>
                        <div className="text-sm font-medium text-gray-700">{user.lastLogin}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(user.status)} border px-2.5 py-0.5`}>
                          {user.status}
                        </Badge>

                        <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" onClick={() => setSelectedUser(user)} className="h-8 w-8 hover:bg-blue-50 text-gray-400 hover:text-blue-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleUserStatus(user.id)}
                            className={`h-8 w-8 hover:bg-gray-100 ${user.status === 'active' ? 'text-gray-400 hover:text-red-500' : 'text-gray-400 hover:text-green-500'}`}
                          >
                            {user.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteUser(user.id)} className="h-8 w-8 hover:bg-red-50 text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {users.length === 0 && !isLoading && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters.</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-16">
                  <p>Loading users...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl border-none animate-in fade-in zoom-in duration-200">
              <CardHeader className="border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold">Add New User</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddUser(false)} className="rounded-full h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <Input
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                    className="bg-gray-50 border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                    className="bg-gray-50 border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <Input
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="bg-gray-50 border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowAddUser(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser} disabled={isLoading} className="flex-1 bg-primary hover:bg-primary/90 text-white">
                    {isLoading ? 'Adding...' : 'Add User'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}