'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Github,
  Search,
  Star,
  GitFork,
  Calendar,
  Users,
  BookOpen,
  MapPin,
  Link as LinkIcon,
  Activity,
  TrendingUp,
  ExternalLink
} from 'lucide-react'

// Types
interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  bio: string
  location: string
  blog: string
  public_repos: number
  followers: number
  following: number
  created_at: string
  company?: string
}

interface Repository {
  id: number
  name: string
  full_name: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
  updated_at: string
  html_url: string
  private: boolean
}

// Dummy data for demonstration
const dummyUser: GitHubUser = {
  login: 'octocat',
  name: 'The Octocat',
  avatar_url: 'https://github.com/octocat.png',
  bio: 'GitHub mascot and Git guru. Building the future of software development.',
  location: 'San Francisco',
  blog: 'https://github.blog',
  public_repos: 8,
  followers: 4892,
  following: 9,
  created_at: '2011-01-25T18:44:36Z',
  company: '@github'
}

const dummyRepos: Repository[] = [
  {
    id: 1,
    name: 'Hello-World',
    full_name: 'octocat/Hello-World',
    description: 'My first repository on GitHub!',
    stargazers_count: 2345,
    forks_count: 1234,
    language: 'JavaScript',
    updated_at: '2024-01-15T10:30:00Z',
    html_url: 'https://github.com/octocat/Hello-World',
    private: false
  },
  {
    id: 2,
    name: 'Spoon-Knife',
    full_name: 'octocat/Spoon-Knife',
    description: 'This repo is for demonstration purposes only.',
    stargazers_count: 12000,
    forks_count: 143000,
    language: 'HTML',
    updated_at: '2024-01-14T15:22:00Z',
    html_url: 'https://github.com/octocat/Spoon-Knife',
    private: false
  },
  {
    id: 3,
    name: 'git-consortium',
    full_name: 'octocat/git-consortium',
    description: 'A consortium of Git-related projects',
    stargazers_count: 567,
    forks_count: 89,
    language: 'Go',
    updated_at: '2024-01-13T09:15:00Z',
    html_url: 'https://github.com/octocat/git-consortium',
    private: false
  },
  {
    id: 4,
    name: 'linguist',
    full_name: 'octocat/linguist',
    description: 'Language Savant. If your repository\'s language is being reported incorrectly, send us a pull request!',
    stargazers_count: 11500,
    forks_count: 4200,
    language: 'Ruby',
    updated_at: '2024-01-12T14:45:00Z',
    html_url: 'https://github.com/octocat/linguist',
    private: false
  }
]

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
  PHP: '#4F5D95'
}

// Contribution chart placeholder component
function ContributionChart() {
  // Generate dummy contribution data
  const weeks = 53
  const days = 7
  const contributions = Array.from({ length: weeks }, (_, weekIndex) =>
    Array.from({ length: days }, (_, dayIndex) => {
      const intensity = Math.random()
      return {
        date: `2024-${String(Math.floor(weekIndex / 4) + 1).padStart(2, '0')}-${String(dayIndex + 1).padStart(2, '0')}`,
        count: Math.floor(intensity * 10),
        level: intensity > 0.8 ? 4 : intensity > 0.6 ? 3 : intensity > 0.4 ? 2 : intensity > 0.2 ? 1 : 0
      }
    })
  )

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100 dark:bg-gray-800'
      case 1: return 'bg-green-200 dark:bg-green-900'
      case 2: return 'bg-green-300 dark:bg-green-700'
      case 3: return 'bg-green-400 dark:bg-green-600'
      case 4: return 'bg-green-500 dark:bg-green-500'
      default: return 'bg-gray-100 dark:bg-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Contribution Activity</h3>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-2 h-2 rounded-sm ${getLevelColor(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      <ScrollArea className="w-full">
        <div className="grid grid-flow-col gap-1 min-w-fit p-2">
          {contributions.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-2 h-2 rounded-sm ${getLevelColor(day.level)}`}
                  title={`${day.count} contributions on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// Repository card component
function RepositoryCard({ repo }: { repo: Repository }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-900/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex items-center space-x-2 mb-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors truncate"
              >
                {repo.name}
              </a>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </CardTitle>
            {repo.description && (
              <CardDescription className="line-clamp-2 mb-3">
                {repo.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {repo.language && (
              <div className="flex items-center space-x-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: languageColors[repo.language] || '#gray' }}
                />
                <span>{repo.language}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3" />
              <span>{repo.stargazers_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitFork className="h-3 w-3" />
              <span>{repo.forks_count.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated {formatDate(repo.updated_at)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main GitHub Tracker Component
export default function GitHubTracker() {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!username.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call - In real app, you'd call GitHub API here
      setTimeout(() => {
        setUser({ ...dummyUser, login: username })
        setRepos(dummyRepos)
        setIsLoading(false)
      }, 1000)
    } catch (err) {
      setError('Failed to fetch GitHub data')
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground flex items-center justify-center space-x-3 mb-4">
          <Github className="h-10 w-10" />
          <span>GitHub Activity Tracker</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Track GitHub profiles, repositories, and contribution activity
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
            Enter a GitHub username to view their profile and repository activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter GitHub username (e.g., octocat)"
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

      {/* User Profile */}
      {user && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Profile Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex flex-col items-center md:items-start space-y-4">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32">
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name?.charAt(0) || user.login.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      View Profile
                    </a>
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                    <p className="text-muted-foreground">@{user.login}</p>
                  </div>
                  
                  {user.bio && (
                    <p className="text-foreground">{user.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {user.company && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{user.company}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.blog && (
                      <div className="flex items-center space-x-1">
                        <LinkIcon className="h-4 w-4" />
                        <a href={user.blog} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                          {user.blog}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{user.public_repos}</div>
                      <div className="text-sm text-muted-foreground">Repositories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{user.followers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{user.following.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Following</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Contribution Activity</span>
              </CardTitle>
              <CardDescription>
                GitHub contributions for the past year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContributionChart />
            </CardContent>
          </Card>

          {/* Repositories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Recent Repositories</span>
              </CardTitle>
              <CardDescription>
                Latest public repositories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {repos.map((repo) => (
                  <RepositoryCard key={repo.id} repo={repo} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!user && !isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Github className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Ready to explore GitHub profiles?
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter a GitHub username above to view detailed profile information, repository activity, and contribution charts.
          </p>
        </div>
      )}
    </div>
  )
}