"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Section, letterToPercentage, calculateSectionPercentage, getGradeColor, getGradeBgColor, calculateEarnedPoints } from "@/lib/gradeCalculations";
import { useGradeStore } from "@/store/gradeStore";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

interface SectionCardProps {
  classId: string;
  section: Section;
}

export const SectionCard = ({ classId, section }: SectionCardProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(section.name);
  const [newAssignment, setNewAssignment] = useState({ name: "", grade: "A", points: "" });

  const updateSectionName = useGradeStore((state) => state.updateSectionName);
  const updateSectionWeight = useGradeStore((state) => state.updateSectionWeight);
  const addAssignment = useGradeStore((state) => state.addAssignment);
  const updateAssignment = useGradeStore((state) => state.updateAssignment);
  const removeAssignment = useGradeStore((state) => state.removeAssignment);
  const removeSection = useGradeStore((state) => state.removeSection);

  const sectionPercentage = calculateSectionPercentage(section.assignments);
  const finalGrade = Object.entries(letterToPercentage).find(([_, value]) => 
    Math.abs(value - sectionPercentage) < 5
  )?.[0] || "F";
  const gradeColorClass = getGradeColor(finalGrade);
  const gradeBgClass = getGradeBgColor(finalGrade);

  const totalEarned = section.assignments.reduce(
    (sum, a) => sum + calculateEarnedPoints(a.totalPoints, a.letterGrade),
    0
  );
  const totalPoints = section.assignments.reduce((sum, a) => sum + a.totalPoints, 0);

  const handleSaveName = () => {
    if (editedName.trim()) {
      updateSectionName(classId, section.id, editedName.trim());
      setIsEditingName(false);
    }
  };

  const handleAddAssignment = () => {
    if (newAssignment.name.trim() && newAssignment.points) {
      addAssignment(classId, section.id, {
        name: newAssignment.name.trim(),
        letterGrade: newAssignment.grade,
        totalPoints: parseFloat(newAssignment.points),
      });
      setNewAssignment({ name: "", grade: "A", points: "" });
    }
  };

  return (
    <Card className={`p-6 border-2 bg-slate border-slate hover:border-olive transition-all duration-300 ${gradeBgClass}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 flex-1">
          {isEditingName ? (
            <>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="max-w-xs bg-background border-border focus:border-olive"
                autoFocus
              />
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleSaveName}
                className="bg-olive text-background hover:bg-olive/90"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setIsEditingName(false)}
                className="text-gray hover:bg-slate"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-foreground">{section.name}</h3>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setIsEditingName(true)}
                className="text-olive hover:bg-olive/20"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray font-medium">Weight:</span>
            <Input
              type="number"
              value={section.weight}
              onChange={(e) => updateSectionWeight(classId, section.id, parseFloat(e.target.value) || 0)}
              className="w-20 text-center bg-background border-border focus:border-olive"
              min="0"
              max="100"
            />
            <span className="text-sm text-gray">%</span>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => removeSection(classId, section.id)} 
            className="text-destructive hover:bg-destructive/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {section.assignments.map((assignment) => (
          <div key={assignment.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
            <Input
              value={assignment.name}
              onChange={(e) =>
                updateAssignment(classId, section.id, assignment.id, { name: e.target.value })
              }
              className="flex-1 bg-background border-border focus:border-olive"
              placeholder="Assignment name"
            />
            <Select
              value={assignment.letterGrade}
              onValueChange={(value) =>
                updateAssignment(classId, section.id, assignment.id, { letterGrade: value })
              }
            >
              <SelectTrigger className="w-24 bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(letterToPercentage).map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={assignment.totalPoints}
              onChange={(e) =>
                updateAssignment(classId, section.id, assignment.id, {
                  totalPoints: parseFloat(e.target.value) || 0,
                })
              }
              className="w-24 bg-background border-border focus:border-olive"
              placeholder="Points"
              min="0"
            />
            <div className="text-sm text-gray w-24 text-right font-medium">
              {calculateEarnedPoints(assignment.totalPoints, assignment.letterGrade).toFixed(2)} / {assignment.totalPoints}
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeAssignment(classId, section.id, assignment.id)}
              className="text-destructive hover:bg-destructive/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <div className="flex items-center gap-3 p-3 bg-olive/10 rounded-lg border-2 border-dashed border-olive/30">
          <Input
            value={newAssignment.name}
            onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })}
            className="flex-1 bg-background border-border focus:border-olive"
            placeholder="New assignment"
            onKeyPress={(e) => e.key === "Enter" && handleAddAssignment()}
          />
          <Select
            value={newAssignment.grade}
            onValueChange={(value) => setNewAssignment({ ...newAssignment, grade: value })}
          >
            <SelectTrigger className="w-24 bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(letterToPercentage).map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={newAssignment.points}
            onChange={(e) => setNewAssignment({ ...newAssignment, points: e.target.value })}
            className="w-24 bg-background border-border focus:border-olive"
            placeholder="Points"
            min="0"
            onKeyPress={(e) => e.key === "Enter" && handleAddAssignment()}
          />
          <Button 
            onClick={handleAddAssignment} 
            size="icon" 
            className="bg-olive text-background hover:bg-olive/90"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t-2 border-olive/30 flex items-center justify-between">
        <div className="text-sm text-gray font-medium">
          Total: {totalEarned.toFixed(2)} / {totalPoints} points
        </div>
        <div className={`text-3xl font-bold ${gradeColorClass}`}>
          {sectionPercentage.toFixed(2)}%
        </div>
      </div>
    </Card>
  );
};
