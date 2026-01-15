'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Avatar } from '@/components/ui/avatar'
import { Plus, Edit, Trash2, Phone, Mail, Star, User } from 'lucide-react'

interface Driver {
  id: string
  name: string
  phone: string
  email: string | null
  licenseNo: string
  experience: number | null
  rating: number
  image: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function DriversManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    licenseNo: '',
    experience: '',
    rating: '5.0',
    image: '',
    isActive: true
  })

  // Mock data for initial load
  useEffect(() => {
    const mockDrivers: Driver[] = [
      {
        id: '1',
        name: 'Md. Rahman Ali',
        phone: '+8801712345678',
        email: 'rahman.ali@email.com',
        licenseNo: 'DL-12345678',
        experience: 8,
        rating: 4.8,
        image: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Abdul Karim',
        phone: '+8801823456789',
        email: null,
        licenseNo: 'DL-23456789',
        experience: 12,
        rating: 4.9,
        image: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Mohammad Hasan',
        phone: '+8801934567890',
        email: 'hasan.driver@gmail.com',
        licenseNo: 'DL-34567890',
        experience: 5,
        rating: 4.6,
        image: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    setDrivers(mockDrivers)
    setLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingDriver) {
      // Update existing driver
      setDrivers(prev => prev.map(driver => 
        driver.id === editingDriver.id 
          ? { 
              ...driver, 
              ...formData,
              experience: formData.experience ? parseInt(formData.experience) : null,
              rating: parseFloat(formData.rating),
              updatedAt: new Date().toISOString() 
            }
          : driver
      ))
    } else {
      // Add new driver
      const newDriver: Driver = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        experience: formData.experience ? parseInt(formData.experience) : null,
        rating: parseFloat(formData.rating),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setDrivers(prev => [...prev, newDriver])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      licenseNo: '',
      experience: '',
      rating: '5.0',
      image: '',
      isActive: true
    })
    setEditingDriver(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver)
    setFormData({
      name: driver.name,
      phone: driver.phone,
      email: driver.email || '',
      licenseNo: driver.licenseNo,
      experience: driver.experience?.toString() || '',
      rating: driver.rating.toString(),
      image: driver.image || '',
      isActive: driver.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this driver? This will affect all related assignments and bookings.')) {
      setDrivers(prev => prev.filter(driver => driver.id !== id))
    }
  }

  const toggleStatus = (id: string) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === id 
        ? { ...driver, isActive: !driver.isActive, updatedAt: new Date().toISOString() }
        : driver
    ))
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-200 text-yellow-400" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }

    return stars
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading drivers...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Drivers Management</h1>
          <p className="text-gray-600">Manage all drivers in your transport system</p>
        </div>

        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDriver ? 'Edit Driver' : 'Add New Driver'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Md. Rahman Ali"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g., +8801712345678"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g., driver@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="licenseNo">License Number</Label>
                  <Input
                    id="licenseNo"
                    value={formData.licenseNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNo: e.target.value }))}
                    placeholder="e.g., DL-12345678"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="e.g., 5"
                  />
                </div>

                <div>
                  <Label htmlFor="rating">Rating (0.0 - 5.0)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    placeholder="e.g., 4.8"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image">Profile Image URL (Optional)</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/driver-photo.jpg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingDriver ? 'Update' : 'Create'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => (
            <Card key={driver.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      {driver.image ? (
                        <img src={driver.image} alt={driver.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{driver.name}</CardTitle>
                      <p className="text-sm text-gray-600">License: {driver.licenseNo}</p>
                    </div>
                  </div>
                  <Badge variant={driver.isActive ? "default" : "secondary"}>
                    {driver.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{driver.phone}</span>
                  </div>
                  
                  {driver.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{driver.email}</span>
                    </div>
                  )}

                  {driver.experience && (
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">Experience:</span>
                      <span>{driver.experience} years</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">Rating:</span>
                    <span className="text-sm">{driver.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(driver.rating)}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p>Created: {new Date(driver.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(driver.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(driver)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={driver.isActive ? "outline" : "default"}
                    onClick={() => toggleStatus(driver.id)}
                    className="flex-1"
                  >
                    {driver.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(driver.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {drivers.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-gray-500">No drivers found. Add your first driver above.</p>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}