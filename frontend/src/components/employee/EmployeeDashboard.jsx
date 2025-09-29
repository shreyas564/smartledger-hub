import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/shared/Sidebar';
import TopNavbar from '@/components/shared/TopNavbar';
import EmployeeOverview from '@/components/employee/EmployeeOverview';
import MyTasks from '@/components/employee/MyTasks';
import DocumentManagement from '@/components/employee/DocumentManagement';
import CalendarView from '@/components/shared/CalendarView';
import MessagingSystem from '@/components/shared/MessagingSystem';
import DepartmentView from '@/components/employee/DepartmentView';
import EcoTracker from '@/components/shared/EcoTracker';
import Settings from '@/components/shared/Settings';
import MetroMind from '@/components/shared/MetroMind';
import NotificationCenter from '@/components/shared/NotificationCenter';
import NoticesView from '@/components/employee/NoticesView';

const EmployeeDashboard = ({ user, onLogout, appData, appSetters }) => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { tasks, documents, notices, notifications } = appData;
  const { setTasks, setDocuments, setNotices, setNotifications } = appSetters;

  const employeeTasks = useMemo(() => tasks.filter(task => task.assigneeId === user.id), [tasks, user.id]);

  const urgentAlertsCount = useMemo(() => {
    return employeeTasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;
  }, [employeeTasks]);

  const employeeMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'tasks', label: 'My Tasks', icon: 'CheckSquare' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'notices', label: 'Notices', icon: 'Megaphone' },
    { id: 'calendar', label: 'Calendar', icon: 'Calendar' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
    { id: 'departments', label: 'Departments', icon: 'Building' },
    { id: 'ecotracker', label: 'EcoTracker', icon: 'Leaf' },
    { id: 'metro-mind', label: 'Metro Mind', icon: 'Brain' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <EmployeeOverview user={user} tasks={employeeTasks} documents={documents} />;
      case 'tasks':
        return <MyTasks user={user} tasks={employeeTasks} setTasks={setTasks} />;
      case 'documents':
        return <DocumentManagement user={user} documents={documents} setDocuments={setDocuments} />;
      case 'notices':
        return <NoticesView user={user} notices={notices} />;
      case 'calendar':
        return <CalendarView user={user} tasks={employeeTasks} />;
      case 'messages':
        return <MessagingSystem user={user} />;
      case 'departments':
        return <DepartmentView user={user} />;
      case 'ecotracker':
        return <EcoTracker user={user} />;
      case 'metro-mind':
        return <MetroMind user={user} />;
      case 'notifications':
        return <NotificationCenter user={user} notifications={notifications} setNotifications={setNotifications} />;
      case 'settings':
        return <Settings user={user} />;
      default:
        return <EmployeeOverview user={user} tasks={employeeTasks} documents={documents} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        menuItems={employeeMenuItems}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="employee"
        onLogout={onLogout}
        tasks={tasks} // This prop was missing and has been added
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar
          user={user}
          onLogout={onLogout}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          urgentAlertsCount={urgentAlertsCount}
          notifications={notifications}
          setNotifications={setNotifications}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveModule()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;