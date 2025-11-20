import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Class, Assignment } from "@/lib/gradeCalculations";
// import { encrypt, decrypt } from "@/lib/crypto";

interface GradeStore {
  userId: string | null;
  classes: Class[];
  hasHydrated?: boolean;
  setUser: (id: string | null) => void;
  fetchGrades: () => Promise<void>;
  syncGrades: () => void;
  addClass: (name: string) => void;
  removeClass: (classId: string) => void;
  updateClassName: (classId: string, name: string) => void;
  addSection: (classId: string, name: string, weight: number) => void;
  removeSection: (classId: string, sectionId: string) => void;
  addAssignment: (
    classId: string,
    sectionId: string,
    assignment: Omit<Assignment, "id">
  ) => void;
  updateSectionName: (classId: string, sectionId: string, name: string) => void;
  updateSectionWeight: (
    classId: string,
    sectionId: string,
    weight: number
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
let debounceTimer: NodeJS.Timeout;

export const useGradeStore = create<GradeStore>()(
  persist(
    (set, get) => ({
      userId: null,
      classes: [],
      hasHydrated: false,

      setUser: (id) => set({ userId: id }),

      fetchGrades: async () => {
        const userId = get().userId;
        if (!userId) return;
        try {
          const res = await fetch("/api/grades", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ method: "GET", userId }),
          });
          const data = await res.json();
          set({ classes: data.classes || [] });
        } catch (err) {
          console.error("Failed to fetch grades:", err);
        }
      },

      syncGrades: () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          const { userId, classes } = get();
          if (!userId) return;
          try {
            await fetch("/api/grades", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ method: "POST", userId, update: classes }),
            });
            console.log("Grades synced to MongoDB");
          } catch (err) {
            console.error("Failed to sync grades:", err);
          }
        }, 300); // debounce 300ms
      },

      addClass: (name) => {
        set((state) => ({
          classes: [...state.classes, { id: generateId(), name, sections: [] }],
        }));
        get().syncGrades();
      },

      removeClass: (classId) => {
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== classId),
        }));
        get().syncGrades();
      },

      updateClassName: (classId, name) => {
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId ? { ...c, name } : c
          ),
        }));
        get().syncGrades();
      },

      addSection: (classId, name, weight) => {
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? {
                  ...c,
                  sections: [
                    ...c.sections,
                    { id: generateId(), name, weight, assignments: [] },
                  ],
                }
              : c
          ),
        }));
        get().syncGrades();
      },

      removeSection: (classId, sectionId) => {
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? { ...c, sections: c.sections.filter((s) => s.id !== sectionId) }
              : c
          ),
        }));
        get().syncGrades();
      },

      addAssignment: (classId, sectionId, assignment) => {
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
        }));
        get().syncGrades();
      },

      updateSectionName: (classId, sectionId, name) => {
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
        }));
        get().syncGrades();
      },

      updateSectionWeight: (classId, sectionId, weight) => {
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
        }));
        get().syncGrades();
      },

      updateAssignment: (classId, sectionId, assignmentId, updates) => {
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
        }));
        get().syncGrades();
      },

      removeAssignment: (classId, sectionId, assignmentId) => {
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
        }));
        get().syncGrades();
      },
    }),
    {
      name: "grade-calculator-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);
