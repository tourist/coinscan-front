import React, { useState, useCallback } from 'react';
import { NOTIFICATION_TYPES } from '.';

type NotificationType = {
  message: string;
  status: NOTIFICATION_TYPES;
};

type NotificationsContextType = {
  notification: NotificationType | null;
  addNotification: (message: string, status: NOTIFICATION_TYPES) => void;
  closeNotification: () => void;
};

export const NotificationsContext =
  React.createContext<NotificationsContextType>({
    notification: null,
    addNotification: () => {},
    closeNotification: () => {},
  });

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );
  const closeNotification = () => setNotification(null);
  const addNotification = (message: string, status: NOTIFICATION_TYPES) =>
    setNotification({ message, status });

  const contextValue = {
    notification,
    addNotification: useCallback(
      (message: string, status: NOTIFICATION_TYPES) =>
        addNotification(message, status),
      []
    ),
    closeNotification: useCallback(() => closeNotification(), []),
  };

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
}
