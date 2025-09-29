import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

const MyTasks = ({ user, tasks, setTasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const handleStatusChange = async (taskId, newStatus) => {
    try {
        const updatedTask = tasks.find(task => task._id === taskId);
        const res = await api.put(`/tasks/${taskId}`, { ...updatedTask, status: newStatus });
        setTasks(currentTasks => currentTasks.map(task => (task._id === taskId ? res.data : task)));
        toast({ title: "Status Updated" });
    } catch (error) {
        toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !selectedTask) return;
    try {
        const res = await api.post(`/tasks/${selectedTask._id}/comments`, { text: comment });
        setTasks(prevTasks => prevTasks.map(task => 
            task._id === selectedTask._id ? res.data : task
        ));
        setSelectedTask(res.data);
        setComment('');
        toast({ title: "Comment Added" });
    } catch (error) {
        toast({ title: "Error", description: "Failed to add comment.", variant: "destructive" });
    }
  };
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
        <p className="text-muted-foreground">All tasks assigned to you</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          {tasks.map(task => (
            <motion.div
              key={task._id}
              onClick={() => setSelectedTask(task)}
              className={`p-4 bg-card rounded-lg shadow-sm border-l-4 cursor-pointer transition-all ${
                task.priority === 'high' ? 'border-red-500' :
                task.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
              } ${selectedTask?._id === task._id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <span className={`px-2 py-0.5 mt-2 inline-block rounded-full font-medium text-xs ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1 border rounded-lg text-sm"
                  disabled={task.status === 'submitted_for_review' || task.status === 'completed'}
                >
                  <option value="pending">Pending</option>
                  <option value="working">Working</option>
                  <option value="submitted_for_review">Submit for Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Task Details & Comments */}
        <div className="lg:col-span-1">
          {selectedTask ? (
            <div className="sticky top-6 bg-card p-5 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">{selectedTask.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{selectedTask.description}</p>
                
                <h4 className="font-semibold mb-2">Comments</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto bg-secondary p-3 rounded-lg mb-4">
                    {selectedTask.comments?.length > 0 ? selectedTask.comments.map((c, i) => (
                    <div key={i}>
                        <p className="text-sm font-semibold">{c.name}</p>
                        <p className="text-sm text-muted-foreground">{c.text}</p>
                    </div>
                    )) : <p className="text-sm text-muted-foreground">No comments yet.</p>}
                </div>

                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                    <Button onClick={handleAddComment}><Send className="w-4 h-4" /></Button>
                </div>
            </div>
          ) : (
            <div className="sticky top-6 bg-card p-5 rounded-lg shadow-sm text-center text-muted-foreground">
              <p>Select a task to see details and comments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;