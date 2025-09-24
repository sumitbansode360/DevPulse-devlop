'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle2,
  Circle,
  Timer,
  GitCommit,
  BookOpen,
  Play,
  Pause,
  TrendingUp,
  Clock,
  Plus,
  BarChart3,
  Target,
  Zap,
  Calendar
} from 'lucide-react'

// Types
interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

interface LearningEntry {
  id: string
  title: string
  date: string
  category: string
}

interface StatCard {
  title: string
  value: string | number
  change: string
  icon: React.ReactNode
  progress?: number
  color: string
}

// Dummy data
const statsData: StatCard[] = [
  {
    title: 'Tasks Completed',
    value: 12,
    change: '+8 from yesterday',
    icon: <CheckCircle2 className="h-5 w-5" />,
    progress: 75,
    color: 'text-green-600'
  },
  {
    title: 'Pending Tasks',
    value: 5,
    change: '3 due today',
    icon: <Circle className="h-5 w-5" />,
    color: 'text-orange-600'
  },
  {
    title: 'Pomodoro Sessions',
    value: 4,
    change: '+2 from yesterday',
    icon: <Timer className="h-5 w-5" />,
    color: 'text-blue-600'
  },
  {
    title: 'GitHub Commits',
    value: 8,
    change: 'Last 7 days',
    icon: <GitCommit className="h-5 w-5" />,
    color: 'text-purple-600'
  }
]

const recentTasks: Task[] = [
  { id: '1', title: 'Review pull request #234', completed: true, priority: 'high' },
  { id: '2', title: 'Update project documentation', completed: true, priority: 'medium' },
  { id: '3', title: 'Fix responsive design issues', completed: false, priority: 'high' },
  { id: '4', title: 'Prepare weekly team report', completed: false, priority: 'low' },
  { id: '5', title: 'Code review for authentication module', completed: false, priority: 'medium' },
  { id: '6', title: 'Update dependencies', completed: true, priority: 'low' }
]

const learningEntries: LearningEntry[] = [
  { 
    id: '1', 
    title: 'Advanced React Patterns and Performance Optimization', 
    date: '2024-01-15', 
    category: 'React' 
  },
  { 
    id: '2', 
    title: 'TypeScript Generics and Advanced Type System', 
    date: '2024-01-14', 
    category: 'TypeScript' 
  },
  { 
    id: '3', 
    title: 'Database Indexing and Query Optimization', 
    date: '2024-01-13', 
    category: 'Database' 
  }
]

// Stats Card Component
function StatsCard({ stat }: { stat: StatCard }) {
  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {stat.title}
        </CardTitle>
        <div className={`p-2 rounded-full bg-muted ${stat.color}`}>
          {stat.icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{stat.value}</div>
        <p className="text-xs text-muted-foreground mb-2">{stat.change}</p>
        {stat.progress && (
          <div className="space-y-2">
            <Progress value={stat.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{stat.progress}% completion rate</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Pomodoro Timer Component
function PomodoroTimer() {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes
  const [session, setSession] = useState(1)

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      setSession(session + 1)
      setTimeLeft(25 * 60)
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, session])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggle = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(25 * 60)
  }

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-2">
          <Timer className="h-5 w-5" />
          <span>Pomodoro Timer</span>
        </CardTitle>
        <CardDescription>Stay focused with the Pomodoro technique</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-5xl font-bold text-blue-600 mb-4">
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          Session {session} • Focus Time
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleToggle}
            className="flex-1"
            variant={isRunning ? "outline" : "default"}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button onClick={handleReset} variant="outline" size="icon">
            <Target className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Task Item Component
function TaskItem({ task }: { task: Task }) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {task.title}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {task.completed ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
        )}
      </div>
    </div>
  )
}

// Learning Entry Component
function LearningEntryItem({ entry }: { entry: LearningEntry }) {
  return (
    <div className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-muted/50 rounded-r-lg transition-colors">
      <h4 className="font-medium text-sm text-foreground mb-1">{entry.title}</h4>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3" />
          <span>{new Date(entry.date).toLocaleDateString()}</span>
        </div>
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
          {entry.category}
        </span>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function DashboardPage() {
  const username = "Alex"
  const completedTasks = recentTasks.filter(task => task.completed).length
  const totalTasks = recentTasks.length

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          👋 Welcome back, {username}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Here's a quick overview of your productivity today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} stat={stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Tasks - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Recent Tasks</span>
                </CardTitle>
                <CardDescription>
                  {completedTasks} of {totalTasks} tasks completed
                </CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recentTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pomodoro Timer */}
        <div>
          <PomodoroTimer />
        </div>
      </div>

      {/* Learning Log and GitHub Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Log Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Learning Log</span>
              </CardTitle>
              <CardDescription>Your recent learning activities</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {learningEntries.map((entry) => (
                <LearningEntryItem key={entry.id} entry={entry} />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" size="sm" className="w-full">
                View All Entries
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* GitHub Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>GitHub Activity</span>
            </CardTitle>
            <CardDescription>Your coding activity this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Activity Chart</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your GitHub account to see detailed activity metrics
                  </p>
                  <Button size="sm" className="gap-2">
                    <GitCommit className="h-4 w-4" />
                    Connect GitHub
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-8 border-t">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Quick Actions</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <Button variant="outline" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Add Learning Entry
          </Button>
          <Button variant="outline" size="sm">
            <Timer className="h-4 w-4 mr-2" />
            Start Pomodoro
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  )
}