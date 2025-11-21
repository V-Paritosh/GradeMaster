import { create } from "zustand";

interface Alert {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number; // milliseconds
}

interface AlertStore {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, "id">) => void;
  removeAlert: (id: string) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  addAlert: (alert) =>
    set((state) => ({
      alerts: [...state.alerts, { ...alert, id: crypto.randomUUID() }],
    })),
  removeAlert: (id) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
}));