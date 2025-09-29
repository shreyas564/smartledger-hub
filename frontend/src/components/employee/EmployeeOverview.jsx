import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, CheckCircle, FileText, Calendar } from 'lucide-react';

const EmployeeOverview = ({ user, tasks, documents }) => {
  const stats = {
    totalTasks: tasks.length,
    pendingTasks: tasks.filter(t => t.status === 'pending' || t.status === 'working').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length
  };

  const recentDocuments = documents.slice(0, 3);

  const upcomingDeadlines = tasks
    .filter(t => t.status !== 'completed' && new Date(t.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user.name}. Here's your overview.</p>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="stats-card"
        >
          <CheckSquare className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="stats-number">{stats.totalTasks}</div>
          <div className="stats-label">Total Tasks</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="stats-card"
        >
          <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
          <div className="stats-number">{stats.pendingTasks}</div>
          <div className="stats-label">Pending Tasks</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="stats-card"
        >
          <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
          <div className="stats-number">{stats.completedTasks}</div>
          <div className="stats-label">Completed Tasks</div>
        </motion.div>
      </div>

      {/* Recent Documents & Calendar Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
            <FileText className="w-5 h-5 mr-2" />
            Recent Documents
          </h3>
          <div className="space-y-3">
            {recentDocuments.map(doc => (
              <div key={doc.id} className="p-3 border border-border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">{doc.title}</p>
                    <p className="text-sm text-muted-foreground">{doc.department}</p>
                  </div>
                  <span className={`status-badge ${doc.urgent ? 'priority-high' : 'priority-low'}`}>{doc.urgent ? 'Urgent' : 'Normal'}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Calendar Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {upcomingDeadlines.length > 0 ? upcomingDeadlines.map(item => (
              <div key={item.id} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <p className="font-medium text-foreground">{item.task || item.title}</p>
                <p className="text-sm text-muted-foreground">Due: {new Date(item.deadline).toLocaleDateString()}</p>
              </div>
            )) : (
              <p className="text-muted-foreground text-sm">No upcoming deadlines. Great job!</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeOverview;