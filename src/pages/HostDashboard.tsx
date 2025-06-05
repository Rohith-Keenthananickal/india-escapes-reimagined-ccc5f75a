
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Home, Calendar, MessageCircle, PenTool, Settings, Users, CreditCard, TrendingUp, 
  Plus, UploadCloud, Check, AlertCircle, Camera, Shield
} from 'lucide-react';
import { format } from 'date-fns';

const HostDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const analytics = {
    totalEarnings: 38500,
    bookingRate: 87,
    avgRating: 4.8,
    totalBookings: 12,
    pendingBookings: 2,
    messageResponseRate: 98
  };

  const upcomingBookings = [
    {
      id: 1,
      guest: "Amit Kumar",
      guestImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      property: "Cozy Hill Station Cottage",
      checkIn: new Date(2025, 6, 15),
      checkOut: new Date(2025, 6, 21),
      guests: 3,
      amount: 21000,
      status: "confirmed"
    },
    {
      id: 2,
      guest: "Neha Patel",
      guestImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      property: "Cozy Hill Station Cottage",
      checkIn: new Date(2025, 7, 10),
      checkOut: new Date(2025, 7, 13),
      guests: 2,
      amount: 10500,
      status: "pending"
    }
  ];

  const myProperties = [
    {
      id: 1,
      title: "Cozy Hill Station Cottage",
      location: "Mussoorie, Uttarakhand",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop",
      price: 3500,
      rating: 4.8,
      reviews: 5,
      isActive: true
    },
    {
      id: 2,
      title: "Mountain View Homestay",
      location: "Manali, Himachal Pradesh",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      price: 2800,
      rating: 4.7,
      reviews: 3,
      isActive: true
    }
  ];

  const reviews = [
    {
      id: 1,
      guest: "Amit Kumar",
      guestImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      property: "Cozy Hill Station Cottage",
      date: "March 2024",
      rating: 5,
      comment: "Absolutely beautiful place! The view from the cottage is breathtaking. Perfect for a peaceful getaway."
    },
    {
      id: 2,
      guest: "Neha Patel",
      guestImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      property: "Cozy Hill Station Cottage",
      date: "February 2024",
      rating: 5,
      comment: "Perfect for a family vacation. The cottage is well-maintained and has everything you need. The location is quiet yet accessible to local markets."
    }
  ];

  const monthlyEarnings = [
    { month: "Jan", amount: 7000 },
    { month: "Feb", amount: 6500 },
    { month: "Mar", amount: 9500 },
    { month: "Apr", amount: 8000 },
    { month: "May", amount: 7500 },
    { month: "Jun", amount: 0 }
  ];

  const hostResources = [
    {
      title: "Host Safety Guide",
      description: "Ensure a safe environment for your guests and yourself.",
      icon: Shield
    },
    {
      title: "Pricing Strategies",
      description: "Learn how to optimize your pricing for maximum occupancy.",
      icon: TrendingUp
    },
    {
      title: "Guest Communication",
      description: "Tips for effective communication with guests.",
      icon: MessageCircle
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <div className="mt-4">
                    <h3 className="font-bold text-lg">Priya Sharma</h3>
                    <p className="text-sm text-gray-600">Mussoorie, India</p>
                  </div>
                  <div className="mt-2 flex items-center justify-center">
                    <Badge className="bg-green-100 text-green-800">Superhost</Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <Button 
                    variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('overview')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Overview
                  </Button>
                  <Button 
                    variant={activeTab === 'properties' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('properties')}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Properties
                  </Button>
                  <Button 
                    variant={activeTab === 'bookings' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('bookings')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Bookings
                  </Button>
                  <Button 
                    variant={activeTab === 'newListing' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('newListing')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add new listing
                  </Button>
                  <Button 
                    variant={activeTab === 'reviews' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('reviews')}
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    Reviews
                  </Button>
                  <Button 
                    variant={activeTab === 'messages' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('messages')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                  <Button 
                    variant={activeTab === 'settings' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Host Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Host Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response rate</span>
                  <span className="font-medium">{analytics.messageResponseRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Booking rate</span>
                  <span className="font-medium">{analytics.bookingRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average rating</span>
                  <span className="font-medium">{analytics.avgRating} ★</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                  <Button>Download statement</Button>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-pink-50 to-rose-50">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-1">
                        <CreditCard className="w-5 h-5 text-pink-600" />
                        <h3 className="font-medium text-gray-700">Total earnings</h3>
                      </div>
                      <div className="text-3xl font-bold mb-2">₹{analytics.totalEarnings.toLocaleString()}</div>
                      <p className="text-xs text-gray-600">For the current year</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="w-5 h-5 text-blue-600" />
                        <h3 className="font-medium text-gray-700">Total bookings</h3>
                      </div>
                      <div className="text-3xl font-bold mb-2">{analytics.totalBookings}</div>
                      <p className="text-xs text-gray-600">{analytics.pendingBookings} pending bookings</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h3 className="font-medium text-gray-700">Occupancy rate</h3>
                      </div>
                      <div className="text-3xl font-bold mb-2">{analytics.bookingRate}%</div>
                      <p className="text-xs text-gray-600">Last 30 days</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Earnings Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end space-x-4">
                      {monthlyEarnings.map((month) => (
                        <div key={month.month} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-pink-500 rounded-t-md" 
                            style={{ height: `${(month.amount / 10000) * 200}px` }} 
                          ></div>
                          <div className="mt-2 text-sm">{month.month}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <Avatar>
                            <AvatarImage src={booking.guestImage} />
                            <AvatarFallback>{booking.guest[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{booking.guest}</h4>
                                <p className="text-sm text-gray-600">{booking.property}</p>
                              </div>
                              <Badge className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                              </Badge>
                            </div>
                            <div className="flex items-center mt-1 text-xs text-gray-600">
                              <span>{format(booking.checkIn, "MMM d")} - {format(booking.checkOut, "MMM d")}</span>
                              <span className="mx-2">•</span>
                              <span>{booking.guests} guests</span>
                              <span className="mx-2">•</span>
                              <span>₹{booking.amount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Latest Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviews.map((review) => (
                      <div key={review.id} className="mb-4 p-4 border rounded-lg">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.guestImage} />
                            <AvatarFallback>{review.guest[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{review.guest}</h4>
                              <p className="text-xs text-gray-600">{review.date}</p>
                            </div>
                            <div className="flex items-center mt-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <svg key={i} className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 17.27l6.18 3.73-1.64-7.030 5.46-4.73-7.19-0.61-2.81-6.63-2.81 6.63-7.19 0.61 5.46 4.73-1.64 7.030z"></path>
                                </svg>
                              ))}
                            </div>
                            <p className="mt-2 text-sm">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Host Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Host Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {hostResources.map((resource, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 mb-4">
                              <resource.icon className="w-6 h-6 text-pink-600" />
                            </div>
                            <h3 className="font-medium mb-2">{resource.title}</h3>
                            <p className="text-sm text-gray-600">{resource.description}</p>
                            <Button variant="link" className="mt-2 p-0 h-auto">
                              Learn more
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Properties Tab */}
            {activeTab === 'properties' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">My Properties</h2>
                  <Button onClick={() => setActiveTab('newListing')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add new property
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {myProperties.map((property) => (
                    <Card key={property.id}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-64 h-52">
                            <img 
                              src={property.image} 
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{property.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{property.location}</p>
                              </div>
                              <Badge className={property.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {property.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            
                            <div className="mt-4 grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Price per night</p>
                                <p className="font-medium">₹{property.price.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Rating</p>
                                <p className="font-medium">{property.rating} ★ ({property.reviews})</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Bookings (30d)</p>
                                <p className="font-medium">6 nights</p>
                              </div>
                            </div>
                            
                            <div className="mt-6 flex space-x-3">
                              <Button className="bg-pink-500 hover:bg-pink-600">Edit listing</Button>
                              <Button variant="outline">View calendar</Button>
                              <Button variant="outline">Preview</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* New Listing Tab */}
            {activeTab === 'newListing' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Add New Property</h2>
                  <div className="text-sm text-gray-600">Step 1 of 4</div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <p className="text-sm text-gray-600">Please fill out the basic information about your property</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="propertyTitle">Property title</Label>
                      <Input id="propertyTitle" placeholder="e.g. Cozy Mountain Villa with Stunning Views" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="propertyType">Property type</Label>
                        <Select>
                          <SelectTrigger id="propertyType">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="homestay">Homestay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="e.g. Mussoorie, Uttarakhand" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Describe your property in detail..." 
                        rows={5}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="guests">Max guests</Label>
                        <Input id="guests" type="number" min="1" placeholder="e.g. 4" />
                      </div>
                      <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input id="bedrooms" type="number" min="1" placeholder="e.g. 2" />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input id="bathrooms" type="number" min="1" step="0.5" placeholder="e.g. 1.5" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Upload photos</Label>
                      <div className="mt-2 grid grid-cols-3 gap-4">
                        <div className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <Camera className="w-10 h-10 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Add photo</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Upload high-quality images of your property (min. 1200x800px, max 10MB each)
                      </p>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Amenities</Label>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        {["WiFi", "Kitchen", "Free parking", "Air conditioning", "Heating", "Washer", "TV", "Iron", "Pool", "Hot tub", "Workspace", "First aid kit"].map((amenity) => (
                          <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span>{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="price">Price per night (₹)</Label>
                      <Input id="price" type="number" min="0" step="100" placeholder="e.g. 3500" />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t">
                      <Button variant="outline">Save as draft</Button>
                      <Button className="bg-pink-500 hover:bg-pink-600">Next: Availability</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
