
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
import { Star, Heart, Calendar, MessageCircle, Bell, Settings, CreditCard, MapPin, Edit } from 'lucide-react';
import { format } from 'date-fns';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const upcomingBookings = [
    {
      id: 1,
      property: "Cozy Hill Station Cottage",
      location: "Mussoorie, Uttarakhand",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop",
      checkIn: new Date(2025, 6, 15),
      checkOut: new Date(2025, 6, 21),
      price: 3500 * 6,
      status: "confirmed"
    }
  ];

  const pastBookings = [
    {
      id: 2,
      property: "Heritage Haveli Experience",
      location: "Jaipur, Rajasthan",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      checkIn: new Date(2024, 2, 5),
      checkOut: new Date(2024, 2, 10),
      price: 6500 * 5,
      status: "completed",
      rating: 5
    }
  ];

  const wishlists = [
    {
      id: 1,
      name: "Summer Getaways",
      count: 4,
      coverImage: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Mountain Retreats",
      count: 3,
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
    }
  ];

  const savedProperties = [
    {
      id: 3,
      title: "Backwater Villa Retreat",
      location: "Alleppey, Kerala",
      price: 4200,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Mountain View Homestay",
      location: "Manali, Himachal Pradesh",
      price: 2800,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    }
  ];

  const messages = [
    {
      id: 1,
      host: "Priya",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=50&h=50&fit=crop&crop=face",
      property: "Cozy Hill Station Cottage",
      lastMessage: "Hi there! Looking forward to hosting you. Let me know if you need anything before your arrival.",
      time: "2 hours ago",
      unread: true
    }
  ];

  const notifications = [
    {
      id: 1,
      title: "Booking confirmed",
      message: "Your booking at Cozy Hill Station Cottage has been confirmed.",
      time: "3 hours ago",
      read: false
    },
    {
      id: 2,
      title: "Price drop alert",
      message: "A property in your wishlist is now 15% off!",
      time: "1 day ago",
      read: true
    },
    {
      id: 3,
      title: "Review reminder",
      message: "How was your stay at Heritage Haveli Experience?",
      time: "3 days ago",
      read: true
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
                    <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback>TP</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg mt-4">Tanvi Patel</h3>
                  <p className="text-sm text-gray-600">Mumbai, India</p>
                </div>

                <div className="space-y-1">
                  <Button 
                    variant={activeTab === 'bookings' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('bookings')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Bookings
                  </Button>
                  <Button 
                    variant={activeTab === 'wishlist' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('wishlist')}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
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
                    variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Your Bookings</h2>
                <Tabs defaultValue="upcoming">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming">
                    <div className="space-y-4 mt-6">
                      {upcomingBookings.map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              {/* Image */}
                              <div className="w-full md:w-48 h-48">
                                <img 
                                  src={booking.image} 
                                  alt={booking.property}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              {/* Details */}
                              <div className="flex-1 p-6">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">{booking.property}</h3>
                                    <p className="text-sm text-gray-600 flex items-center mt-1">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {booking.location}
                                    </p>
                                  </div>
                                  <Badge className="bg-green-50 text-green-700 border-green-200">
                                    {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                  <div>
                                    <p className="text-gray-600">Check-in</p>
                                    <p className="font-medium">{format(booking.checkIn, "EEE, MMM d yyyy")}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Check-out</p>
                                    <p className="font-medium">{format(booking.checkOut, "EEE, MMM d yyyy")}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Total amount</p>
                                    <p className="font-medium">₹{booking.price.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Booking ID</p>
                                    <p className="font-medium">VR{booking.id}7823</p>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-3 mt-5">
                                  <Button className="bg-pink-500 hover:bg-pink-600">View details</Button>
                                  <Button variant="outline">Get directions</Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="past">
                    <div className="space-y-4 mt-6">
                      {pastBookings.map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              {/* Image */}
                              <div className="w-full md:w-48 h-48">
                                <img 
                                  src={booking.image} 
                                  alt={booking.property}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              {/* Details */}
                              <div className="flex-1 p-6">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">{booking.property}</h3>
                                    <p className="text-sm text-gray-600 flex items-center mt-1">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {booking.location}
                                    </p>
                                  </div>
                                  <div className="flex items-center">
                                    {[...Array(booking.rating)].map((_, i) => (
                                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                  <div>
                                    <p className="text-gray-600">Check-in</p>
                                    <p className="font-medium">{format(booking.checkIn, "EEE, MMM d yyyy")}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Check-out</p>
                                    <p className="font-medium">{format(booking.checkOut, "EEE, MMM d yyyy")}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Total amount</p>
                                    <p className="font-medium">₹{booking.price.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Booking ID</p>
                                    <p className="font-medium">VR{booking.id}7823</p>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-3 mt-5">
                                  <Button variant="outline">View details</Button>
                                  <Button variant="secondary">Book again</Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cancelled">
                    <div className="mt-8 text-center">
                      <p className="text-gray-600">No cancelled bookings found</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Your Wishlist</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {wishlists.map((list) => (
                    <Card key={list.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        <img 
                          src={list.coverImage} 
                          alt={list.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                          <div className="p-4 text-white">
                            <h3 className="font-bold text-lg">{list.name}</h3>
                            <p className="text-sm opacity-90">{list.count} properties</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed">
                    <div className="h-48 flex items-center justify-center text-center">
                      <div>
                        <Heart className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                        <h3 className="font-medium">Create a new wishlist</h3>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <h3 className="text-xl font-medium">Saved properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedProperties.map((property) => (
                    <Card key={property.id} className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden">
                      <div className="relative">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                        >
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{property.title}</h3>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{property.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {property.location}
                        </p>
                        <div>
                          <span className="font-bold">₹{property.price.toLocaleString()}</span>
                          <span className="text-gray-600"> / night</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Messages</h2>
                
                <div className="space-y-4">
                  {messages.map((message) => (
                    <Card key={message.id} className={`hover:shadow-md transition-shadow ${message.unread ? 'border-l-4 border-l-blue-500' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={message.image} />
                            <AvatarFallback>{message.host[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{message.host}</h3>
                              <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">{message.property}</p>
                            <p className="text-sm line-clamp-2">{message.lastMessage}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="text-center">
                    <p className="text-gray-600">No more messages</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Notifications</h2>
                
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`hover:shadow-md transition-shadow ${!notification.read ? 'bg-blue-50' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          </div>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button variant="outline">Mark all as read</Button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Account Settings</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" />
                        <AvatarFallback>TP</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Change photo
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" defaultValue="Tanvi" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" defaultValue="Patel" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" type="email" defaultValue="tanvi.patel@example.com" />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone number</Label>
                      <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue="Mumbai, India" />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" rows={3} placeholder="Write something about yourself..." />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-10 h-10 text-gray-600" />
                        <div>
                          <p className="font-medium">•••• •••• •••• 4528</p>
                          <p className="text-sm text-gray-600">Expires 05/25</p>
                        </div>
                      </div>
                      <Badge>Default</Badge>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Add payment method
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    
                    <div>
                      <Label htmlFor="newPassword">New password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm new password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    
                    <Button className="bg-pink-500 hover:bg-pink-600">Update password</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email notifications</p>
                          <p className="text-sm text-gray-600">Receive emails about your booking activity</p>
                        </div>
                        <div className="flex items-center h-4">
                          <input type="checkbox" className="h-4 w-4 rounded" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS notifications</p>
                          <p className="text-sm text-gray-600">Receive text messages for booking updates</p>
                        </div>
                        <div className="flex items-center h-4">
                          <input type="checkbox" className="h-4 w-4 rounded" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing communications</p>
                          <p className="text-sm text-gray-600">Receive travel deals and recommendations</p>
                        </div>
                        <div className="flex items-center h-4">
                          <input type="checkbox" className="h-4 w-4 rounded" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex space-x-4">
                  <Button className="bg-pink-500 hover:bg-pink-600">Save changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
