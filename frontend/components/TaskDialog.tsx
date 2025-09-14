"use client";
import React from "react";
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
    title?: string;
    description?: string;
    onEditConfirm?: () => void;
}

export default function TaskDialog({ children, title, description, onEditConfirm }: TaskDialogProps){
    return(
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        <Textarea value={description}>
                        </Textarea>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={onEditConfirm}>Save changes</Button>
                </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )

}