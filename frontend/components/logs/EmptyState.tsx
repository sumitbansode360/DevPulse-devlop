import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle } from "lucide-react";


export function EmptyState({ onAddLog }: { onAddLog: () => void }) {
  return (
    <>
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <BookOpen className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No logs yet
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Start writing your learning journey! Document your progress, insights,
        and key takeaways.
      </p>
      <Button onClick={onAddLog} size="lg">
        <PlusCircle className="h-5 w-5 mr-2" />
        Add Your First Log
      </Button>
    </>
  );
}
