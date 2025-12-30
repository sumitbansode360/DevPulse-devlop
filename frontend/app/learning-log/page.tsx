"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookOpen, Plus, Search, Filter, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { LearningEntryCard } from "@/components/LearningTopic/LearningEntry";
import {
  AddEntryForm,
  categories,
  LearningEntry,
} from "@/components/LearningTopic/AddLerninEntry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
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

interface Count {
  all: number;
  programming: number;
  design: number;
  personal: number;
  business: number;
  other: number;
}

// Main Learning Log Component
export default function LearningLogPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FilterType>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [topic, setTopics] = useState<Topic[]>([]);
  const [categoryCount, setCategoryCount] = useState<Count>({
    all: 0,
    programming: 0,
    design: 0,
    personal: 0,
    business: 0,
    other: 0,
  });
  const [prev, setPrev] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  type CategoryKey = keyof typeof categories;

  const calculateCurrentPage = async (data: any) => {
    let page = 1;
    if (data.next) {
      const nextUrl = new URL(data.next);
      const nextPageParam = nextUrl.searchParams.get("page");
      page = nextPageParam ? parseInt(nextPageParam) - 1 : 1;
    } else if (data.previous) {
      const prevUrl = new URL(data.previous);
      const prevPageParam = prevUrl.searchParams.get("page");
      page = prevPageParam ? parseInt(prevPageParam) + 1 : 2;
    }
    return page;
  };
  const fetchTopics = async (url: string = "/learnings/topics/") => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    if (categoryFilter && categoryFilter !== "all") {
      params.append("category", categoryFilter);
    }
    params.append("page_size", pageSize.toString());
    try {
      setIsLoading(true);
      const res = await api.get(url, { params });
      const data = await res.data;
      const result = data.results;
      setTopics(result);
      setCategoryCount(res.data.category_count);
      setPrev(res.data.previous);
      setNext(res.data.next);
      // Calculate current page based on next/prev URLs
      const page = await calculateCurrentPage(data);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.count / pageSize));
      setIsLoading(false);
    } catch (err: any) {
      console.log(err);
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    fetchTopics();
  }, [categoryFilter, pageSize]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTopics();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

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

  const handleEditEntry = async (id: string, title: string) => {
    try {
      const res = await api.patch(`/learnings/topics/${id}/`, { title: title });
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
      if (res.status === 204) {
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
                  All ({categoryCount.all})
                </Badge>
                {Object.entries(categories).map(([key, cat]) => {
                  const typedKey = key as CategoryKey;
                  const IconComponent = cat.icon;
                  const count = categoryCount[typedKey];
                  return (
                    <Badge
                      key={typedKey}
                      variant={
                        categoryFilter === typedKey ? "default" : "secondary"
                      }
                      className={`cursor-pointer ${
                        categoryFilter === key ? cat.color : ""
                      }`}
                      onClick={() => setCategoryFilter(typedKey)}
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

      {isLoading ? (
        <div className="flex flex-col w-full justify-center items-center mt-30">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <>
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
            {/* Pagination */}
            <div className="w-full flex gap-5 mx-auto max-w-6xl items-end justify-end mt-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${pageSize}`}
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 25, 50, 100].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
              <Button
                onClick={() => {
                  prev && fetchTopics(prev);
                }}
                disabled={!prev}
                className="px-4 py-2 rounded disabled:opacity-50 hover:cursor-pointer"
              >
                Prev
              </Button>
              <Button
                onClick={() => {
                  next && fetchTopics(next);
                }}
                disabled={!next}
                className="px-4 py-2 rounded disabled:opacity-50 hover:cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

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
