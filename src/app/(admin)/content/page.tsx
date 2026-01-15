'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Globe,
  Image,
  Save,
  X,
  Calendar,
  User,
  Settings,
  Layout,
  Type,
  Link as LinkIcon
} from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft' | 'archived';
  type: 'page' | 'blog' | 'landing';
  author: string;
  lastModified: string;
  isHomepage: boolean;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
}

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [showAddPage, setShowAddPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pages');

  // Mock content data
  const [pages, setPages] = useState<Page[]>([
    {
      id: '1',
      title: 'Home',
      slug: '/',
      content: 'Welcome to Amaghor - Your Gateway to Bangladesh Tourism',
      status: 'published',
      type: 'page',
      author: 'Admin',
      lastModified: '2024-12-18',
      isHomepage: true,
      metaTitle: 'Amaghor - Discover Beautiful Bangladesh',
      metaDescription: 'Explore the beauty of Bangladesh with our comprehensive travel and accommodation services.',
      featuredImage: '/images/bangladesh-hero.jpg'
    },
    {
      id: '2',
      title: 'About Us',
      slug: '/about',
      content: 'Learn about our mission to promote Bangladesh tourism...',
      status: 'published',
      type: 'page',
      author: 'Admin',
      lastModified: '2024-12-17',
      isHomepage: false,
      metaTitle: 'About Amaghor - Our Story',
      metaDescription: 'Learn about our mission to promote sustainable tourism in Bangladesh.',
      featuredImage: '/images/about-us.jpg'
    },
    {
      id: '3',
      title: 'Privacy Policy',
      slug: '/privacy',
      content: 'Our privacy policy explains how we collect and use your data...',
      status: 'published',
      type: 'page',
      author: 'Legal Team',
      lastModified: '2024-12-10',
      isHomepage: false,
      metaTitle: 'Privacy Policy - Amaghor',
      metaDescription: 'Read our comprehensive privacy policy and data handling practices.',
      featuredImage: ''
    },
    {
      id: '4',
      title: 'Terms of Service',
      slug: '/terms',
      content: 'These terms govern your use of our services...',
      status: 'published',
      type: 'page',
      author: 'Legal Team',
      lastModified: '2024-12-10',
      isHomepage: false,
      metaTitle: 'Terms of Service - Amaghor',
      metaDescription: 'Read our terms of service and usage conditions.',
      featuredImage: ''
    },
    {
      id: '5',
      title: 'Discovering Cox\'s Bazar',
      slug: '/blog/coxs-bazar-guide',
      content: 'A comprehensive guide to Bangladesh\'s longest sea beach...',
      status: 'published',
      type: 'blog',
      author: 'Travel Team',
      lastModified: '2024-12-15',
      isHomepage: false,
      metaTitle: 'Cox\'s Bazar Travel Guide - Best Places to Visit',
      metaDescription: 'Discover the beauty of Cox\'s Bazar with our comprehensive travel guide.',
      featuredImage: '/images/coxs-bazar.jpg'
    },
    {
      id: '6',
      title: 'Summer Sale Landing',
      slug: '/summer-sale',
      content: 'Get up to 50% off on all hotel bookings this summer!',
      status: 'draft',
      type: 'landing',
      author: 'Marketing Team',
      lastModified: '2024-12-18',
      isHomepage: false,
      metaTitle: 'Summer Sale - Up to 50% Off Hotels',
      metaDescription: 'Limited time offer on hotel bookings across Bangladesh.',
      featuredImage: '/images/summer-sale.jpg'
    }
  ]);

  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: '',
    type: 'page' as const,
    metaTitle: '',
    metaDescription: '',
    featuredImage: ''
  });

  const getFilteredPages = () => {
    return pages.filter(page => {
      const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          page.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          page.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || page.status === selectedStatus;
      const matchesType = selectedType === 'all' || page.type === selectedType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'archived': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page': return 'bg-blue-100 text-blue-700';
      case 'blog': return 'bg-purple-100 text-purple-700';
      case 'landing': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddPage = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const page: Page = {
      id: (pages.length + 1).toString(),
      ...newPage,
      status: 'draft',
      author: 'Admin',
      lastModified: new Date().toISOString().split('T')[0],
      isHomepage: false
    };
    
    setPages([...pages, page]);
    setNewPage({
      title: '',
      slug: '',
      content: '',
      type: 'page',
      metaTitle: '',
      metaDescription: '',
      featuredImage: ''
    });
    setShowAddPage(false);
    setIsLoading(false);
    alert('Page created successfully!');
  };

  const togglePageStatus = (pageId: string) => {
    setPages(pages.map(page => 
      page.id === pageId 
        ? { 
            ...page, 
            status: page.status === 'published' ? 'draft' : 'published',
            lastModified: new Date().toISOString().split('T')[0]
          }
        : page
    ));
  };

  const deletePage = (pageId: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      setPages(pages.filter(page => page.id !== pageId));
    }
  };

  const filteredPages = getFilteredPages();
  const stats = {
    total: pages.length,
    published: pages.filter(p => p.status === 'published').length,
    drafts: pages.filter(p => p.status === 'draft').length,
    blogs: pages.filter(p => p.type === 'blog').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideSearch />
      
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-2 md:px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Content Management</h1>
              <p className="text-sm md:text-base text-gray-600">Manage website pages, blog posts, and content</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="text-xs md:text-sm">
                  ← Back to Admin
                </Button>
              </Link>
              <Button 
                onClick={() => setShowAddPage(true)}
                className="bg-green-600 hover:bg-green-700 text-xs md:text-sm px-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Page
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Total Pages</p>
                  <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Published</p>
                  <p className="text-lg font-bold text-green-600">{stats.published}</p>
                </div>
                <Globe className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Drafts</p>
                  <p className="text-lg font-bold text-yellow-600">{stats.drafts}</p>
                </div>
                <Edit className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Blog Posts</p>
                  <p className="text-lg font-bold text-purple-600">{stats.blogs}</p>
                </div>
                <Type className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="page">Pages</SelectItem>
              <SelectItem value="blog">Blog Posts</SelectItem>
              <SelectItem value="landing">Landing Pages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content ({filteredPages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPages.map((page) => (
                <div key={page.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start gap-4 mb-4 lg:mb-0 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {page.type === 'blog' ? <Type className="h-5 w-5 text-purple-600" /> :
                       page.type === 'landing' ? <Layout className="h-5 w-5 text-orange-600" /> :
                       <FileText className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{page.title}</h3>
                        {page.isHomepage && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">Homepage</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{page.slug}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{page.content.substring(0, 100)}...</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>By {page.author}</span>
                        <span>Updated {new Date(page.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
                    <div className="flex gap-2">
                      <Badge className={getTypeColor(page.type)}>{page.type}</Badge>
                      <Badge className={getStatusColor(page.status)}>{page.status}</Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedPage(page)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => togglePageStatus(page.id)}
                        className={page.status === 'published' ? 'text-yellow-600' : 'text-green-600'}
                      >
                        {page.status === 'published' ? <Edit className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deletePage(page.id)} className="text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredPages.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No content found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Page Modal */}
        {showAddPage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Create New Content</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowAddPage(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <Input
                      value={newPage.title}
                      onChange={(e) => setNewPage({...newPage, title: e.target.value})}
                      placeholder="Enter page title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Select value={newPage.type} onValueChange={(value: any) => setNewPage({...newPage, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="page">Page</SelectItem>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="landing">Landing Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug/URL</label>
                  <Input
                    value={newPage.slug}
                    onChange={(e) => setNewPage({...newPage, slug: e.target.value})}
                    placeholder="e.g., /about-us or /blog/post-title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <Textarea
                    value={newPage.content}
                    onChange={(e) => setNewPage({...newPage, content: e.target.value})}
                    placeholder="Enter page content..."
                    rows={6}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                    <Input
                      value={newPage.metaTitle}
                      onChange={(e) => setNewPage({...newPage, metaTitle: e.target.value})}
                      placeholder="SEO title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                    <Input
                      value={newPage.featuredImage}
                      onChange={(e) => setNewPage({...newPage, featuredImage: e.target.value})}
                      placeholder="/images/featured.jpg"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <Textarea
                    value={newPage.metaDescription}
                    onChange={(e) => setNewPage({...newPage, metaDescription: e.target.value})}
                    placeholder="SEO description"
                    rows={2}
                  />
                </div>
                
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowAddPage(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddPage} disabled={isLoading} className="flex-1 bg-green-600 hover:bg-green-700">
                    {isLoading ? 'Creating...' : 'Create Page'}
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