import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Plus, Send, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

// --- Reusable Modal Component ---
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-card rounded-lg shadow-xl w-full max-w-lg"
      onClick={e => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </div>
);

// --- Main Notices Management Component ---
const NoticesManagement = ({ user, notices, setNotices }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getNoticeTypeClass = (type) => {
    switch (type) {
      case 'Central': return 'bg-blue-100 text-blue-800';
      case 'State': return 'bg-purple-100 text-purple-800';
      case 'Dept': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notices Management</h1>
          <p className="text-muted-foreground">Broadcast and manage company-wide notices</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Create Notice
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading && <div className="text-center p-8"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>}
        
        {!isLoading && notices.map(notice => (
          <motion.div
            key={notice._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 bg-card rounded-lg shadow-sm border-l-4 ${getPriorityClass(notice.priority)}`}
          >
            <h3 className="font-semibold text-lg">{notice.title}</h3>
            <p className="text-muted-foreground mt-1">{notice.message}</p>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className={`px-2 py-0.5 rounded-full font-medium text-xs ${getNoticeTypeClass(notice.type)}`}>
                {notice.type}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(notice.createdAt).toLocaleString()}
              </span>
            </div>
          </motion.div>
        ))}

        {!isLoading && notices.length === 0 && (
            <div className="text-center p-12 bg-card rounded-lg border-2 border-dashed">
                <Megaphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No Notices Found</h3>
                <p className="text-muted-foreground">Broadcast a new notice to get started.</p>
            </div>
        )}
      </div>

      {showCreateModal && (
        <CreateNoticeModal 
          onClose={() => setShowCreateModal(false)} 
          setNotices={setNotices} 
        />
      )}
    </div>
  );
};

// --- Create Notice Modal ---
const CreateNoticeModal = ({ onClose, setNotices }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'medium',
    type: 'Dept',
    departments: 'Operations', // Default value
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      return toast({ title: "Missing Fields", description: "Title and message are required.", variant: 'destructive' });
    }
    
    setIsBroadcasting(true);
    try {
      const { data: newNotice } = await api.post('/notices', formData);
      // **CRITICAL FIX**: This correctly adds the new notice to the top of the list
      setNotices(prevNotices => [newNotice, ...prevNotices]);
      toast({ title: "Success", description: "Notice has been broadcasted." });
      onClose();
    } catch (error) {
      toast({ title: "Broadcast Failed", description: error.response?.data?.message || "An error occurred.", variant: 'destructive' });
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleBroadcast} className="p-6">
        <h2 className="text-xl font-semibold mb-4">Broadcast New Notice</h2>
        <div className="space-y-4">
          <input type="text" name="title" placeholder="Notice Title *" onChange={handleInputChange} className="w-full p-2 border rounded" required />
          <textarea name="message" placeholder="Message *" onChange={handleInputChange} rows={4} className="w-full p-2 border rounded" required />
          <div className="grid grid-cols-2 gap-4">
            <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option value="Dept">Departmental</option>
              <option value="Central">Central KMRL</option>
              <option value="State">State</option>
            </select>
          </div>
          <input type="text" name="departments" placeholder="Departments (comma-separated)" value={formData.departments} onChange={handleInputChange} className="w-full p-2 border rounded" />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isBroadcasting}>
            {isBroadcasting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Broadcast
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NoticesManagement;