import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import { useNotifications, NOTIFICATION_TYPES } from '.';

export const NOTIFICATION_SEVERITY: {
  [key in NOTIFICATION_TYPES]: AlertColor;
} = {
  [NOTIFICATION_TYPES.SUCCESS]: 'success',
  [NOTIFICATION_TYPES.WARNING]: 'warning',
  [NOTIFICATION_TYPES.ERROR]: 'error',
  [NOTIFICATION_TYPES.INFO]: 'info',
};

const AUTO_HIDE_DURATION = 6000;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Notification() {
  const { notification, notificationVisibility, closeNotification } =
    useNotifications();
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={notificationVisibility}
        autoHideDuration={AUTO_HIDE_DURATION}
        onClose={() => setTimeout(closeNotification)}
      >
        <Alert
          onClose={closeNotification}
          severity={
            notification?.status
              ? NOTIFICATION_SEVERITY[notification.status]
              : NOTIFICATION_SEVERITY[NOTIFICATION_TYPES.INFO]
          }
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
