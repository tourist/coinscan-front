import { useContext } from 'react';
import { NotificationsContext } from './NotificationProvider';

export enum NOTIFICATION_TYPES {
  SUCCESS,
  WARNING,
  ERROR,
  INFO,
}

export function useNotifications() {
  const {
    notification,
    notificationVisibility,
    addNotification,
    closeNotification,
  } = useContext(NotificationsContext);
  return {
    notification,
    notificationVisibility,
    addNotification,
    closeNotification,
  };
}
