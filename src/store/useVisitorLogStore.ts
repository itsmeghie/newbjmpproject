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
      addOrRemoveVisitorLog: (newLog) =>
        set((state) => {
          const exists = state.visitorLogs.some((log) => log.id === newLog.id);
          const updatedLogs = exists
            ? state.visitorLogs.filter((log) => log.id !== newLog.id)
            : [...state.visitorLogs, newLog];

          visitorChannel.postMessage({ type: "SYNC_LOGS", logs: updatedLogs }); // 📢 broadcast

          return { visitorLogs: updatedLogs };
        }),
      clearVisitorLogs: () => {
        visitorChannel.postMessage({ type: "SYNC_LOGS", logs: [] }); // 📢 broadcast clearing
        set({ visitorLogs: [] });
      },
      setVisitorLogs: (logs) => set({ visitorLogs: logs }), // 👈 helper for incoming sync
    }),
    {
      name: "visitor-log-storage",
    }
  )
);

// 🧠 Listen globally once
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
