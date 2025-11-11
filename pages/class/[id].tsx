"use client";
import { useRouter } from "next/router";
import { useGradeStore } from "@/store/gradeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SectionCard } from "@/components/SectionCard";
import { AddSectionDialog } from "@/components/AddSectionDialog";
import { ClassSummary } from "@/components/ClassSummary";
import { ArrowLeft, Trash2, Edit2, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Class, Section, Assignment } from "@/lib/gradeCalculations";

export default function ClassDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [classData, setClassData] = useState<any>(null);

  const allClasses = useGradeStore((state) => state.classes);
  const updateClassName = useGradeStore((state) => state.updateClassName);
  const removeClass = useGradeStore((state) => state.removeClass);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (id) {
      const c = allClasses.find((cls) => cls.id === id);
      setClassData(c);
      setEditedName(c?.name || "");
    }
  }, [id, allClasses]);

  if (!classData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Class not found
          </h1>
          <p className="text-gray mb-6">
            The class you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-olive text-background hover:bg-olive/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveName = () => {
    if (editedName.trim()) {
      updateClassName(classData.id, editedName.trim());
      setIsEditingName(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${classData.name}"?`)) {
      removeClass(classData.id);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-navy border-b-2 border-olive/30">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                size="icon"
                className="text-olive hover:bg-olive/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>

              {isEditingName ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="max-w-md text-2xl font-bold bg-slate border-slate focus:border-olive"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    onClick={handleSaveName}
                    className="bg-olive text-background hover:bg-olive/90"
                  >
                    <Check className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditingName(false)}
                    className="text-gray hover:bg-slate"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {classData.name}
                  </h1>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditingName(true)}
                    className="text-olive hover:bg-olive/20"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <AddSectionDialog classId={classData.id} />
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Class
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {classData.sections.length > 0 && (
          <ClassSummary classData={classData} />
        )}

        <div className="space-y-6 mt-6">
          {classData.sections.map((section: Section) => (
            <SectionCard
              key={section.id}
              classId={classData.id}
              section={section}
            />
          ))}

          {classData.sections.length === 0 && (
            <Card className="bg-slate border-slate p-12">
              <div className="text-center">
                <p className="text-gray text-lg mb-4">
                  No sections yet. Add your first section to get started!
                </p>
                <AddSectionDialog classId={classData.id} />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}