'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Car, Users, Upload, X } from 'lucide-react'
import { TransportDataService, VehicleData, TransportTypeData } from '@/lib/transportDataService'
import { generateEntityId } from '@/lib/utils/idGenerator'


export default function VehiclesManagement() {
  const [vehicles, setVehicles] = useState<VehicleData[]>([])
  const [transportTypes, setTransportTypes] = useState<TransportTypeData[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    transportTypeId: '',
    name: '',
    model: '',
    registrationNo: '',
    capacity: 0,
    features: [] as string[],
    status: 'active' as 'active' | 'maintenance' | 'inactive'
  })

  // Load data from service
  useEffect(() => {
    const loadData = async () => {
      await TransportDataService.seedInitialData()
      const [typesData, vehiclesData] = await Promise.all([
        TransportDataService.getAllTransportTypes(),
        TransportDataService.getAllVehicles()
      ])
      setTransportTypes(typesData)
      setVehicles(vehiclesData)
      setLoading(false)
    }
    
    loadData()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      alert('Please upload only JPG, PNG, or WebP images.')
      return
    }

    // Validate file size (max 5MB per image)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert('Please upload images smaller than 5MB.')
      return
    }

    // Add new files (max 8 images total)
    const currentImages = [...uploadedImages]
    const newFiles = files.slice(0, 8 - currentImages.length)
    
    if (newFiles.length < files.length) {
      alert('Maximum 8 images allowed. Only first images will be uploaded.')
    }

    setUploadedImages([...currentImages, ...newFiles])

    // Create preview URLs
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    setPreviewImages([...previewImages, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newUploadedImages = uploadedImages.filter((_, i) => i !== index)
    const newPreviews = previewImages.filter((_, i) => i !== index)
    
    // Clean up URL
    URL.revokeObjectURL(previewImages[index])
    
    setUploadedImages(newUploadedImages)
    setPreviewImages(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.transportTypeId || !formData.registrationNo.trim()) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const loadingAlert = alert('🔄 Saving vehicle...\nThis may take a moment.')
      
      let imageUrls: string[] = []
      
      // Generate stable ID for new entities
      const entityId = editingVehicle?.id || generateEntityId('vehicle')
      
      // Upload images if any
      if (uploadedImages.length > 0) {
        imageUrls = await TransportDataService.uploadImages(uploadedImages, 'vehicle', entityId)
      }
      
      const vehicleData: VehicleData = {
        id: entityId,
        ...formData,
        images: imageUrls.length > 0 ? imageUrls : (editingVehicle?.images || [])
      }
      
      const result = await TransportDataService.saveVehicle(vehicleData)
      
      if (result.success) {
        alert(`✅ Success!\n\n${result.message}\n\n📸 Photos uploaded: ${uploadedImages.length}`)
        
        // Refresh the list
        const vehicles = await TransportDataService.getAllVehicles()
        setVehicles(vehicles)
        
        resetForm()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      alert('❌ Error: Failed to save vehicle. Please try again.')
      console.error('Vehicle save error:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      transportTypeId: '',
      name: '',
      model: '',
      registrationNo: '',
      capacity: 0,
      features: [],
      status: 'active'
    })
    setUploadedImages([])
    setPreviewImages([])
    setEditingVehicle(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (vehicle: VehicleData) => {
    setEditingVehicle(vehicle)
    setFormData({
      transportTypeId: vehicle.transportTypeId,
      name: vehicle.name,
      model: vehicle.model || '',
      registrationNo: vehicle.registrationNo,
      capacity: vehicle.capacity,
      features: vehicle.features || [],
      status: vehicle.status
    })
    setUploadedImages([])
    setPreviewImages([])
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle? This will affect all related bookings and assignments.')) {
      // In a real app, you'd call an API to delete
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id))
      alert('Vehicle deleted successfully!')
    }
  }

  const toggleStatus = async (id: string) => {
    const vehicle = vehicles.find(v => v.id === id)
    if (vehicle) {
      const newStatus = vehicle.status === 'active' ? 'inactive' : 'active'
      const updatedVehicle = { ...vehicle, status: newStatus }
      const result = await TransportDataService.saveVehicle(updatedVehicle)
      
      if (result.success) {
        const vehicles = await TransportDataService.getAllVehicles()
        setVehicles(vehicles)
      }
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading vehicles...</div>
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
          <h1 className="text-3xl font-bold mb-2">Vehicles Management</h1>
          <p className="text-gray-600">Manage all vehicles in your transport fleet</p>
        </div>

        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
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
                            {type.icon} {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'active' | 'maintenance' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Green CNG 001, Express Bus 001"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="model">Model (Optional)</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="e.g., Tata Ace CNG, Volvo B11R"
                    />
                  </div>

                  <div>
                    <Label htmlFor="registrationNo">Registration Number</Label>
                    <Input
                      id="registrationNo"
                      value={formData.registrationNo}
                      onChange={(e) => setFormData(prev => ({ ...prev, registrationNo: e.target.value }))}
                      placeholder="e.g., DHK-GA-1234"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="capacity">Passenger Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g., 4, 45, 20"
                    required
                  />
                </div>

                <div>
                  <Label>Vehicle Images (Optional)</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </Button>
                    </div>
                    
                    {previewImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {previewImages.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-16 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 w-5 h-5 p-0"
                              onClick={() => removeImage(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {editingVehicle && editingVehicle.images && editingVehicle.images.length > 0 && previewImages.length === 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {editingVehicle.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Existing ${index + 1}`}
                              className="w-full h-16 object-cover rounded border"
                            />
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              ✓
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="features">Features (Optional)</Label>
                  <Input
                    id="features"
                    value={formData.features.join(', ')}
                    onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value.split(', ').filter(f => f.trim()) }))}
                    placeholder="GPS Tracking, AC, WiFi, Safety Belt"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate features with commas</p>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingVehicle ? 'Update' : 'Create'}
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
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                    <p className="text-sm text-gray-600">{vehicle.transportTypeName}</p>
                  </div>
                  <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                    {vehicle.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Car className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Reg:</span>
                    <span className="ml-1">{vehicle.registrationNo}</span>
                  </div>
                  
                  {vehicle.model && (
                    <div className="flex items-center text-sm">
                      <Car className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Model:</span>
                      <span className="ml-1">{vehicle.model}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Capacity:</span>
                    <span className="ml-1">{vehicle.capacity} passengers</span>
                  </div>
                </div>

                {parseFeatures(vehicle.features).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {parseFeatures(vehicle.features).map((feature: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  <p>Created: {new Date(vehicle.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(vehicle.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(vehicle)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={vehicle.isActive ? "outline" : "default"}
                    onClick={() => toggleStatus(vehicle.id)}
                    className="flex-1"
                  >
                    {vehicle.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {vehicles.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-gray-500">No vehicles found. Add your first vehicle above.</p>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}