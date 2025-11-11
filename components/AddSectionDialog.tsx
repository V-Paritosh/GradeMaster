"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useGradeStore } from "@/store/gradeStore";

interface AddSectionDialogProps {
  classId: string;
}

export const AddSectionDialog = ({ classId }: AddSectionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const [weight, setWeight] = useState("30");
  const addSection = useGradeStore((state) => state.addSection);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sectionName.trim() && weight) {
      addSection(classId, sectionName.trim(), parseFloat(weight));
      setSectionName("");
      setWeight("30");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-olive text-background hover:bg-olive/90 shadow-lg shadow-olive/30 hover:shadow-olive/50 transition-all">
          <Plus className="w-4 h-4" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate border-slate">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Add New Section</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sectionName" className="text-foreground">Section Name</Label>
            <Input
              id="sectionName"
              placeholder="e.g., Formative, Summative"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              className="bg-background border-border focus:border-olive"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-foreground">Weight (%)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="e.g., 30"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-background border-border focus:border-olive"
              min="0"
              max="100"
            />
          </div>
          <Button type="submit" className="w-full bg-olive text-background hover:bg-olive/90">
            Create Section
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
