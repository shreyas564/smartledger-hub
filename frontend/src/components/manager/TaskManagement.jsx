import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MessageSquare, Send, User, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

const TaskManagement = ({ user, tasks, setTasks }) => {
  // --- STATE MANAGEMENT ---
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState('');
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingEmployees, setIsFetchingEmployees] = useState(false);
  const { toast } = useToast();
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigneeId: '',
    priority: 'medium',
    deadline: '',
  });

  // --- API CALLS & LOGIC ---

  // useCallback ensures this function isn't recreated on every render
  const fetchEmployees = useCallback(async () => {
    console.log("Attempting to fetch employees...");
    setIsFetchingEmployees(true);
    try {
      const { data } = await api.get('/users');
      const employeeList = data.filter(u => u.role === 'employee');
      setEmployees(employeeList);
      console.log("Successfully fetched employees:", employeeList);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({
        title: 'Failed to Fetch Employees',
        description: error.response?.data?.message || 'Could not load the employee list.',
        variant: 'destructive',
      });
    } finally {
      setIsFetchingEmployees(false);
    }
  }, [toast]);

  // useEffect to fetch employees only when the modal is opened
  useEffect(() => {
    if (showAssignModal) {
      fetchEmployees();
    }
  }, [showAssignModal, fetchEmployees]);

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assigneeId || !newTask.deadline) {
      return toast({ title: 'Missing Fields', description: 'Please fill in all required fields.', variant: 'destructive' });
    }
    
    setIsLoading(true);
    try {
      const assignee = employees.find(emp => emp._id === newTask.assigneeId);
      const payload = { ...newTask, assignee: assignee.name };
      console.log("Assigning new task with payload:", payload);

      const { data: createdTask } = await api.post('/tasks', payload);
      setTasks(prevTasks => [...prevTasks, createdTask]);
      
      toast({ title: 'Success', description: 'Task has been assigned.' });
      setShowAssignModal(false);
      setNewTask({ title: '', description: '', assigneeId: '', priority: 'medium', deadline: '' });
    } catch (error) {
      console.error("Error creating task:", error);
      toast({ title: 'Error', description: 'Failed to create the task.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddComment = async () => {
    if (!comment.trim() || !selectedTask) return;

    try {
      const payload = { text: comment };
      console.log(`Adding comment to task ${selectedTask._id} with payload:`, payload);

      const { data: updatedTask } = await api.post(`/tasks/${selectedTask._id}/comments`, payload);
      
      // Update the main tasks list
      setTasks(prevTasks => prevTasks.map(task => 
        task._id === selectedTask._id ? updatedTask : task
      ));
      
      // Update the detailed view
      setSelectedTask(updatedTask);
      setComment('');
      toast({ title: "Comment Added" });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({ title: "Error", description: "Could not post your comment.", variant: "destructive" });
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

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-muted-foreground">Assign, track, and review tasks</p>
        </div>
        <Button onClick={() => setShowAssignModal(true)}><Plus className="w-4 h-4 mr-2" /> Assign Task</Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <h3 className="font-semibold">{task.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center"><User className="w-4 h-4 mr-1" />{task.assignee}</span>
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(task.deadline).toLocaleDateString()}</span>
                <span className={`px-2 py-0.5 rounded-full font-medium text-xs ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          {selectedTask ? (
            <div className="sticky top-6 bg-card p-5 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">{selectedTask.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{selectedTask.description || "No description provided."}</p>
              
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
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
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
      
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg shadow-xl p-6 w-full max-w-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Assign New Task</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Task Title *" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full p-2 border rounded" />
              <textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="w-full p-2 border rounded" />
              <select value={newTask.assigneeId} onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })} className="w-full p-2 border rounded">
                <option value="" disabled>{isFetchingEmployees ? 'Loading...' : 'Select Employee *'}</option>
                {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name} ({emp.department})</option>)}
              </select>
              <div className="flex gap-4">
                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="w-full p-2 border rounded">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input type="date" value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} className="w-full p-2 border rounded" placeholder="Deadline *" />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
              <Button onClick={handleCreateTask} disabled={isLoading || isFetchingEmployees}>
                {(isLoading || isFetchingEmployees) && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Assign Task
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;