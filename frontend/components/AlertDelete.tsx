"use client";

import React from "react";
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
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";

interface AlertDeleteProps {
  children: React.ReactNode;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function AlertDelete({ children, onConfirm, title, description }: AlertDeleteProps) {
    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>{title || "Are you absolutely sure?"}</AlertDialogTitle>
                <AlertDialogDescription>
                    {description || "This action cannot be undone. This will permanently delete your data."}
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {/* The action is wrapped in DialogClose to ensure the dialog closes on confirm */}
                <AlertDialogAction asChild><Button onClick={onConfirm}>Continue</Button></AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
