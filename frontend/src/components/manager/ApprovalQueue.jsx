import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, MessageSquare, FileText, User, Clock } from 'lucide-react';

// --- UI Components & Services ---
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api'; // Your configured Axios instance

const ApprovalQueue = ({ user, tasks, setTasks }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(null); // Tracks loading state by task ID

  // Memoize the list of tasks awaiting review for performance
  const reviewQueue = useMemo(() => {
    return tasks.filter(task => task.status === 'submitted_for_review');
  }, [tasks]);

  // --- Handlers for Approving or Rejecting Tasks ---

  const handleDecision = async (taskId, newStatus, feedback = null) => {
    setIsLoading(taskId);
    try {
      const token = localStorage.getItem('token');
      await api.put(
        `/tasks/${taskId}/status`,
        { status: newStatus, feedback: feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the global state to immediately reflect the change in the UI
      setTasks(currentTasks =>
        currentTasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );

      toast({
        title: 'Success',
        description: `Task has been ${newStatus === 'completed' ? 'approved' : 'sent back for revision'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleApprove = (taskId) => {
    handleDecision(taskId, 'completed');
  };

  const handleReject = (taskId) => {
    // Prompt for feedback before rejecting
    const feedback = prompt('Please provide feedback for the rejection:');
    if (feedback) { // Only proceed if the manager provides feedback
      handleDecision(taskId, 'working', feedback); // Send back to 'working' status
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Approval & Review Queue</h1>
          <p className="text-muted-foreground">
            Review documents and deliverables submitted by employees.
          </p>
        </div>
        <Badge variant="outline" className="text-lg">
          {reviewQueue.length} {reviewQueue.length === 1 ? 'Item' : 'Items'} Pending
        </Badge>
      </div>

      {reviewQueue.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg">
          <p className="text-muted-foreground">🎉 The approval queue is empty!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewQueue.map(task => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-md border p-4"
            >
              <div className="flex flex-col sm:flex-row justify-between">
                {/* Task Details */}
                <div className="flex-1 mb-4 sm:mb-0">
                  <div className="flex items-center mb-2">
                    <FileText className="w-6 h-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                  </div>
                  <div className="pl-9 space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Submitted by: <strong>{task.assignee?.name || 'N/A'}</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Submitted on: <strong>{new Date(task.updatedAt).toLocaleDateString()}</strong>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(task._id)}
                    disabled={isLoading === task._id}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApprove(task._id)}
                    disabled={isLoading === task._id}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalQueue;