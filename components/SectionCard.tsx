"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Section,
  letterToPercentage,
  calculateSectionPercentage,
  getGradeColor,
  getGradeBgColor,
  calculateEarnedPoints,
} from "@/lib/gradeCalculations";
import { useGradeStore } from "@/store/gradeStore";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

interface SectionCardProps {
  classId: string;
  section: Section;
}

export const SectionCard = ({ classId, section }: SectionCardProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(section.name);
  const [newAssignment, setNewAssignment] = useState({
    name: "",
    grade: "A+",
    points: "",
    multiplier: "1",
  });
  const [error, setError] = useState("");

  const updateSectionName = useGradeStore((state) => state.updateSectionName);
  const updateSectionWeight = useGradeStore(
    (state) => state.updateSectionWeight
  );
  const addAssignment = useGradeStore((state) => state.addAssignment);
  const updateAssignment = useGradeStore((state) => state.updateAssignment);
  const removeAssignment = useGradeStore((state) => state.removeAssignment);
  const removeSection = useGradeStore((state) => state.removeSection);

  const sectionPercentage = calculateSectionPercentage(section.assignments);

  const finalGrade =
    Object.entries(letterToPercentage).find(
      ([_, value]) => Math.abs(value - sectionPercentage) < 5
    )?.[0] || "F";
  const gradeColorClass = getGradeColor(finalGrade);
  const gradeBgClass = getGradeBgColor(finalGrade);

  const totalEarned = section.assignments.reduce(
    (sum, a) =>
      sum +
      calculateEarnedPoints(a.totalPoints, a.letterGrade) * (a.multiplier || 1),
    0
  );

  const totalPoints = section.assignments.reduce(
    (sum, a) => sum + a.totalPoints * (a.multiplier || 1),
    0
  );

  const handleSaveName = () => {
    if (editedName.trim()) {
      updateSectionName(classId, section.id, editedName.trim());
      setIsEditingName(false);
    }
  };

  const handleAddAssignment = () => {
    if (!newAssignment.name.trim() || !newAssignment.points) {
      setError("Name & Pts required");
      return;
    }
    setError("");

    addAssignment(classId, section.id, {
      name: newAssignment.name.trim(),
      letterGrade: newAssignment.grade,
      totalPoints: parseFloat(newAssignment.points),
      multiplier:
        newAssignment.multiplier === ""
          ? 1
          : parseFloat(newAssignment.multiplier),
    });
    setNewAssignment({ name: "", grade: "A+", points: "", multiplier: "1" });
  };

  // --- COLUMN CONFIGURATION ---
  // Using fixed widths ensures headers and inputs always line up.
  const colWidths = {
    name: "flex-1 min-w-[120px]", // Grows to fill space
    grade: "w-[80px]", // Fixed width for Grade
    pts: "w-[70px]", // Fixed width for Points
    mult: "w-[60px]", // Fixed width for Multiplier
    earned: "w-[90px]", // Fixed width for Earned display
    action: "w-[30px]", // Fixed width for Trash/Action icon
  };

  return (
    <Card
      className={`p-4 md:p-6 border-2 bg-slate border-slate hover:border-olive transition-all duration-300 ${gradeBgClass}`}
    >
      {/* --- Section Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1 w-full">
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
                className="bg-olive text-background hover:bg-olive/90 shrink-0"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditingName(false)}
                className="text-gray hover:bg-slate shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-foreground truncate">
                {section.name}
              </h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditingName(true)}
                className="text-olive hover:bg-olive/20 shrink-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray font-medium whitespace-nowrap">
              Weight:
            </span>
            <Input
              type="number"
              value={section.weight}
              onChange={(e) =>
                updateSectionWeight(
                  classId,
                  section.id,
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-16 text-center bg-background border-border focus:border-olive"
              min="0"
              max="100"
            />
            <span className="text-sm text-gray">%</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => removeSection(classId, section.id)}
            className="text-destructive hover:bg-destructive/20 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="space-y-3">
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          {/* Min-width ensures layout doesn't break on tiny screens */}
          <div className="min-w-[550px]">
            {/* 1. HEADERS */}
            {/* Added px-4 so it matches the padding of the row boxes below */}
            {section.assignments.length > 0 && (
              <div className="flex gap-3 px-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider items-center">
                <div className={colWidths.name}>Assignment Name</div>
                <div className={`${colWidths.grade} text-center`}>Grade</div>
                <div className={`${colWidths.pts} text-center`}>Points</div>
                <div
                  className={`${colWidths.mult} text-center`}
                  title="Multiplier"
                >
                  Mult.
                </div>
                <div className={`${colWidths.earned} text-right`}>Earned</div>
                <div className={colWidths.action}></div>
              </div>
            )}

            {/* 2. EXISTING ASSIGNMENTS */}
            <div className="space-y-2 mb-2">
              {section.assignments.map((assignment) => {
                const mult = assignment.multiplier || 1;
                const currentEarned =
                  calculateEarnedPoints(
                    assignment.totalPoints,
                    assignment.letterGrade
                  ) * mult;
                const currentTotal = assignment.totalPoints * mult;

                return (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50"
                  >
                    <div className={colWidths.name}>
                      <Input
                        value={assignment.name}
                        onChange={(e) =>
                          updateAssignment(classId, section.id, assignment.id, {
                            name: e.target.value,
                          })
                        }
                        className="w-full bg-background border-border focus:border-olive h-9"
                        placeholder="Name"
                      />
                    </div>

                    <div className={colWidths.grade}>
                      <Select
                        value={assignment.letterGrade}
                        onValueChange={(value) =>
                          updateAssignment(classId, section.id, assignment.id, {
                            letterGrade: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-full bg-background border-border h-9">
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
                    </div>

                    <div className={colWidths.pts}>
                      <Input
                        type="number"
                        value={assignment.totalPoints}
                        onChange={(e) =>
                          updateAssignment(classId, section.id, assignment.id, {
                            totalPoints: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-background border-border focus:border-olive text-center h-9 px-1"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div className={colWidths.mult}>
                      <Input
                        type="number"
                        // CHANGE 1: Use '??' so we display 0 correctly.
                        // If we used '||', 0 would look like 1.
                        value={assignment.multiplier ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;

                          // CHANGE 2: If the input is empty (user cleared it), set it to 0.
                          // Otherwise, parse the number. We removed the '|| 1' so it doesn't force-reset.
                          const newMultiplier =
                            val === "" ? 0 : parseFloat(val);

                          updateAssignment(classId, section.id, assignment.id, {
                            multiplier: newMultiplier,
                          });
                        }}
                        className="w-full bg-background border-border focus:border-olive text-center h-9 px-1"
                        placeholder=""
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div
                      className={`${colWidths.earned} text-sm text-gray text-right font-medium truncate`}
                    >
                      {currentEarned.toFixed(1)} / {currentTotal.toFixed(1)}
                    </div>

                    <div className={`${colWidths.action} flex justify-end`}>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          removeAssignment(classId, section.id, assignment.id)
                        }
                        className="text-destructive hover:bg-destructive/20 w-8 h-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. ADD NEW ASSIGNMENT ROW */}
            <div
              className={`flex items-center gap-3 p-3 bg-olive/10 rounded-lg border-2 border-dashed ${
                error
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-olive/30"
              }`}
            >
              <div className={colWidths.name}>
                <Input
                  value={newAssignment.name}
                  onChange={(e) => {
                    setNewAssignment({
                      ...newAssignment,
                      name: e.target.value,
                    });
                    if (error) setError("");
                  }}
                  className="w-full bg-background border-border focus:border-olive h-9"
                  placeholder="New assignment..."
                  onKeyPress={(e) => e.key === "Enter" && handleAddAssignment()}
                />
              </div>

              <div className={colWidths.grade}>
                <Select
                  value={newAssignment.grade}
                  onValueChange={(value) =>
                    setNewAssignment({ ...newAssignment, grade: value })
                  }
                >
                  <SelectTrigger className="w-full bg-background border-border h-9">
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
              </div>

              <div className={colWidths.pts}>
                <Input
                  type="number"
                  value={newAssignment.points}
                  onChange={(e) => {
                    setNewAssignment({
                      ...newAssignment,
                      points: e.target.value,
                    });
                    if (error) setError("");
                  }}
                  className="w-full bg-background border-border focus:border-olive text-center h-9 px-1"
                  placeholder="Points"
                  min="0"
                  onKeyPress={(e) => e.key === "Enter" && handleAddAssignment()}
                />
              </div>

              <div className={colWidths.mult}>
                <Input
                  type="number"
                  value={newAssignment.multiplier}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      multiplier: e.target.value,
                    })
                  }
                  className="w-full bg-background border-border focus:border-olive text-center h-9 px-1"
                  placeholder="Mult."
                  min="0"
                  step="0.1"
                  onKeyPress={(e) => e.key === "Enter" && handleAddAssignment()}
                />
              </div>

              {/* Combine Earned + Action space for the Big Add Button */}
              {/* Width = earned (90) + gap (12) + action (30) ≈ 132px */}
              <div className="flex-none" style={{ width: "132px" }}>
                <Button
                  onClick={handleAddAssignment}
                  className="w-full h-9 bg-olive text-background hover:bg-olive/90"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error & Helper Text */}
        <div className="h-5 px-1">
          {error ? (
            <div className="flex items-center gap-2 text-destructive animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{error}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400 truncate">
                <strong>Tip:</strong> Multiplier 2.0 = double weight.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t-2 border-olive/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="text-sm text-gray font-medium">
          Total: {totalEarned.toFixed(2)} / {totalPoints.toFixed(2)} pts
        </div>
        <div
          className={`text-3xl font-bold self-end sm:self-auto ${gradeColorClass}`}
        >
          {totalPoints > 0
            ? ((totalEarned / totalPoints) * 100).toFixed(2)
            : "0.00"}
          %
        </div>
      </div>
    </Card>
  );
};
