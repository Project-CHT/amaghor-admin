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
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react'
import { TransportDataService, TransportTypeData } from '@/lib/transportDataService'
import { generateEntityId } from '@/lib/utils/idGenerator'


export default function TransportTypesManagement() {
  const [transportTypes, setTransportTypes] = useState<TransportTypeData[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<TransportTypeData | null>(null)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    baseFare: 0,
    ratePerKm: 0,
    isActive: true
  })

  // Load transport types and seed initial data
  useEffect(() => {
    const loadTransportTypes = async () => {
      await TransportDataService.seedInitialData()
      const types = await TransportDataService.getAllTransportTypes()
      setTransportTypes(types)
      setLoading(false)
    }
    
    loadTransportTypes()
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

    // Add new files (max 5 images total)
    const currentImages = [...uploadedImages]
    const newFiles = files.slice(0, 5 - currentImages.length)
    
    if (newFiles.length < files.length) {
      alert('Maximum 5 images allowed. Only first images will be uploaded.')
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
    
    if (!formData.name.trim()) {
      alert('Please enter a transport type name')
      return
    }

    try {
      const loadingAlert = alert('🔄 Saving transport type...\nThis may take a moment.')
      
      let imageUrls: string[] = []
      
      // Generate stable ID for new entities
      const entityId = editingType?.id || generateEntityId('transport-type')
      
      // Upload images if any
      if (uploadedImages.length > 0) {
        imageUrls = await TransportDataService.uploadImages(uploadedImages, 'transport-type', entityId)
      }
      
      const typeData: TransportTypeData = {
        id: entityId,
        ...formData,
        description: formData.description || '',
        images: imageUrls.length > 0 ? imageUrls : (editingType?.images || [])
      }
      
      const result = await TransportDataService.saveTransportType(typeData)
      
      if (result.success) {
        alert(`✅ Success!\n\n${result.message}\n\n📸 Photos uploaded: ${uploadedImages.length}`)
        
        // Refresh the list
        const types = await TransportDataService.getAllTransportTypes()
        setTransportTypes(types)
        
        resetForm()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      alert('❌ Error: Failed to save transport type. Please try again.')
      console.error('Transport type save error:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      baseFare: 0,
      ratePerKm: 0,
      isActive: true
    })
    setUploadedImages([])
    setPreviewImages([])
    setEditingType(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (type: TransportTypeData) => {
    setEditingType(type)
    setFormData({
      name: type.name,
      description: type.description || '',
      icon: type.icon || '',
      baseFare: type.baseFare || 0,
      ratePerKm: type.ratePerKm || 0,
      isActive: type.isActive
    })
    setUploadedImages([])
    setPreviewImages([])
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transport type?')) {
      // In a real app, you'd call an API to delete
      setTransportTypes(prev => prev.filter(type => type.id !== id))
      alert('Transport type deleted successfully!')
    }
  }

  const toggleStatus = async (id: string) => {
    const type = transportTypes.find(t => t.id === id)
    if (type) {
      const updatedType = { ...type, isActive: !type.isActive }
      const result = await TransportDataService.saveTransportType(updatedType)
      
      if (result.success) {
        const types = await TransportDataService.getAllTransportTypes()
        setTransportTypes(types)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading transport types...</div>
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
          <h1 className="text-3xl font-bold mb-2">Transport Types Management</h1>
          <p className="text-gray-600">Manage all transport types available in your system</p>
        </div>

        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Transport Type
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingType ? 'Edit Transport Type' : 'Add New Transport Type'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Transport Type Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., CNG, Bus, Boat, Car"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="icon">Icon (Emoji)</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="🛺 🚌 🚢 🚗"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this transport type"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="baseFare">Base Fare (৳)</Label>
                    <Input
                      id="baseFare"
                      type="number"
                      min="0"
                      value={formData.baseFare}
                      onChange={(e) => setFormData(prev => ({ ...prev, baseFare: parseInt(e.target.value) || 0 }))}
                      placeholder="100"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ratePerKm">Rate per KM (৳)</Label>
                    <Input
                      id="ratePerKm"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.ratePerKm}
                      onChange={(e) => setFormData(prev => ({ ...prev, ratePerKm: parseFloat(e.target.value) || 0 }))}
                      placeholder="2.5"
                    />
                  </div>
                </div>

                <div>
                  <Label>Images (Optional)</Label>
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
                      <div className="grid grid-cols-3 gap-2">
                        {previewImages.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 w-6 h-6 p-0"
                              onClick={() => removeImage(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {editingType && editingType.images && editingType.images.length > 0 && previewImages.length === 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {editingType.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Existing ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                              ✓
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                    {editingType ? 'Update' : 'Create'}
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
          {transportTypes.map((type) => (
            <Card key={type.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {type.icon && <span className="text-2xl">{type.icon}</span>}
                    <CardTitle className="text-xl">{type.name}</CardTitle>
                  </div>
                  <Badge variant={type.isActive ? "default" : "secondary"}>
                    {type.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {type.images && type.images.length > 0 && (
                  <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={type.images[0]} 
                      alt={type.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                
                {type.description && (
                  <p className="text-gray-600 text-sm">{type.description}</p>
                )}

                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare:</span>
                    <span className="font-medium">৳{type.baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate per KM:</span>
                    <span className="font-medium">৳{type.ratePerKm}</span>
                  </div>
                </div>

                {type.images && type.images.length > 1 && (
                  <div className="text-xs text-gray-500">
                    <p>📸 {type.images.length} photos</p>
                  </div>
                )}

                {type.lastUpdated && (
                  <div className="text-xs text-gray-500">
                    <p>Updated: {new Date(type.lastUpdated).toLocaleDateString()}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(type)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={type.isActive ? "outline" : "default"}
                    onClick={() => toggleStatus(type.id)}
                    className="flex-1"
                  >
                    {type.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(type.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {transportTypes.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-gray-500">No transport types found. Add your first transport type above.</p>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}