import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, CheckCircle2, Clock } from 'lucide-react'
import TaskDialog from '@/components/TaskDialog'
import AlertDelete from '@/components/AlertDelete'


// Types
interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'completed';
  count: {
    all: number;
    pending: number;
    completed: number;
  };
}

// Task Card Component
interface TaskCardProps {
  task: Task
  onEdit: (updatedTask: Task) => Promise<void>
  onDelete: (taskId: string) => void
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getBadgeVariant = (status: Task['status']) => {
    return status === 'completed' ? 'default' : 'secondary'
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
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <TaskDialog
              header="Edit Task"
              title={task.title}
              description={task.description}
              status={task.status}
              onSave={(updatedData) => onEdit({ ...task, ...updatedData })}
            >
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
            <span className={`font-medium ${new Date(task.dueDate) < new Date() && task.status === 'pending' ? 'text-red-500' : 'text-muted-foreground'}`}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}