"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
        <Button className="h-9 gap-2 bg-olive text-background hover:bg-olive/90 shadow-lg shadow-olive/30 hover:shadow-olive/50 transition-all">
          <Plus className="w-4 h-4" />
          Add Class
        </Button>
      </DialogTrigger>

      {/* KEY CHANGES IN DialogContent:
         1. top-[15%] translate-y-0: Moves modal to the top area on mobile/tablet 
            so the keyboard won't cover it.
         2. md:top-[50%] md:translate-y-[-50%]: Restores perfect centering 
            only on desktop screens.
         3. onOpenAutoFocus: Prevents jarring keyboard jumps on open (optional).
      */}
      <DialogContent
        className="
          sm:max-w-md bg-slate border-slate
          fixed left-[50%] 
          top-[15%] translate-y-0 
          md:top-[50%] md:translate-y-[-50%] 
          gap-4
        "
        // Optional: Prevents the keyboard from flashing open immediately on touch devices
        // Remove this line if you WANT the keyboard to open instantly.
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Add New Class
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="className" className="text-foreground">
              Class Name
            </Label>
            <Input
              id="className"
              placeholder="e.g., Physics, Mathematics"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="bg-background border-border focus:border-olive"
              // Only autoFocus if we didn't prevent it in DialogContent,
              // or keep it to allow typing once user taps.
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-olive text-background hover:bg-olive/90"
          >
            Create Class
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
