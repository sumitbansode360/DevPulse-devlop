'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'
import AlertDelete from '@/components/AlertDelete'
import TaskDialog from '@/components/TaskDialog'
import axios from 'axios'

// Types
interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'completed'
  createdAt: string
}

type TaskFilter = 'all' | 'pending' | 'completed'


// Task Card Component
interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getBadgeVariant = (status: Task['status']) => {
    return status === 'completed' ? 'default' : 'secondary'
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-3 w-3" />
      case 'medium': return <Clock className="h-3 w-3" />
      case 'low': return <CheckCircle2 className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-900/20 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground mb-2 group-hover:text-blue-600 transition-colors">
              {task.title}
            </CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={getBadgeVariant(task.status)} className="text-xs">
                {task.status === 'completed' ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </>
                )}
              </Badge>
              <div className={`flex items-center space-x-1 ${getPriorityColor(task.priority)}`}>
                {getPriorityIcon(task.priority)}
                <span className="text-xs font-medium capitalize">{task.priority}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <TaskDialog title="Edit Task" description={task.description} onEditConfirm={() => onEdit(task)}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
              >
              <Edit className="h-4 w-4" />
              </Button>
            </TaskDialog>
            <AlertDelete
              onConfirm={() => onDelete(task.id)}
              title="Are you sure you want to delete this task?"
              description={`This will permanently delete the task "${task.title}". This action cannot be undone.`}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-100  dark:hover:bg-red-900/20 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDelete>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </CardDescription>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
          {task.dueDate && (
            <span className={`font-medium ${
              new Date(task.dueDate) < new Date() && task.status === 'pending'
                ? 'text-red-500' 
                : 'text-muted-foreground'
            }`}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Empty State Component
function EmptyState({ onAddTask }: { onAddTask: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <ListTodo className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No tasks found
      </h3>
      <p className="text-muted-foreground text-center mb-6 max-w-sm">
        No tasks found. Create your first task 🚀
      </p>
      <Button onClick={onAddTask} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Task
      </Button>
    </div>
  )
}

// Main Tasks Page Component
export default function TasksPage() {
  const [IsLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all')

  useEffect(() => {
    async function fetchTasks() {
      setIsLoading(true);
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/tasks/',
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        if (res.status === 200) {
          setTasks(res.data)
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
    fetchTasks();
  }, [])
  
  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(task => task.status === activeFilter)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [tasks, activeFilter, searchQuery])

  // Get task counts for tabs
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    completed: tasks.filter(task => task.status === 'completed').length
  }), [tasks])

  // Handlers
  const handleAddTask = () => {
    console.log('Add task clicked')
    // Here you would open a modal or navigate to add task page
  }

  const handleEditTask = (task: Task) => {
    console.log('Edit task:', task.id)
    // Here you would open edit modal or navigate to edit page
  }

  const handleDeleteTask = (taskId: string) => {
    console.log('Delete task:', taskId)
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  return (
    <div className="container mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2 mb-2">
            📝 My Tasks
          </h1>
          <p className="text-muted-foreground">
            Manage your tasks and stay productive
          </p>
        </div>
        <Button onClick={handleAddTask} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-6 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as TaskFilter)}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all" className="relative">
              All
              <Badge variant="secondary" className="ml-2 text-xs">
                {taskCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending
              <Badge variant="secondary" className="ml-2 text-xs">
                {taskCounts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              Completed
              <Badge variant="secondary" className="ml-2 text-xs">
                {taskCounts.completed}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeFilter} className="mt-6">
            {/* Task List or Empty State */}
            {filteredTasks.length === 0 ? (
              <EmptyState onAddTask={handleAddTask} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Summary Stats */}
      {tasks.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">{taskCounts.all}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{taskCounts.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{taskCounts.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}