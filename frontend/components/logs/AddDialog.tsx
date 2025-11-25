import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddLogForm } from "@/components/logs/AddLogForm";


// Add Log Dialog Component
export function AddLogDialog({
  isOpen,
  onClose,
  topicTitle,
  topicId,
  fetchTopicsLogs,
}: {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  topicId: string;
  fetchTopicsLogs: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const res = await api.post(`/learnings/topics/${topicId}/logs/`, formData)
      if(res.status===201){
        setFormData({ title: "", note: "" });
        onClose();
        toast.success("Log added successfully");
      }else{
        toast.error("Something went wrong");
      }
      fetchTopicsLogs();
    }catch(error){
      console.log(error)
    }
  };

  const handleClose = () => {
    setFormData({ title: "", note: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Log</DialogTitle>
          <DialogDescription>
            Record what you learned about <strong>{topicTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        <AddLogForm onSubmit={handleSubmit} onCancel={handleClose} formData={formData} setFormData={setFormData} />
      </DialogContent>
    </Dialog>
  );
}
