"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  Filter,
  Code,
  Palette,
  User,
  Lightbulb,
  Target,
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner"

// Types
interface LearningEntry {
  id: string;
  title: string;
  category: string;
  start_date: string;
}

interface Topic {
  id: string;
  title: string;
  category: string;
  start_date: string;
  user: string;
}

type FilterType =
  | "all"
  | "programming"
  | "design"
  | "personal"
  | "business"
  | "other";

// Categories with icons and colors
const categories = {
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

// Add Entry Form Component
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

// Learning Entry Card Component
function LearningEntryCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: LearningEntry;
  onEdit: (id:string, title: string) => void;
  onDelete: (id: string) => void;
}) {
  const category =
    categories[entry.category as keyof typeof categories] || categories.other;
  const IconComponent = category.icon;
  const router = useRouter();
  const [title, setTitle] = useState(entry.title);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateNotes = (notes: string, maxLength: number = 150) => {
    return notes.length > maxLength
      ? `${notes.substring(0, maxLength)}...`
      : notes;
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-900/20 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground mb-2 group-hover:text-blue-600 transition-colors">
              {entry.title}
            </CardTitle>
            <div className="flex items-center space-x-3 mb-2">
              <Badge className={category.color}>
                <IconComponent className="h-3 w-3 mr-1" />
                {category.label}
              </Badge>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(entry.start_date)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Topic</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="title">Topic</Label>
                    <Input
                      id="title"
                      name="name"
                      defaultValue={title}
                      onChange={(e) =>
                        setTitle(e.target.value)
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={() =>{
                    onEdit(entry.id, title)
                    setIsEditDialogOpen(false)
                  }
                  }>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Topic?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your topic. Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(entry.id)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          onClick={() => router.push(`learning-log/${entry.id}/`)}
        >
          View logs
        </Button>
      </CardContent>
    </Card>
  );
}

// Main Learning Log Component
export default function LearningLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FilterType>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [topic, setTopics] = useState<Topic[]>([]);

  const fetchTopics = async () => {
    try {
      const res = await api.get("/learnings/topics/");
      const data = await res.data;
      setTopics(data);
    } catch (err: any) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchTopics();
  }, []);

  // Handlers
  const handleAddEntry = async (entry: Omit<LearningEntry, "id">) => {
    try {
      const res = await api.post("/learnings/topics/", entry);
      // Close the dialog after successful submission
      if (res.status === 201) {
        setIsAddDialogOpen(false);
        toast.success("Learning added successfully!");
      }
      fetchTopics();
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const handleEditEntry = async (id:string, title: string) => {
    try {
      const res = await api.patch(`/learnings/topics/${id}/`, {title: title});
      if (res.status === 200) {
        toast.success("Learning updated successfully!");
      }
      fetchTopics();
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const res = await api.delete(`/learnings/topics/${id}/`);
      if(res.status === 204){
        toast.success("Learning deleted successfully!");
      }
      fetchTopics();
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Learning Log</h1>
            <p className="text-muted-foreground">
              Track your learning journey and insights
            </p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Learning Entry</DialogTitle>
              <DialogDescription>
                Record what you learned today. Add notes, insights, and
                categorize your learning.
              </DialogDescription>
            </DialogHeader>
            <AddEntryForm
              onSubmit={handleAddEntry}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search learning entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={categoryFilter === "all" ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setCategoryFilter("all")}
                >
                  All ()
                </Badge>
                {Object.entries(categories).map(([key, cat]) => {
                  const IconComponent = cat.icon;
                  const count = 0;
                  return (
                    <Badge
                      key={key}
                      variant={categoryFilter === key ? "default" : "secondary"}
                      className={`cursor-pointer ${
                        categoryFilter === key ? cat.color : ""
                      }`}
                      onClick={() => setCategoryFilter(key as FilterType)}
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {cat.label} ({count})
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Entries List */}
      <div className="space-y-6">
        {topic.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchQuery || categoryFilter !== "all"
                    ? "No entries found"
                    : "Start your learning journey"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  {searchQuery || categoryFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Record your first learning experience and build a knowledge base of your growth."}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4 pr-4">
              {topic.map((topic) => (
                <LearningEntryCard
                  key={topic.id}
                  entry={topic}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Summary Stats */}
      {topic.length > 0 && (
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {topic.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Entries
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Object.keys(categories).length}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm text-muted-foreground">
                  Learning Years
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
