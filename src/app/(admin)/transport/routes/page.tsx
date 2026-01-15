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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit, Trash2, MapPin, DollarSign, Clock, Route } from 'lucide-react'

interface Route {
  id: string
  transportTypeId: string
  transportTypeName: string
  name: string
  fromLocation: string
  toLocation: string
  distance: number | null
  estimatedTime: number | null
  baseRate: number
  perKmRate: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface TransportType {
  id: string
  name: string
}

export default function RoutesManagement() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [transportTypes, setTransportTypes] = useState<TransportType[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [activeTab, setActiveTab] = useState('routes')
  const [formData, setFormData] = useState({
    transportTypeId: '',
    name: '',
    fromLocation: '',
    toLocation: '',
    distance: '',
    estimatedTime: '',
    baseRate: '',
    perKmRate: '',
    isActive: true
  })

  // Popular locations in Bangladesh
  const popularLocations = [
    'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh',
    'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Motijheel', 'Old Dhaka', 'Mirpur', 'Tejgaon',
    'Farmgate', 'Shahbag', 'New Market', 'Wari', 'Elephant Road', 'Airport', 'Railway Station',
    'Cox\'s Bazar', 'Kuakata', 'Saint Martin', 'Sundarbans', 'Sajek Valley'
  ]

  // Mock data for initial load
  useEffect(() => {
    const mockTransportTypes: TransportType[] = [
      { id: '1', name: 'CNG' },
      { id: '2', name: 'Bus' },
      { id: '3', name: 'Boat' },
      { id: '4', name: 'Car' }
    ]

    const mockRoutes: Route[] = [
      {
        id: '1',
        transportTypeId: '1',
        transportTypeName: 'CNG',
        name: 'Dhanmondi to Gulshan',
        fromLocation: 'Dhanmondi',
        toLocation: 'Gulshan',
        distance: 8.5,
        estimatedTime: 25,
        baseRate: 50,
        perKmRate: 25,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        transportTypeId: '2',
        transportTypeName: 'Bus',
        name: 'Dhaka to Cox\'s Bazar',
        fromLocation: 'Dhaka',
        toLocation: 'Cox\'s Bazar',
        distance: 414,
        estimatedTime: 480,
        baseRate: 800,
        perKmRate: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        transportTypeId: '3',
        transportTypeName: 'Boat',
        name: 'Dhaka to Barisal',
        fromLocation: 'Sadarghat (Dhaka)',
        toLocation: 'Barisal',
        distance: 250,
        estimatedTime: 600,
        baseRate: 400,
        perKmRate: 1.5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        transportTypeId: '4',
        transportTypeName: 'Car',
        name: 'Airport to City Center',
        fromLocation: 'Hazrat Shahjalal International Airport',
        toLocation: 'Motijheel',
        distance: 15.2,
        estimatedTime: 35,
        baseRate: 200,
        perKmRate: 40,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    setTransportTypes(mockTransportTypes)
    setRoutes(mockRoutes)
    setLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedTransportType = transportTypes.find(t => t.id === formData.transportTypeId)
    
    if (editingRoute) {
      // Update existing route
      setRoutes(prev => prev.map(route => 
        route.id === editingRoute.id 
          ? { 
              ...route, 
              ...formData,
              transportTypeName: selectedTransportType?.name || '',
              distance: formData.distance ? parseFloat(formData.distance) : null,
              estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : null,
              baseRate: parseFloat(formData.baseRate),
              perKmRate: parseFloat(formData.perKmRate),
              updatedAt: new Date().toISOString() 
            }
          : route
      ))
    } else {
      // Add new route
      const newRoute: Route = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        transportTypeName: selectedTransportType?.name || '',
        distance: formData.distance ? parseFloat(formData.distance) : null,
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : null,
        baseRate: parseFloat(formData.baseRate),
        perKmRate: parseFloat(formData.perKmRate),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setRoutes(prev => [...prev, newRoute])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      transportTypeId: '',
      name: '',
      fromLocation: '',
      toLocation: '',
      distance: '',
      estimatedTime: '',
      baseRate: '',
      perKmRate: '',
      isActive: true
    })
    setEditingRoute(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (route: Route) => {
    setEditingRoute(route)
    setFormData({
      transportTypeId: route.transportTypeId,
      name: route.name,
      fromLocation: route.fromLocation,
      toLocation: route.toLocation,
      distance: route.distance?.toString() || '',
      estimatedTime: route.estimatedTime?.toString() || '',
      baseRate: route.baseRate.toString(),
      perKmRate: route.perKmRate.toString(),
      isActive: route.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this route? This will affect all related bookings and schedules.')) {
      setRoutes(prev => prev.filter(route => route.id !== id))
    }
  }

  const toggleStatus = (id: string) => {
    setRoutes(prev => prev.map(route => 
      route.id === id 
        ? { ...route, isActive: !route.isActive, updatedAt: new Date().toISOString() }
        : route
    ))
  }

  const calculateTotalFare = (route: Route) => {
    if (!route.distance) return route.baseRate
    return route.baseRate + (route.distance * route.perKmRate)
  }

  const getTransportTypeColor = (transportType: string) => {
    switch (transportType.toLowerCase()) {
      case 'cng': return 'bg-green-100 text-green-800'
      case 'bus': return 'bg-blue-100 text-blue-800'
      case 'boat': return 'bg-cyan-100 text-cyan-800'
      case 'car': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading routes and fare data...</div>
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
          <h1 className="text-3xl font-bold mb-2">Routes & Fare Management</h1>
          <p className="text-gray-600">Manage transport routes and pricing structures</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="fare-calculator">Fare Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="routes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Routes</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Route
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingRoute ? 'Edit Route' : 'Add New Route'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="transportTypeId">Transport Type</Label>
                        <Select
                          value={formData.transportTypeId}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, transportTypeId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select transport type" />
                          </SelectTrigger>
                          <SelectContent>
                            {transportTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="name">Route Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Dhaka to Cox's Bazar"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fromLocation">From Location</Label>
                        <Select
                          value={formData.fromLocation}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, fromLocation: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select starting location" />
                          </SelectTrigger>
                          <SelectContent>
                            {popularLocations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="toLocation">To Location</Label>
                        <Select
                          value={formData.toLocation}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, toLocation: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                          <SelectContent>
                            {popularLocations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="distance">Distance (km, Optional)</Label>
                        <Input
                          id="distance"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.distance}
                          onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                          placeholder="e.g., 15.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="estimatedTime">Estimated Time (minutes, Optional)</Label>
                        <Input
                          id="estimatedTime"
                          type="number"
                          min="0"
                          value={formData.estimatedTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                          placeholder="e.g., 30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="baseRate">Base Rate (৳)</Label>
                        <Input
                          id="baseRate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.baseRate}
                          onChange={(e) => setFormData(prev => ({ ...prev, baseRate: e.target.value }))}
                          placeholder="e.g., 50"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="perKmRate">Per KM Rate (৳)</Label>
                        <Input
                          id="perKmRate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.perKmRate}
                          onChange={(e) => setFormData(prev => ({ ...prev, perKmRate: e.target.value }))}
                          placeholder="e.g., 25"
                          required
                        />
                      </div>
                    </div>

                    {formData.distance && formData.baseRate && formData.perKmRate && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Fare Calculation Preview</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Base Rate:</span>
                            <span>৳{formData.baseRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Distance ({formData.distance} km × ৳{formData.perKmRate}):</span>
                            <span>৳{(parseFloat(formData.distance) * parseFloat(formData.perKmRate)).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-1">
                            <span>Total Fare:</span>
                            <span>৳{(parseFloat(formData.baseRate) + (parseFloat(formData.distance) * parseFloat(formData.perKmRate))).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button type="submit" className="flex-1">
                        {editingRoute ? 'Update Route' : 'Create Route'}
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
              {routes.map((route) => (
                <Card key={route.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{route.name}</CardTitle>
                        <Badge className={getTransportTypeColor(route.transportTypeName)}>
                          {route.transportTypeName}
                        </Badge>
                      </div>
                      <Badge variant={route.isActive ? "default" : "secondary"}>
                        {route.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium">From:</span>
                        <span className="ml-1">{route.fromLocation}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        <span className="font-medium">To:</span>
                        <span className="ml-1">{route.toLocation}</span>
                      </div>

                      {route.distance && (
                        <div className="flex items-center text-sm">
                          <Route className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="font-medium">Distance:</span>
                          <span className="ml-1">{route.distance} km</span>
                        </div>
                      )}

                      {route.estimatedTime && (
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-purple-500" />
                          <span className="font-medium">Duration:</span>
                          <span className="ml-1">{Math.floor(route.estimatedTime / 60)}h {route.estimatedTime % 60}m</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Base Rate:</span>
                        <span className="font-medium">৳{route.baseRate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Per KM:</span>
                        <span className="font-medium">৳{route.perKmRate}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold border-t pt-2">
                        <span>Total Fare:</span>
                        <span className="text-green-600">৳{calculateTotalFare(route).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      <p>Created: {new Date(route.createdAt).toLocaleDateString()}</p>
                      <p>Updated: {new Date(route.updatedAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(route)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={route.isActive ? "outline" : "default"}
                        onClick={() => toggleStatus(route.id)}
                        className="flex-1"
                      >
                        {route.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(route.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {routes.length === 0 && (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-gray-500">No routes found. Add your first route above.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="fare-calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Fare Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-sm text-gray-600 mb-4">
                  Use this calculator to estimate fares for different routes and transport types.
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {transportTypes.map((type) => (
                    <Card key={type.id} className="p-4">
                      <h3 className="font-medium text-center mb-3">{type.name} Routes</h3>
                      <div className="space-y-2">
                        {routes.filter(r => r.transportTypeId === type.id).map((route) => (
                          <div key={route.id} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium">{route.fromLocation} → {route.toLocation}</div>
                            <div className="text-green-600 font-semibold">৳{calculateTotalFare(route).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Pricing Structure</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• <strong>Base Rate:</strong> Fixed starting cost for the service</p>
                    <p>• <strong>Per KM Rate:</strong> Additional cost per kilometer traveled</p>
                    <p>• <strong>Total Fare:</strong> Base Rate + (Distance × Per KM Rate)</p>
                    <p>• <strong>Advance Payment:</strong> 50% minimum required at booking</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}