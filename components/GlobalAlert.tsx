"use client";

import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAlertStore } from "@/store/alertStore";

export function GlobalAlert() {
  const { alerts, removeAlert } = useAlertStore();

  return (
    <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-xs space-y-2 p-2">
      {alerts.map((alert) => (
        <TimedAlert
          key={alert.id}
          alert={alert}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
}

function TimedAlert({ alert, onClose }: { alert: any; onClose: () => void }) {
  const [progress, setProgress] = useState(100);
  const duration = alert.duration || 4000;

  useEffect(() => {
    const interval = 50;
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p <= 0) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return p - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  return (
    <Alert
      variant={alert.variant}
      className="relative overflow-hidden px-3 py-2 w-auto flex flex-col gap-2"
    >
      {/* Progress bar */}
      <div
        className={`absolute top-0 left-0 h-1 ${
          alert.variant === "destructive" ? "bg-destructive" : "bg-primary"
        }`}
        style={{ width: `${progress}%` }}
      />

      {/* Content + close button */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.description && (
            <AlertDescription>
              {alert.description}
            </AlertDescription>
          )}
        </div>
        <button className="text-foreground hover:text-gray" onClick={onClose}>
          ×
        </button>
      </div>
    </Alert>
  );
}
