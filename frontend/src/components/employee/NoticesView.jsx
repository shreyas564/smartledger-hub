import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

const NoticesView = ({ user, notices }) => {

  const getNoticeTypeColor = (type) => {
    switch (type) {
      case 'Central': return 'notice-central';
      case 'State': return 'notice-state';
      case 'Dept': return 'notice-dept';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notices</h1>
        <p className="text-muted-foreground">Read-only view of all broadcasted notices</p>
      </div>

      <div className="space-y-4">
        {notices.length > 0 ? notices.map((notice, index) => (
          <motion.div
            key={notice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`notice-card ${getNoticeTypeColor(notice.type)}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{notice.title}</h3>
                  <span className={`status-badge ml-3 priority-${notice.priority}`}>{notice.priority}</span>
                  <span className="status-badge ml-2 bg-gray-100 text-gray-800">{notice.type}</span>
                </div>
                <p className="text-muted-foreground">{notice.message}</p>
              </div>
              <p className="text-sm text-muted-foreground flex-shrink-0 ml-4">{new Date(notice.createdAt).toLocaleDateString()}</p>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-10 text-muted-foreground bg-card rounded-xl">
            <Megaphone className="w-12 h-12 mx-auto mb-4" />
            <p>No notices found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticesView;