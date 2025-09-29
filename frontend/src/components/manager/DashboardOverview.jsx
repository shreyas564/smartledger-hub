import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckSquare, Clock, Users, Upload, Mail, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardOverview = ({ user, tasks, documents }) => {
  const navigate = useNavigate();

  const stats = {
    totalDocuments: documents.length,
    pendingTasks: tasks.filter(t => ['pending', 'working'].includes(t.status)).length,
    reviewTasks: tasks.filter(t => t.status === 'submitted_for_review').length,
    totalEmployees: 45, // Placeholder
  };

  const documentSources = [
    { type: 'upload', count: documents.filter(d => d.source === 'upload').length, color: 'bg-blue-500', icon: Upload },
    { type: 'email', count: documents.filter(d => d.source === 'email').length, color: 'bg-green-500', icon: Mail },
    { type: 'link', count: documents.filter(d => d.source === 'link').length, color: 'bg-purple-500', icon: LinkIcon },
  ];

  const handleStatClick = (statType) => {
    switch (statType) {
      case 'totalDocuments': navigate('/documents'); break;
      case 'pendingTasks': navigate('/tasks?status=pending'); break;
      case 'reviewTasks': navigate('/tasks?status=submitted_for_review'); break;
      case 'totalEmployees': navigate('/departments'); break;
      default: break;
    }
  };

  const handleSourceClick = (sourceType) => {
    navigate(`/documents?source=${sourceType}`);
  };

  const statCards = [
    { key: 'totalDocuments', value: stats.totalDocuments, label: 'Total Documents', icon: FileText },
    { key: 'pendingTasks', value: stats.pendingTasks, label: 'Pending Tasks', icon: Clock },
    { key: 'reviewTasks', value: stats.reviewTasks, label: 'Tasks for Review', icon: CheckSquare },
    { key: 'totalEmployees', value: stats.totalEmployees, label: 'Total Employees', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      
      {/* Dynamic Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.1)' }}
            className="bg-card p-5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleStatClick(card.key)}
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">{card.value}</div>
                <div className="text-sm text-muted-foreground">{card.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Document Source Stats */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Document Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {documentSources.map((source, index) => (
            <motion.div
              key={source.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-secondary p-4 rounded-lg flex items-center justify-between cursor-pointer"
              onClick={() => handleSourceClick(source.type)}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 ${source.color} rounded-full flex items-center justify-center mr-4`}>
                  <source.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold capitalize">{source.type}s</div>
                  <div className="text-sm text-muted-foreground">View Documents</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{source.count}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;