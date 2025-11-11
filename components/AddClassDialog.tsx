"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useGradeStore } from "@/store/gradeStore";

export const AddClassDialog = () => {
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const addClass = useGradeStore((state) => state.addClass);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (className.trim()) {
      addClass(className.trim());
      setClassName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-olive text-background hover:bg-olive/90 shadow-lg shadow-olive/30 hover:shadow-olive/50 transition-all">
          <Plus className="w-4 h-4" />
          Add Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate border-slate">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Add New Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="className" className="text-foreground">Class Name</Label>
            <Input
              id="className"
              placeholder="e.g., Physics, Mathematics"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="bg-background border-border focus:border-olive"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full bg-olive text-background hover:bg-olive/90">
            Create Class
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
