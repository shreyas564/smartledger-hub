import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Globe, Menu, Settings, LogOut, User, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

const TopNavbar = ({ user, onLogout, onToggleSidebar, urgentAlertsCount = 0, notifications, setNotifications }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { toast } = useToast();

  const handleSearch = (e) => {
    e.preventDefault();
    toast({ title: "Search", description: "Search feature in development." });
  };
  
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to mark notification as read' });
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-card border-b z-20">
      <div className="h-[65px] px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button onClick={onToggleSidebar} variant="ghost" size="icon" className="lg:hidden w-8 h-8">
            <Menu className="w-5 h-5" />
          </Button>
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents, tasks..."
                className="pl-9 pr-4 py-2 w-80 border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="w-9 h-9"><Globe className="w-5 h-5" /></Button>

          {/* Notifications */}
          <div className="relative">
            <Button onClick={() => setShowNotifications(!showNotifications)} variant="ghost" size="icon" className="w-9 h-9">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-destructive rounded-full border-2 border-card" />}
            </Button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-sm border z-50"
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <div className="p-3 font-semibold border-b">Notifications</div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n._id} className={`p-3 border-b hover:bg-accent ${!n.isRead ? 'font-medium' : 'text-muted-foreground'}`}>
                        <p className="text-sm">{n.message}</p>
                        <div className="text-xs mt-1 flex justify-between items-center">
                          <span>{new Date(n.createdAt).toLocaleString()}</span>
                          {!n.isRead && <Button size="sm" variant="ghost" onClick={() => markAsRead(n._id)}><Check className="w-4 h-4 mr-1"/> Mark as read</Button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center p-1 rounded-md hover:bg-accent">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-semibold">{user.name.charAt(0).toUpperCase()}</div>
              <div className="hidden sm:block text-left ml-2">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            </button>
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-sm border z-50 py-1"
                  onMouseLeave={() => setShowProfileDropdown(false)}
                >
                  <button className="w-full flex items-center px-3 py-2 text-sm hover:bg-accent"><User className="w-4 h-4 mr-2" /> Profile</button>
                  <button className="w-full flex items-center px-3 py-2 text-sm hover:bg-accent"><Settings className="w-4 h-4 mr-2" /> Settings</button>
                  <div className="my-1 h-px bg-border" />
                  <button onClick={onLogout} className="w-full flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10"><LogOut className="w-4 h-4 mr-2" /> Logout</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;