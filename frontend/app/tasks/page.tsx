'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  ListTodo,
} from 'lucide-react'
import TaskDialog from '@/components/TaskDialog'
import api from '@/lib/api'
import TaskCard from '@/components/TaskCard'

type Task = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  count: {
    all: number;
    pending: number;
    completed: number;
  };
}

type TaskFilter = 'all' | 'pending' | 'completed'



// Empty State Component
function EmptyState({ onAddTask }: { onAddTask: (taskData: { title: string; description: string; }) => void }) {
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
      <TaskDialog header="Create New Task" title="" description="" onSave={onAddTask}>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </TaskDialog>
    </div>
  )
}

// Main Tasks Page Component
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all')
  const [taskCount, setTaskCount] = useState({all :0, pending: 0, completed: 0})
  
  async function fetchTasks() {
    
    const params = new URLSearchParams();
    if(activeFilter && activeFilter !== 'all'){
      params.append('status', activeFilter);
    }
    
    try{
      const res = await api.get('/tasks/', {params});
      if (res.status === 200){
        setTasks(res.data.results);
        setTaskCount(res.data.count);
      }
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [activeFilter])



  // Handlers
  const handleAddTask = async (taskData: { title: string; description: string; }) => {
    try{
      await api.post('/tasks/', taskData);
      await fetchTasks();
    }catch(err){
      console.log(err); 
      
    }
  };

  const handleEditTask = async (updatedTask: Task) => {
    try{
      await api.put(`/tasks/${updatedTask.id}/`, updatedTask);
      await fetchTasks();
    }catch(err){
      console.log(err);
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try{
      await api.delete(`/tasks/${taskId}/`);
      await fetchTasks();
    }catch(err){
      console.log(err);
    }
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
        <TaskDialog header="Create New Task" title="" description="" onSave={handleAddTask}>
          <Button className="gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </TaskDialog>
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
                {taskCount.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending
              <Badge variant="secondary" className="ml-2 text-xs">
                {taskCount.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              Completed
              <Badge variant="secondary" className="ml-2 text-xs">
                {taskCount.completed}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeFilter} className="mt-6">
            {/* Task List or Empty State */}
            {tasks.length === 0 ? (
              <EmptyState onAddTask={handleAddTask} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                  tasks.map(task =>(
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))
                }
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
              <div className="text-2xl font-bold text-foreground">{taskCount.all}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{taskCount.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{taskCount.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}