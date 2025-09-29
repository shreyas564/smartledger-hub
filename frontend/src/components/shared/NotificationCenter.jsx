import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

// A utility function to format time (e.g., "5 minutes ago")
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

// The component now receives notifications and setNotifications directly as props
const NotificationCenter = ({ notifications = [], setNotifications }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMarkAsRead = async (id) => {
    try {
      // Update the UI instantly for a better user experience
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      // Send the update to the backend
      await api.patch(`/notifications/${id}/read`);
    } catch (error) {
      toast({ title: "Error", description: "Failed to mark as read.", variant: "destructive" });
      // If the API call fails, revert the change in the UI
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: false } : n)
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
        // Update the UI first
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        // Then call the backend
        await api.post('/notifications/read-all');
        toast({ title: "Success", description: "All notifications marked as read." });
    } catch (error) {
        toast({ title: "Error", description: "Could not mark all as read.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">You have {unreadCount} unread messages.</p>
        </div>
        <Button onClick={handleMarkAllAsRead} disabled={unreadCount === 0 || isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all as read
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        {notifications.length > 0 ? (
          <div className="divide-y">
            {notifications.map((n, index) => (
              <motion.div
                key={n._id}
                className={`p-4 flex items-start gap-4 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}
              >
                <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-primary' : 'bg-transparent'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${!n.isRead ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                    <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(n._id)}>
                        <Check className="w-4 h-4 mr-2" /> Mark as read
                    </Button>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
            <div className="text-center p-12 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">All caught up!</h3>
                <p>You have no new notifications.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;