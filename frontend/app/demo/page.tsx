'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Github,
  Search,
  Activity,
  TrendingUp,
  Code,
  GitBranch,
  Calendar,
  Zap
} from 'lucide-react'

// Types matching your API response
interface GitHubData {
  username: string
  total_repos: number
  top_languages: [string, number][]
  weekly_activity: any[]
  recent_events: GitHubEvent[]
}

// Types for events
interface GitHubEvent {
  type: string
  repo_name: string
  message: string
  created_at: string
}

// Language color mapping
const languageColors: { [key: string]: string } = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  'C++': '#f34b7d',
  C: '#555555',
  Swift: '#ffac45',
  Kotlin: '#F18E33'
}

// Sample data matching your structure
const sampleData: GitHubData = {
  username: "sumitbansode360",
  total_repos: 23,
  top_languages: [
    ["Python", 4],
    ["JavaScript", 4],
    ["HTML", 3]
  ],
  weekly_activity: [],
  recent_events: [
    {
      type: "PushEvent",
      repo_name: "task-manager",
      message: "fix bug in login API",
      created_at: "2025-10-03T11:42:00Z"
    },
    {
      type: "CreateEvent",
      repo_name: "devpulse-frontend",
      message: "created repository",
      created_at: "2025-10-02T09:00:00Z"
    },
    {
      type: "PullRequestEvent",
      repo_name: "django-backend",
      message: "opened pull request #42",
      created_at: "2025-09-30T18:30:00Z"
    }
  ]
}

// Top Languages Component
function TopLanguages({ languages }: { languages: [string, number][] }) {
  if (!languages || languages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No language data available
      </div>
    )
  }

  const totalRepos = languages.reduce((sum, [_, count]) => sum + count, 0)

  return (
    <div className="space-y-4">
      {languages.map(([language, count]) => {
        const percentage = (count / totalRepos) * 100
        const color = languageColors[language] || '#gray'
        
        return (
          <div key={language} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium">{language}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{count} repos</span>
                <span className="text-sm font-semibold">{percentage.toFixed(1)}%</span>
              </div>
            </div>
            <Progress 
              value={percentage} 
              className="h-2"
              style={{ 
                ['--progress-background' as any]: color 
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

// Types for events
interface GitHubEvent {
  type: string
  repo_name: string
  message: string
  created_at: string
}

// Get event icon and color based on type
function getEventIcon(type: string) {
  switch (type) {
    case 'PushEvent':
      return { icon: GitBranch, color: 'bg-green-100 dark:bg-green-900/20 text-green-600' }
    case 'CreateEvent':
      return { icon: Zap, color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' }
    case 'PullRequestEvent':
      return { icon: TrendingUp, color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' }
    case 'IssuesEvent':
      return { icon: Calendar, color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' }
    default:
      return { icon: Activity, color: 'bg-gray-100 dark:bg-gray-900/20 text-gray-600' }
  }
}

// Format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Recent Events Component
function RecentEvents({ events }: { events: GitHubEvent[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
        <p className="text-sm text-muted-foreground">
          Activity will appear here once you start contributing
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => {
        const { icon: EventIcon, color } = getEventIcon(event.type)
        
        return (
          <div 
            key={index} 
            className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
          >
            {/* Icon */}
            <div className={`p-2.5 rounded-lg ${color} flex-shrink-0`}>
              <EventIcon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {event.repo_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.message}
                  </p>
                </div>
                <Badge variant="outline" className="flex-shrink-0 text-xs">
                  {event.type.replace('Event', '')}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatTimeAgo(event.created_at)}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Main GitHub Tracker Component
export default function GitHubTracker() {
  const [username, setUsername] = useState('')
  const [data, setData] = useState<GitHubData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!username.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Replace this URL with your actual API endpoint
      const response = await fetch(`/api/github/${username}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub data')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data')
      // For demo purposes, use sample data
      setTimeout(() => {
        setData({ ...sampleData, username })
        setError(null)
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground flex items-center justify-center space-x-3 mb-4">
          <Github className="h-10 w-10" />
          <span>GitHub Activity Tracker</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Track GitHub profiles, repositories, and coding activity
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search GitHub User</span>
          </CardTitle>
          <CardDescription>
            Enter a GitHub username to view their coding statistics and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter GitHub username (e.g., sumitbansode360)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading || !username.trim()}>
              {isLoading ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* User Data Display */}
      {data && (
        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
                    <Github className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">@{data.username}</CardTitle>
                    <CardDescription>GitHub Developer Profile</CardDescription>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <a 
                    href={`https://github.com/${data.username}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Repositories */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.total_repos}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Public repositories on GitHub
                </p>
              </CardContent>
            </Card>

            {/* Languages Count */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Programming Languages</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.top_languages.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Different languages used
                </p>
              </CardContent>
            </Card>

            {/* Activity Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {data.recent_events.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Events tracked recently
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Top Languages</span>
                </CardTitle>
                <CardDescription>
                  Most used programming languages across repositories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopLanguages languages={data.top_languages} />
              </CardContent>
            </Card>

            {/* Language Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Language Distribution</span>
                </CardTitle>
                <CardDescription>
                  Repository count by programming language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.top_languages.map(([language, count]) => {
                    const color = languageColors[language] || '#gray'
                    return (
                      <div key={language} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <div>
                            <p className="font-medium">{language}</p>
                            <p className="text-xs text-muted-foreground">
                              {count} {count === 1 ? 'repository' : 'repositories'}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Latest GitHub events and contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentEvents events={data.recent_events} />
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Profile Summary</h3>
                  <p className="text-muted-foreground">
                    <strong>@{data.username}</strong> has <strong>{data.total_repos}</strong> public repositories
                    using <strong>{data.top_languages.length}</strong> different programming languages.
                    {data.top_languages.length > 0 && (
                      <> Most used: <strong>{data.top_languages[0][0]}</strong>.</>
                    )}
                  </p>
                </div>
                <Github className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!data && !isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Github className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Ready to explore GitHub profiles?
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter a GitHub username above to view their coding statistics, top languages, and repository information.
          </p>
        </div>
      )}
    </div>
  )
}