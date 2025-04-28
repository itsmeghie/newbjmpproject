/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VisitorLog {
  id: number;
  [key: string]: any;
}

interface VisitorLogStore {
  visitorLogs: VisitorLog[];
  addOrRemoveVisitorLog: (log: VisitorLog) => void;
  clearVisitorLogs: () => void;
  setVisitorLogs: (logs: VisitorLog[]) => void;
}

const visitorChannel = new BroadcastChannel("visitor-logs");

export const useVisitorLogStore = create<VisitorLogStore>()(
  persist(
    (set, get) => ({
      visitorLogs: [],
      addOrRemoveVisitorLog: (newLog) => {
        const state = get();
        const exists = state.visitorLogs.some((log) => log.id === newLog.id);
        const updatedLogs = exists
          ? state.visitorLogs.filter((log) => log.id !== newLog.id)
          : [...state.visitorLogs, newLog];

        try {
          visitorChannel.postMessage({ type: "SYNC_LOGS", logs: updatedLogs });
          set({ visitorLogs: updatedLogs });
        } catch (err) {
          console.error("Failed to persist visitor logs:", err);
          set({ visitorLogs: updatedLogs }, false); // update without persisting
        }
      },
      clearVisitorLogs: () => {
        try {
          visitorChannel.postMessage({ type: "SYNC_LOGS", logs: [] });
          set({ visitorLogs: [] });
        } catch (err) {
          console.error("Failed to clear visitor logs:", err);
          set({ visitorLogs: [] }, false);
        }
      },
      setVisitorLogs: (logs) => {
        try {
          set({ visitorLogs: logs });
        } catch (err) {
          console.error("Failed to set visitor logs:", err);
          set({ visitorLogs: logs }, false);
        }
      },
    }),
    {
      name: "visitor-log-storage",
    }
  )
);

visitorChannel.onmessage = (event) => {
  const { type, logs } = event.data;
  if (type === "SYNC_LOGS") {
    const currentLogs = useVisitorLogStore.getState().visitorLogs;
    const isDifferent = JSON.stringify(currentLogs) !== JSON.stringify(logs);
    if (isDifferent) {
      useVisitorLogStore.getState().setVisitorLogs(logs);
    }
  }
};
