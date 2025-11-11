import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Class, Section, Assignment } from "@/lib/gradeCalculations";

interface GradeStore {
  classes: Class[];
  addClass: (name: string) => void;
  removeClass: (classId: string) => void;
  updateClassName: (classId: string, name: string) => void;
  addSection: (classId: string, name: string, weight: number) => void;
  removeSection: (classId: string, sectionId: string) => void;
  updateSectionName: (classId: string, sectionId: string, name: string) => void;
  updateSectionWeight: (
    classId: string,
    sectionId: string,
    weight: number
  ) => void;
  addAssignment: (
    classId: string,
    sectionId: string,
    assignment: Omit<Assignment, "id">
  ) => void;
  updateAssignment: (
    classId: string,
    sectionId: string,
    assignmentId: string,
    updates: Partial<Assignment>
  ) => void;
  removeAssignment: (
    classId: string,
    sectionId: string,
    assignmentId: string
  ) => void;
}

let nextId = 0;
const generateId = () => `${Date.now()}-${nextId++}`;

export const useGradeStore = create<GradeStore>()(
  persist(
    (set) => ({
      classes: [],

      addClass: (name) =>
        set((state) => ({
          classes: [
            ...state.classes,
            {
              id: generateId(),
              name,
              sections: [],
            },
          ],
        })),

      removeClass: (classId) =>
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== classId),
        })),

      updateClassName: (classId, name) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId ? { ...c, name } : c
          ),
        })),

      addSection: (classId, name, weight) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? {
                  ...c,
                  sections: [
                    ...c.sections,
                    {
                      id: generateId(),
                      name,
                      weight,
                      assignments: [],
                    },
                  ],
                }
              : c
          ),
        })),

      removeSection: (classId, sectionId) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? {
                  ...c,
                  sections: c.sections.filter((s) => s.id !== sectionId),
                }
              : c
          ),
        })),

      updateSectionName: (classId, sectionId, name) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? {
                  ...c,
                  sections: c.sections.map((s) =>
                    s.id === sectionId ? { ...s, name } : s
                  ),
                }
              : c
          ),
        })),

      updateSectionWeight: (classId, sectionId, weight) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? {
                  ...c,
                  sections: c.sections.map((s) =>
                    s.id === sectionId ? { ...s, weight } : s
                  ),
                }
              : c
          ),
        })),

      addAssignment: (classId, sectionId, assignment) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? {
                  ...c,
                  sections: c.sections.map((s) =>
                    s.id === sectionId
                      ? {
                          ...s,
                          assignments: [
                            ...s.assignments,
                            { ...assignment, id: generateId() },
                          ],
                        }
                      : s
                  ),
                }
              : c
          ),
        })),

      updateAssignment: (classId, sectionId, assignmentId, updates) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? {
                  ...c,
                  sections: c.sections.map((s) =>
                    s.id === sectionId
                      ? {
                          ...s,
                          assignments: s.assignments.map((a) =>
                            a.id === assignmentId ? { ...a, ...updates } : a
                          ),
                        }
                      : s
                  ),
                }
              : c
          ),
        })),

      removeAssignment: (classId, sectionId, assignmentId) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? {
                  ...c,
                  sections: c.sections.map((s) =>
                    s.id === sectionId
                      ? {
                          ...s,
                          assignments: s.assignments.filter(
                            (a) => a.id !== assignmentId
                          ),
                        }
                      : s
                  ),
                }
              : c
          ),
        })),
    }),
    {
      name: "grade-calculator-storage",
    }
  )
);
