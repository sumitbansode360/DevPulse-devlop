"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskDialogProps {
  children: React.ReactNode;
  header: string;
  title?: string;
  description?: string;
  status?: string;
  onSave?: (task: Task) => void;
}
interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  created_at: string;
  user: string;
  count: {
    all: number;
    pending: number;
    completed: number;
  };
}

interface formData {
  title: string;
  description: string;
  status: string;
}


export default function TaskDialog({
  children,
  title = "",
  description = "",
  status = "pending",
  header,
  onSave,
}: TaskDialogProps) {
  const [formData, setFormData] = useState<formData>({
    title: title,
    description: description,
    status: status,
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        title: title,
        description: description,
        status: status,
      });
    }
  }, [title, description, status, open]);

  const handleSaveChanges = () => {
    if (onSave) {
      onSave(formData as Task);
    }
    setOpen(false); // Close dialog after saving
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>
            {header.includes("Create")
              ? "Fill in the details for your new task."
              : "Update the details for your task."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="status"
              checked={formData.status === "completed"}
              onCheckedChange={(checked: boolean) =>
                setFormData({
                  ...formData,
                  status: checked ? "completed" : "pending",
                })
              }
            />
            <Label htmlFor="status" className="cursor-pointer font-normal">
              Mark as completed
            </Label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveChanges}>
            {title ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
