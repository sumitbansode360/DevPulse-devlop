import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Code, Palette, User, Lightbulb, Target } from "lucide-react";

// Types
export interface LearningEntry {
  id: string;
  title: string;
  category: string;
  start_date: string;
}

// Categories with icons and colors
export const categories = {
  programming: {
    label: "Programming",
    icon: Code,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    dotColor: "bg-blue-500",
  },
  design: {
    label: "Design",
    icon: Palette,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    dotColor: "bg-purple-500",
  },
  personal: {
    label: "Personal",
    icon: User,
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    dotColor: "bg-green-500",
  },
  business: {
    label: "Business",
    icon: Target,
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    dotColor: "bg-orange-500",
  },
  other: {
    label: "Other",
    icon: Lightbulb,
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
    dotColor: "bg-gray-500",
  },
};




export // Add Entry Form Component
function AddEntryForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (entry: Omit<LearningEntry, "id">) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    start_date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.category) {
      onSubmit(formData);
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Topic/Title</Label>
        <Input
          id="title"
          placeholder="What did you learn about?"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categories).map(([key, cat]) => {
                const IconComponent = cat.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{cat.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Learning Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
            required
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </DialogFooter>
    </form>
  );
}