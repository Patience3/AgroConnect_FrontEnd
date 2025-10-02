import { createContext, useContext, useState, useCallback } from 'react';
import { NOTIFICATION_TYPES } from '@/types';

const NotificationContext = createContext(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now().toString(),
      type: notification.type || NOTIFICATION_TYPES.SYSTEM,
      title: notification.title,
      message: notification.message,
      read: false,
      timestamp: new Date().toISOString(),
      ...notification,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-dismiss after 5 seconds if auto-dismiss is enabled
    if (notification.autoDismiss !== false) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }

    return newNotification.id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Helper methods for different notification types
  const success = useCallback((title, message) => {
    return addNotification({
      type: 'success',
      title,
      message,
      autoDismiss: true,
    });
  }, [addNotification]);

  const error = useCallback((title, message) => {
    return addNotification({
      type: 'error',
      title,
      message,
      autoDismiss: false,
    });
  }, [addNotification]);

  const warning = useCallback((title, message) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      autoDismiss: true,
    });
  }, [addNotification]);

  const info = useCallback((title, message) => {
    return addNotification({
      type: 'info',
      title,
      message,
      autoDismiss: true,
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    getUnreadCount,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;