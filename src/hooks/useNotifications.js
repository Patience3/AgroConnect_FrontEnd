import { useNotificationContext } from '@/context/NotificationProvider';

const useNotifications = () => {
  const context = useNotificationContext();
  return context;
};

export default useNotifications;