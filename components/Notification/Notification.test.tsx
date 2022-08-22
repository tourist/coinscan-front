import { useEffect } from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import Notification from './Notification';
import userEvent from '@testing-library/user-event';
import { useNotifications, NOTIFICATION_TYPES } from './index';
import NotificationProvider from './NotificationProvider';

const NotificationTester = () => {
  const { addNotification } = useNotifications();
  useEffect(() => {
    addNotification('Test error notification', NOTIFICATION_TYPES.ERROR);
  }, [addNotification]);
  return <>Placeholder component for calling useEffect</>;
};

test('notification renders on addNotification call', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <NotificationProvider>
      <NotificationTester />
      <Notification />
    </NotificationProvider>
  );
  await screen.findByRole('presentation');
  await screen.findByText('Test error notification');
  expect(container).toMatchSnapshot('notification rendered');

  const closeBtn = await screen.findByTitle('Close');
  await user.click(closeBtn);
  await waitForElementToBeRemoved(screen.queryByRole('presentation'));
});
