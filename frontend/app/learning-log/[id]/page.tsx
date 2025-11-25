"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  PlusCircle,
  Sparkles,
  Code,
  Palette,
  User,
  Lightbulb,
  Target,
} from "lucide-react";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import { LogCard, formatDate } from "@/components/logs/LogCard";
import { AddLogDialog } from "@/components/logs/AddDialog";
import { EmptyState } from "@/components/logs/EmptyState";

// Types
interface Log {
  id: string;
  topic: string;
  title: string;
  date: string;
  note: string;
}

interface Topic {
  id: string;
  title: string;
  start_date: string;
  category: string;
  user: string;
  logs: Log[];
}

// Category colors
const categories = {
  programming: {
    label: 'Programming',
    icon: Code,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    dotColor: 'bg-blue-500'
  },
  design: {
    label: 'Design',
    icon: Palette,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    dotColor: 'bg-purple-500'
  },
  personal: {
    label: 'Personal',
    icon: User,
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    dotColor: 'bg-green-500'
  },
  business: {
    label: 'Business',
    icon: Target,
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    dotColor: 'bg-orange-500'
  },
  other: {
    label: 'Other',
    icon: Lightbulb,
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
    dotColor: 'bg-gray-500'
  }
}

// Main Topic Logs Page Component
export default function TopicLogsPage() {
  const [logs, setLogs] = useState<Log[] | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);

  const id = useParams();
  const topicId = id.id as string;

  async function fetchTopicsLogs() {
    if (!topicId) return;
    try {
      const res = await api.get<Topic>(`/learnings/topics/${topicId}/`);
      const data = await res.data;
      setTopic(data);
      setLogs(data.logs);
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTopicsLogs();
  }, [topicId]);

  const handleEditLog = (log: Log) => {
    console.log("Edit log:", log.id);
    // Here you would open an edit dialog or navigate to edit page
  };

  const handleDeleteLog = (id: string) => {
    console.log("Delete log:", id);
    setLogs(logs.filter((log) => log.id !== id));
  };

  if (!topic || logs === null) {
    return <div>Loading...</div>; // Or a proper loading skeleton
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
                <Badge className={categories[topic.category as keyof typeof categories]?.color || "bg-gray-100"}>
                  {categories[topic.category as keyof typeof categories]?.label || topic.category}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {topic.title}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Started on {formatDate(topic.start_date)}</span>
                <span className="mx-2">•</span>
                <Sparkles className="h-4 w-4" />
                <span>
                  {logs.length} {logs.length === 1 ? "log" : "logs"}
                </span>
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
                You've documented <strong>{logs.length}</strong> learning{" "}
                {logs.length === 1 ? "entry" : "entries"} for this topic. Keep
                up the great work! 🎉
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
          topicId={topicId}
          fetchTopicsLogs={fetchTopicsLogs}
        />
      </div>
    </div>
  );
}
