import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { getNotifications, type AppNotification } from "@/services";

type Ctx = {
  items: AppNotification[];
  unread: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
};

const NotificationContext = createContext<Ctx>({
  items: [],
  unread: 0,
  markAllRead: () => {},
  markRead: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AppNotification[]>(() =>
    getNotifications().map((n) => ({ ...n })),
  );

  const value = useMemo<Ctx>(
    () => ({
      items,
      unread: items.filter((n) => !n.read).length,
      markAllRead: () => setItems((prev) => prev.map((n) => ({ ...n, read: true }))),
      markRead: (id: string) =>
        setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))),
    }),
    [items],
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
