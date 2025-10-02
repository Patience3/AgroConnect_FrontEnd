import { useState } from 'react';
import { Bell, Check, Trash2, Package, ShoppingBag, AlertCircle, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatRelativeTime } from '@/utils/helpers';
import clsx from 'clsx';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'order',
      title: 'New Order Received',
      message: 'You have a new order #ORD-2025-00456',
      read: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      message: 'John Kwame sent you a message',
      read: false,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '3',
      type: 'alert',
      title: 'Low Stock Alert',
      message: 'Fresh Tomatoes is running low on stock',
      read: false,
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: '4',
      type: 'order',
      title: 'Order Delivered',
      message: 'Order #ORD-2025-00432 has been delivered',
      read: true,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '5',
      type: 'system',
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated',
      read: true,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={20} className="text-accent-cyan" />;
      case 'message':
        return <MessageSquare size={20} className="text-info" />;
      case 'alert':
        return <AlertCircle size={20} className="text-warning" />;
      case 'system':
        return <Package size={20} className="text-success" />;
      default:
        return <Bell size={20} className="text-neutral-400" />;
    }
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neutral-300 hover:text-accent-cyan transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-96 bg-primary-light border border-neutral-800 rounded-lg shadow-card z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-neutral-400 mt-1">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-accent-cyan hover:text-accent-teal"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-neutral-800">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={clsx(
                        'p-4 hover:bg-neutral-900 transition-colors',
                        !notification.read && 'bg-accent-teal/5'
                      )}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-accent-cyan rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-sm text-neutral-400 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-600">
                              {formatRelativeTime(notification.timestamp)}
                            </span>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-xs text-accent-cyan hover:text-accent-teal"
                                >
                                  <Check size={14} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="text-xs text-error hover:text-red-400"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                  <Bell size={48} className="mb-4 text-neutral-700" />
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-neutral-800">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClearAll}
                  fullWidth
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;