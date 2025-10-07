'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  BookOpen,
  Calendar,
  PlusCircle,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react'

// Types
interface Log {
  id: string
  title: string
  note: string
  date: string
}

interface Topic {
  id: string
  title: string
  category: string
  createdAt: string
}

// Dummy Data
const topic: Topic = {
  id: '1',
  title: 'FastAPI Fundamentals',
  category: 'Programming',
  createdAt: '2025-10-02'
}

const dummyLogs: Log[] = [
  {
    id: '1',
    title: 'Understanding Async/Await',
    note: 'Learned how FastAPI leverages Python\'s async/await syntax for handling concurrent requests. Key takeaway: use async def for I/O-bound operations like database queries or API calls. This significantly improves performance for high-traffic applications. The event loop manages multiple requests without blocking, making FastAPI incredibly fast compared to traditional Flask apps.',
    date: '2025-10-05'
  },
  {
    id: '2',
    title: 'Path Parameters and Query Parameters',
    note: 'Explored the difference between path parameters (required, part of URL) and query parameters (optional, after ?). FastAPI automatically validates types and provides great error messages. Example: @app.get("/items/{item_id}") for path params, and Query() for advanced query parameter validation.',
    date: '2025-10-04'
  },
  {
    id: '3',
    title: 'Pydantic Models for Request Validation',
    note: 'Discovered how Pydantic models make data validation incredibly easy. Define a class with type hints, and FastAPI automatically validates incoming JSON. This eliminates tons of boilerplate code and provides automatic API documentation through OpenAPI/Swagger.',
    date: '2025-10-03'
  },
  {
    id: '4',
    title: 'Setting Up First FastAPI Project',
    note: 'Created my first FastAPI application! Installed via pip, created a simple "Hello World" endpoint, and ran it with uvicorn. The auto-generated docs at /docs are amazing - interactive API documentation out of the box!',
    date: '2025-10-02'
  }
]

// Category colors
const categoryColors: { [key: string]: string } = {
  Programming: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Design: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  Personal: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Business: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
}

// Format date helper
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Log Card Component
function LogCard({ log, onEdit, onDelete }: {
  log: Log
  onEdit: (log: Log) => void
  onDelete: (id: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const notePreview = log.note.length > 200 ? log.note.substring(0, 200) + '...' : log.note
  const needsExpansion = log.note.length > 200

  return (
      <Card className="transition-all duration-200 hover:shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-900/20 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{formatDate(log.date)}</span>
              </div>
              {log.title && (
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {log.title}
                </h3>
              )}
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(log)}
                className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(log.id)}
                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {isExpanded ? log.note : notePreview}
          </p>
          {needsExpansion && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Read More
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
  )
}

// Add Log Dialog Component
function AddLogDialog({ 
  isOpen, 
  onClose,
  topicTitle 
}: { 
  isOpen: boolean
  onClose: () => void
  topicTitle: string
}) {
  const [formData, setFormData] = useState({
    title: '',
    note: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('New log data:', {
      ...formData,
      topicTitle,
      date: new Date().toISOString()
    })
    // Reset form
    setFormData({ title: '', note: '' })
    onClose()
  }

  const handleClose = () => {
    setFormData({ title: '', note: '' })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Log</DialogTitle>
          <DialogDescription>
            Record what you learned about <strong>{topicTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              placeholder="e.g., Understanding Async/Await"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">What did you learn?</Label>
            <Textarea
              id="note"
              placeholder="Describe your learnings, insights, and key takeaways..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={6}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.note.length} characters
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.note.trim()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Save Log
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Empty State Component
function EmptyState({ onAddLog }: { onAddLog: () => void }) {
  return (
    <>
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <BookOpen className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No logs yet
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Start writing your learning journey! Document your progress, insights, and key takeaways.
      </p>
      <Button onClick={onAddLog} size="lg">
        <PlusCircle className="h-5 w-5 mr-2" />
        Add Your First Log
      </Button>
    </>
  )
}

// Main Topic Logs Page Component
export default function TopicLogsPage() {
  const [logs, setLogs] = useState<Log[]>(dummyLogs)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleEditLog = (log: Log) => {
    console.log('Edit log:', log.id)
    // Here you would open an edit dialog or navigate to edit page
  }

  const handleDeleteLog = (id: string) => {
    console.log('Delete log:', id)
    setLogs(logs.filter(log => log.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <Badge className={categoryColors[topic.category] || 'bg-gray-100'}>
                  {topic.category}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {topic.title}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Started on {formatDate(topic.createdAt)}</span>
                <span className="mx-2">•</span>
                <Sparkles className="h-4 w-4" />
                <span>{logs.length} {logs.length === 1 ? 'log' : 'logs'}</span>
              </div>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Log
            </Button>
          </div>
        </div>

        {/* Logs List or Empty State */}
        {logs.length === 0 ? (
          <EmptyState onAddLog={() => setIsAddDialogOpen(true)} />
        ) : (
          <div className="space-y-4">
              {logs.map((log) => (
                <LogCard
                  key={log.id}
                  log={log}
                  onEdit={handleEditLog}
                  onDelete={handleDeleteLog}
                />
              ))}
          </div>
        )}

        {/* Summary Footer */}
        {logs.length > 0 && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Learning Progress</h3>
                <p className="text-sm text-muted-foreground">
                  You've documented <strong>{logs.length}</strong> learning {logs.length === 1 ? 'entry' : 'entries'} for this topic.
                  Keep up the great work! 🎉
                </p>
              </div>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add More
              </Button>
            </div>
        )}

        {/* Add Log Dialog */}
        <AddLogDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          topicTitle={topic.title}
        />
      </div>
    </div>
  )
}