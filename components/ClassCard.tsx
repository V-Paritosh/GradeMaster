"use client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Class, calculateFinalPercentage, assignLetterGrade, getGradeColor, getGradeBgColor } from "@/lib/gradeCalculations";
import { GraduationCap } from "lucide-react";

interface ClassCardProps {
  classData: Class;
}

export const ClassCard = ({ classData }: ClassCardProps) => {
  const router = useRouter();
  const finalPercentage = calculateFinalPercentage(classData.sections);
  const finalGrade = assignLetterGrade(finalPercentage);
  const gradeColorClass = getGradeColor(finalGrade);
  const gradeBgClass = getGradeBgColor(finalGrade);

  return (
    <Card
      onClick={() => router.push(`/class/${classData.id}`)}
      className={`p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-olive/20 border-2 bg-slate border-slate hover:border-olive ${gradeBgClass}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-3 rounded-xl bg-olive/20 border border-olive/30">
            <GraduationCap className="w-6 h-6 text-olive" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{classData.name}</h3>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-baseline justify-between pb-3 border-b border-border/50">
          <span className="text-sm text-gray font-medium">Final Grade</span>
          <span className={`text-4xl font-bold ${gradeColorClass}`}>
            {finalGrade}
          </span>
        </div>
        
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-gray font-medium">Percentage</span>
          <span className="text-2xl font-bold text-foreground">
            {finalPercentage.toFixed(2)}%
          </span>
        </div>

        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray">Sections</span>
            <span className="text-foreground font-semibold text-lg">{classData.sections.length}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
