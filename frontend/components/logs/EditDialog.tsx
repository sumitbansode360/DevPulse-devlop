import { useEffect, useState } from "react";
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
export function EditLogDialog({
  isOpen,
  onClose,
  topicTitle,
  topicId,
  fetchTopicsLogs,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  topicId: string;
  fetchTopicsLogs: () => void;
  id: string;
}) {
  const [formData, setFormData] = useState({
    title: "",
    note: "",
  });

  useEffect(()=>{
    const fetchLogWithId = async () => {
      try{
        const res = await api.get(`/learnings/topics/${topicId}/logs/${id}/`)
        const data = await res.data;
        setFormData({ title: data.title, note: data.note });
      }catch(error){
        console.log(error)
      }
    }
    fetchLogWithId();
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{  
      const res = await api.put(`/learnings/topics/${topicId}/logs/${id}/`, formData)
      if(res.status===200){
        onClose();
        toast.success("Log edited successfully");
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
          <DialogTitle>Edit Log For {topicTitle}</DialogTitle>
          <DialogDescription>
            Record what you learned about <strong>{topicTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        <AddLogForm onSubmit={handleSubmit} onCancel={handleClose} formData={formData} setFormData={setFormData} />
      </DialogContent>
    </Dialog>
  );
}
