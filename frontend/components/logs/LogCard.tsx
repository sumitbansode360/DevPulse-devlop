import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Edit, Trash2, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditLogDialog } from "@/components/logs/EditDialog";
import { DeleteLogDialog } from "@/components/logs/DeleteDialog";

export interface Log {
  id: string;
  topic: string;
  title: string;
  date: string;
  note: string;
}

// Format date helper
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Log Card Component
export function LogCard({
  log,
  topic,
  topicId,
  fetchTopicsLogs,
}: {
  log: Log;
  topic: any;
  topicId: string;
  fetchTopicsLogs: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const notePreview =
    log.note.length > 200 ? log.note.substring(0, 200) + "..." : log.note;
  const needsExpansion = log.note.length > 200;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-900/20 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatDate(log.date)}
                </span>
              </div>
              {log.title && (
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {log.title}
                </h3>
              )}
            </div>
            <div className="flex items-center space-x-1 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
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
      {/* Edit Log Dialog */}
      <EditLogDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        topicTitle={topic.title}
        topicId={topicId}
        fetchTopicsLogs={fetchTopicsLogs}
        id={log.id}
      />
      {/* Delete Log Dialog */}
      <DeleteLogDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        topicId={topicId}
        fetchTopicsLogs={fetchTopicsLogs}
        id={log.id}
        log_title={log.title}
      />
    </>
  );
}
