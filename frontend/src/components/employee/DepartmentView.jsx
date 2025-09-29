import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Building, User, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

// **MODIFIED**: Component now accepts onStartChat as a prop
const DepartmentManagement = ({ onStartChat }) => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/departments');
      setDepartments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch department data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Department Management</h1>
        <p className="text-muted-foreground">View the organizational structure and members</p>
      </div>

      <div className="space-y-8">
        {departments.map((dept, index) => (
          <motion.div
            key={dept._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center mb-4 border-b pb-3">
              <Building className="w-6 h-6 mr-3 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">{dept.name}</h2>
            </div>
            
            {dept.employees && dept.employees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dept.employees.map(emp => (
                  <div key={emp._id} className="bg-secondary p-3 rounded-md flex items-center justify-between transition-colors hover:bg-secondary/80">
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mr-3">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{emp.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{emp.role}</p>
                      </div>
                    </div>
                    {/* **MODIFIED**: onClick now calls the onStartChat function with the employee object */}
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onStartChat(emp)}>
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">No members assigned to this department yet.</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentManagement;