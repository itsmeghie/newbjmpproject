/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface VisitorLog {
  id: number;
  [key: string]: any;
}

interface VisitorLogStore {
  visitorLogs: VisitorLog[];
  addOrRemoveVisitorLog: (log: VisitorLog) => boolean;
  clearVisitorLogs: () => void;
  setVisitorLogs: (logs: VisitorLog[]) => boolean;
  pruneOldLogs: () => void; // New function to clean up old logs
}

const visitorChannel = new BroadcastChannel("visitor-logs");

// Maximum number of logs to keep in storage
const MAX_LOGS = 100;

// Custom storage with quota error handling
const customStorage = {
  ...createJSONStorage(() => localStorage),
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
      // ✅ just exit successfully, no return value needed
    } catch (err) {
      if (
        err instanceof DOMException &&
        (err.code === 22 ||
          err.code === 1014 ||
          err.name === "QuotaExceededError" ||
          err.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        console.warn("Local storage quota exceeded, trying to free up space");
      } else {
        throw err; // important: still rethrow unexpected errors
      }
    }
  },
};

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

        // If we're adding and the list is getting too long, prune it
        if (!exists && updatedLogs.length > MAX_LOGS) {
          // Keep only the most recent logs
          updatedLogs.sort((a, b) => b.id - a.id); // Sort by ID descending
          updatedLogs.splice(MAX_LOGS); // Remove excess logs
        }

        try {
          visitorChannel.postMessage({ type: "SYNC_LOGS", logs: updatedLogs });
          set({ visitorLogs: updatedLogs });
          return true;
        } catch (err) {
          console.error("Failed to persist visitor logs:", err);
          set({ visitorLogs: updatedLogs }, false); // update without persisting
          return false;
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
          return true;
        } catch (err) {
          console.error("Failed to set visitor logs:", err);
          set({ visitorLogs: logs }, false);
          return false;
        }
      },

      pruneOldLogs: () => {
        const state = get();
        if (state.visitorLogs.length <= MAX_LOGS) return;

        // Keep only the MAX_LOGS most recent logs
        const sortedLogs = [...state.visitorLogs].sort((a, b) => b.id - a.id);
        const prunedLogs = sortedLogs.slice(0, MAX_LOGS);

        try {
          visitorChannel.postMessage({ type: "SYNC_LOGS", logs: prunedLogs });
          set({ visitorLogs: prunedLogs });
        } catch (err) {
          console.error("Failed to prune visitor logs:", err);
          set({ visitorLogs: prunedLogs }, false);
        }
      },
    }),
    {
      name: "visitor-log-storage",
      storage: customStorage,
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
