import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

interface AddLogFormProps {
  onSubmit: (e: React.FormEvent) => void,
  onCancel: () => void,
  formData: {
    title: string,
    note: string,
  },
  setFormData: React.Dispatch<React.SetStateAction<{
    title: string,
    note: string,
  }>>
}
// Add Log Form Component
export function AddLogForm(
  {onSubmit, onCancel, formData, setFormData} : AddLogFormProps

) {
  
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g., Understanding Async/Await"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">What did you learn?</Label>
          <Textarea
            id="note"
            placeholder="Describe your learnings, insights, and key takeaways..."
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            rows={6}
            required
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {formData.note.length} characters
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!formData.note.trim()}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Save Log
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
