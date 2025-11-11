export interface Assignment {
  id: string;
  name: string;
  letterGrade: string;
  totalPoints: number;
}

export interface Section {
  id: string;
  name: string;
  weight: number;
  assignments: Assignment[];
}

export interface Class {
  id: string;
  name: string;
  sections: Section[];
}

export const letterToPercentage: Record<string, number> = {
  "A+": 100,
  "A": 89.5,
  "A-": 82,
  "B+": 77,
  "B": 69.5,
  "B-": 62,
  "C+": 57,
  "C": 49.5,
  "C-": 42,
  "D+": 37,
  "D": 29.5,
  "D-": 22,
  "F+": 17,
  "F": 9.5,
  "NC": 0,
};

export const gradeCutoffs: Array<{ grade: string; min: number }> = [
  { grade: "A+", min: 94.5 },
  { grade: "A", min: 84.5 },
  { grade: "A-", min: 79.5 },
  { grade: "B+", min: 74.5 },
  { grade: "B", min: 64.5 },
  { grade: "B-", min: 59.5 },
  { grade: "C+", min: 54.5 },
  { grade: "C", min: 44.5 },
  { grade: "C-", min: 39.5 },
  { grade: "D+", min: 34.5 },
  { grade: "D", min: 24.5 },
  { grade: "D-", min: 19.5 },
  { grade: "F+", min: 14.5 },
  { grade: "F", min: 9.5 },
  { grade: "F-", min: 4.5 },
];

export function letterToPercentageValue(letter: string): number {
  return letterToPercentage[letter] || 0;
}

export function calculateEarnedPoints(totalPoints: number, letterGrade: string): number {
  const percentage = letterToPercentageValue(letterGrade) / 100;
  return totalPoints * percentage;
}

export function calculateSectionPercentage(assignments: Assignment[]): number {
  if (assignments.length === 0) return 0;
  
  let totalEarned = 0;
  let totalPoints = 0;
  
  assignments.forEach((assignment) => {
    const earned = calculateEarnedPoints(assignment.totalPoints, assignment.letterGrade);
    totalEarned += earned;
    totalPoints += assignment.totalPoints;
  });
  
  return totalPoints > 0 ? (totalEarned / totalPoints) * 100 : 0;
}

export function calculateFinalPercentage(sections: Section[]): number {
  if (sections.length === 0) return 0;
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  sections.forEach((section) => {
    const sectionPercentage = calculateSectionPercentage(section.assignments);
    weightedSum += sectionPercentage * section.weight;
    totalWeight += section.weight;
  });
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

// Assign final letter grade based on cutoff scale
export function assignLetterGrade(percentage: number): string {
  for (const cutoff of gradeCutoffs) {
    if (percentage >= cutoff.min) {
      return cutoff.grade;
    }
  }
  return "F-";
}

export function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-grade-a";
  if (grade.startsWith("B")) return "text-grade-b";
  if (grade.startsWith("C")) return "text-grade-c";
  if (grade.startsWith("D")) return "text-grade-d";
  return "text-grade-f";
}

export function getGradeBgColor(grade: string): string {
  if (grade.startsWith("A")) return "border-grade-a/50 bg-grade-a/10";
  if (grade.startsWith("B")) return "border-grade-b/50 bg-grade-b/10";
  if (grade.startsWith("C")) return "border-grade-c/50 bg-grade-c/10";
  if (grade.startsWith("D")) return "border-grade-d/50 bg-grade-d/10";
  return "border-grade-f/50 bg-grade-f/10";
}

