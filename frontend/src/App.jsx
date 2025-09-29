import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';
import LoginPage from '@/components/auth/LoginPage';
import ManagerDashboard from '@/components/manager/ManagerDashboard';
import EmployeeDashboard from '@/components/employee/EmployeeDashboard';
import DocumentAssistantDashboard from '@/components/document-assistant/DocumentAssistantDashboard';
import { BrowserRouter as Router } from 'react-router-dom'; // Import the Router

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { toast } = useToast();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('kmrl_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Fetch data when user is logged in
  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const [tasksRes, docsRes, noticesRes, notificationsRes] = await Promise.all([
            api.get('/tasks'),
            api.get('/documents'),
            api.get('/notices'),
            api.get('/notifications'),
          ]);
          setTasks(tasksRes.data);
          setDocuments(docsRes.data);
          setNotices(noticesRes.data);
          setNotifications(notificationsRes.data);
        } catch (error) {
          toast({
            title: 'Error',
            description: error.response?.data?.message || 'Failed to fetch data',
            variant: 'destructive',
          });
          if (error.response?.status === 401) {
            setCurrentUser(null);
            localStorage.removeItem('kmrl_user');
            localStorage.removeItem('token');
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [currentUser, toast]);

  const handleLogin = (user, token) => {
    localStorage.setItem('kmrl_user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTasks([]);
    setDocuments([]);
    setNotices([]);
    setNotifications([]);
    localStorage.removeItem('kmrl_user');
    localStorage.removeItem('token');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="loading-spinner text-primary"></div>
      </div>
    );
  }

  const renderDashboard = () => {
    if (!currentUser) return <LoginPage onLogin={handleLogin} />;

    const appData = { tasks, documents, notices, notifications };
    const appSetters = { setTasks, setDocuments, setNotices, setNotifications };

    switch (currentUser.role) {
      case 'manager':
        return <ManagerDashboard user={currentUser} onLogout={handleLogout} appData={appData} appSetters={appSetters} />;
      case 'employee':
        return <EmployeeDashboard user={currentUser} onLogout={handleLogout} appData={appData} appSetters={appSetters} />;
      case 'doc_assistant':
        return <DocumentAssistantDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <Router> {/* Wrap the entire application with the Router */}
      <Helmet>
        <title>LEDGER - KMRL Document Management System</title>
        <meta name="description" content="Secure document management system for Kochi Metro Rail Limited." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUser?.id || 'login'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderDashboard()}
          </motion.div>
        </AnimatePresence>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;