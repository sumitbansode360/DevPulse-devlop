'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  User,
  Edit,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  Mail,
  Save,
  Camera,
  Shield,
  Award
} from 'lucide-react'

// Types
interface UserProfile {
  firstName: string
  lastName: string
  username: string
  email: string
  role: string
  avatar: string
  joinDate: string
  lastLogin: string
  location?: string
  company?: string
  bio?: string
  skills: string[]
}

// Dummy user data
const dummyUser: UserProfile = {
  firstName: 'Alex',
  lastName: 'Johnson',
  username: 'alexjohnson',
  email: 'alex.johnson@example.com',
  role: 'Full Stack Developer',
  avatar: '/api/placeholder/128/128',
  joinDate: '2023-01-15',
  lastLogin: '2024-01-15T10:30:00Z',
  location: 'San Francisco, CA',
  company: 'TechCorp Inc.',
  bio: 'Passionate developer building amazing web experiences',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'AWS']
}

const roles = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Designer',
  'Product Manager',
  'Data Scientist',
  'DevOps Engineer',
  'Student',
  'Other'
]

// Edit Profile Form Component
function EditProfileForm({ 
  user, 
  onSave, 
  onCancel 
}: { 
  user: UserProfile
  onSave: (updatedUser: Partial<UserProfile>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    role: user.role,
    location: user.location || '',
    company: user.company || '',
    bio: user.bio || '',
    password: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      onSave(formData)
      setIsLoading(false)
      onCancel()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="text-lg">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Button 
            type="button"
            size="sm" 
            variant="outline" 
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
          >
            <Camera className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Click to change avatar</p>
      </div>

      <Separator />

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <Separator />

      {/* Professional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Professional Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Your company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, State"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            placeholder="Tell us about yourself"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>
      </div>

      <Separator />

      {/* Security */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Security</h3>
        
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Leave blank to keep current password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Leave blank if you don't want to change your password
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Main Profile Page Component
export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>(dummyUser)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleSaveProfile = (updatedData: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updatedData }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-xl">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.firstName} {user.lastName}</CardTitle>
                <CardDescription className="text-base">@{user.username}</CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </div>
            
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your profile information and settings.
                  </DialogDescription>
                </DialogHeader>
                <EditProfileForm 
                  user={user}
                  onSave={handleSaveProfile}
                  onCancel={() => setIsEditDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        {user.bio && (
          <CardContent>
            <p className="text-muted-foreground">{user.bio}</p>
          </CardContent>
        )}
      </Card>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Role</span>
              </div>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Member since</span>
              </div>
              <span className="text-sm text-muted-foreground">{formatDate(user.joinDate)}</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last login</span>
              </div>
              <span className="text-sm text-muted-foreground">{formatLastLogin(user.lastLogin)}</span>
            </div>

            {user.location && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{user.location}</span>
                </div>
              </>
            )}

            {user.company && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Company</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{user.company}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Skills & Expertise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Skills & Expertise</span>
            </CardTitle>
            <CardDescription>Your technical skills and areas of expertise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                <Edit className="h-3 w-3 mr-2" />
                Edit Skills
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Statistics */}
      <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">89</div>
              <div className="text-sm text-muted-foreground">Learning Entries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">45</div>
              <div className="text-sm text-muted-foreground">Pomodoro Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.floor((new Date().getTime() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-muted-foreground">Days Active</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}