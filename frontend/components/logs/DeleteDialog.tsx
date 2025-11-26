import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// Add Log Dialog Component
export function DeleteLogDialog({
  isOpen,
  onClose,
  topicId,
  fetchTopicsLogs,
  id,
  log_title,
}: {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  fetchTopicsLogs: () => void;
  id: string;
  log_title: string;
}) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.delete(`/learnings/topics/${topicId}/logs/${id}/`);
      if (res.status === 204) {
        onClose();
        toast.success("Log deleted successfully");
      } else {
        toast.error("Something went wrong");
      }
      fetchTopicsLogs();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this "{log_title}" log entry?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction asChild><Button onClick={handleSubmit}>Continue</Button></AlertDialogAction>
      </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
