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
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface TaskDialogProps{
    children: React.ReactNode;
    header: string;
    title?: string;
    description?: string;
    onSave?: (task: Task) => void;
}
interface Task{
    title: string;
    description: string;
}

export default function TaskDialog({ children, title = '', description = '', header, onSave }: TaskDialogProps){
    const [formData, setFormData] = useState<Task>({
        title: title,
        description: description
    });
    const [open, setOpen] = useState(false);

    // This effect syncs the props to the internal state when the dialog is opened.
    // This is crucial for both setting initial values for "Edit" and resetting for "Create".
    useEffect(() => {
        if (open) {
            setFormData({
                title: title,
                description: description,
            });
        }
    }, [title, description, open]);

    const handleSaveChanges = () => {
        if (onSave) {
            onSave(formData);
        }
        setOpen(false); // Close dialog after saving
    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{header}</DialogTitle>
                <DialogDescription>
                    {header.includes("Create") ? "Fill in the details for your new task." : "Update the details for your task."}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Label htmlFor="title">Title</Label>
                <Input 
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                <Label htmlFor="description">Description</Label>
                <Textarea 
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveChanges}>Save changes</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}