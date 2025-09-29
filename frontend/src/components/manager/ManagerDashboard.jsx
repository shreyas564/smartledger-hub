import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/shared/Sidebar';
import TopNavbar from '@/components/shared/TopNavbar';
import DashboardOverview from '@/components/manager/DashboardOverview';
import TaskManagement from '@/components/manager/TaskManagement';
import DocumentManagement from '@/components/manager/DocumentManagement';
import NoticesManagement from '@/components/manager/NoticesManagement';
import CalendarView from '@/components/shared/CalendarView';
import DepartmentManagement from '@/components/manager/DepartmentManagement';
import EcoTracker from '@/components/shared/EcoTracker';
import MetroMind from '@/components/shared/MetroMind';
import MessagingSystem from '@/components/shared/MessagingSystem';
import Settings from '@/components/shared/Settings';
import NotificationCenter from '@/components/shared/NotificationCenter';

const ManagerDashboard = ({ user, onLogout, appData, appSetters }) => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState(null); // State to hold the selected user for chat

  const { tasks, documents, notices, notifications } = appData;
  const { setTasks, setDocuments, setNotices, setNotifications } = appSetters;

  const urgentAlertsCount = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

  const managerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'notices', label: 'Notices', icon: 'Megaphone' },
    { id: 'departments', label: 'Departments', icon: 'Building' },
    { id: 'calendar', label: 'Calendar', icon: 'Calendar' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
    { id: 'ecotracker', label: 'EcoTracker', icon: 'Leaf' },
    { id: 'metro-mind', label: 'Metro Mind', icon: 'Brain' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  // **NEW**: This function handles the navigation from departments to messages
  const handleStartChat = (employee) => {
    setSelectedChatUser(employee); // Set the user to chat with
    setActiveModule('messages');   // Switch to the messages view
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard': return <DashboardOverview user={user} tasks={tasks} documents={documents} />;
      case 'tasks': return <TaskManagement user={user} tasks={tasks} setTasks={setTasks} />;
      case 'documents': return <DocumentManagement user={user} documents={documents} setDocuments={setDocuments} />;
      case 'notices': return <NoticesManagement user={user} notices={notices} setNotices={setNotices} />;
      // **MODIFIED**: Pass the handleStartChat function as a prop
      case 'departments': return <DepartmentManagement onStartChat={handleStartChat} />;
      case 'calendar': 
        return <CalendarView user={user} tasks={tasks} setTasks={setTasks} />;
      // **MODIFIED**: Pass the selectedChatUser as a prop
      case 'messages': return <MessagingSystem user={user} initialUser={selectedChatUser} />;
      case 'ecotracker': return <EcoTracker user={user} />;
      case 'metro-mind': return <MetroMind user={user} />;
      case 'notifications': return <NotificationCenter user={user} notifications={notifications} setNotifications={setNotifications} />;
      case 'settings': return <Settings user={user} />;
      default: return <DashboardOverview user={user} tasks={tasks} documents={documents} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        menuItems={managerMenuItems}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="manager"
        onLogout={onLogout}
        tasks={tasks}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar
          user={user}
          onLogout={onLogout}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          urgentAlertsCount={urgentAlertsCount}
          notifications={notifications}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {renderActiveModule()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
