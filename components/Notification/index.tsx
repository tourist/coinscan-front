import { useContext } from 'react';
import { NotificationsContext } from './NotificationProvider';

export enum NOTIFICATION_TYPES {
  SUCCESS,
  WARNING,
  ERROR,
  INFO,
}

export function useNotifications() {
  const { notification, addNotification, closeNotification } =
    useContext(NotificationsContext);
  return { notification, addNotification, closeNotification };
}
