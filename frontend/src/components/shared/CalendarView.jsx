import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
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

const CalendarView = ({ tasks = [], setTasks, user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // --- Calendar Grid Generation Logic ---
  const generateCalendarDays = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Add blank cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ key: `empty-${i}`, date: null, isCurrentMonth: false });
    }
    
    // Add cells for each day of the current month
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = tasks.filter(task => task.deadline && task.deadline.startsWith(dateString));
      days.push({ key: dateString, date, isCurrentMonth: true, events: dayEvents });
    }

    setDaysInMonth(days);
  }, [currentDate, tasks]);

  useEffect(() => {
    generateCalendarDays();
  }, [generateCalendarDays]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500 hover:bg-red-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrevMonth}><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="outline" onClick={handleToday}>Today</Button>
          <Button variant="outline" onClick={handleNextMonth}><ChevronRight className="w-4 h-4" /></Button>
          <Button onClick={() => setShowAddEventModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 text-center font-semibold text-muted-foreground border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {daysInMonth.map(day => (
            <div key={day.key} className={`h-32 border-b border-r p-2 flex flex-col ${!day.isCurrentMonth ? 'bg-secondary/30' : ''}`}>
              {day.date && (
                <>
                  <span className={`font-medium ${new Date().toDateString() === day.date.toDateString() ? 'bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>
                    {day.date.getDate()}
                  </span>
                  <div className="mt-1 space-y-1 overflow-y-auto">
                    {day.events?.map(event => (
                       <div key={event._id} className={`px-2 py-1 text-xs text-white rounded cursor-pointer ${getPriorityClass(event.priority)}`}>
                         {event.title}
                       </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {showAddEventModal && (
        <AddEventModal 
            onClose={() => setShowAddEventModal(false)}
            user={user}
            setTasks={setTasks}
        />
      )}
    </div>
  );
};

// --- Add Event Modal ---
const AddEventModal = ({ onClose, user, setTasks }) => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        deadline: '',
        priority: 'medium',
        assigneeId: user.id, // Default to self-assign
    });
    const { toast } = useToast();

    useEffect(() => {
        api.get('/users').then(res => setEmployees(res.data.filter(u => u.role === 'employee')));
    }, []);
    
    const handleInputChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleAddEvent = async () => {
        if (!formData.title || !formData.deadline) {
            return toast({ title: "Missing Fields", description: "Title and deadline are required.", variant: "destructive" });
        }
        setIsLoading(true);
        try {
            const allUsers = [user, ...employees];
            const assignee = allUsers.find(emp => emp._id === formData.assigneeId);
            
            const taskData = {
                ...formData,
                assignee: assignee.name,
                description: 'Calendar event created by manager.'
            };
            const { data: newEvent } = await api.post('/tasks', taskData);
            setTasks(prev => [...prev, newEvent]); // Add new event to the calendar
            toast({ title: "Success", description: "Event added to the calendar."});
            onClose();
        } catch (error) {
            toast({ title: "Failed to Add Event", description: "An error occurred.", variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
                <div className="space-y-4">
                    <input type="text" name="title" placeholder="Event Title *" onChange={handleInputChange} className="w-full p-2 border rounded" required />
                    <input type="date" name="deadline" onChange={handleInputChange} className="w-full p-2 border rounded" required />
                    <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full p-2 border rounded">
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                     <select name="assigneeId" value={formData.assigneeId} onChange={handleInputChange} className="w-full p-2 border rounded">
                        <option value={user.id}>Assign to Myself ({user.name})</option>
                        {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
                    </select>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAddEvent} disabled={isLoading}>
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        Add Event
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CalendarView;