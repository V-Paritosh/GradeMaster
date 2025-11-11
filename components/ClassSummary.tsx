import { Card } from "@/components/ui/card";
import { Class, calculateFinalPercentage, calculateSectionPercentage, assignLetterGrade, getGradeColor } from "@/lib/gradeCalculations";

interface ClassSummaryProps {
  classData: Class;
}

export const ClassSummary = ({ classData }: ClassSummaryProps) => {
  const finalPercentage = calculateFinalPercentage(classData.sections);
  const finalGrade = assignLetterGrade(finalPercentage);
  const gradeColorClass = getGradeColor(finalGrade);

  return (
    <Card className="p-4 bottom-4 bg-slate border-2 border-olive/30 shadow-xl hover:border-olive transition-all duration-300">
      <h3 className="text-xl font-bold mb-6 text-foreground">Class Summary</h3>

      <div className="space-y-4">
        {classData.sections.map((section) => {
          const sectionPercentage = calculateSectionPercentage(
            section.assignments
          );
          return (
            <div
              key={section.id}
              className="flex items-center justify-between pb-3 border-b border-olive/20"
            >
              <span className="text-gray font-medium">
                {section.name}{" "}
                <span className="text-olive">({section.weight}%)</span>
              </span>
              <span className="font-bold text-foreground text-lg">
                {sectionPercentage.toFixed(2)}%
              </span>
            </div>
          );
        })}

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-foreground">
              Final Percentage:
            </span>
            <span className="text-2xl font-bold text-olive">
              {finalPercentage.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-foreground">
              Letter Grade:
            </span>
            <span className={`text-4xl font-bold ${gradeColorClass}`}>
              {finalGrade}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
