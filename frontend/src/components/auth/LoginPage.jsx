import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

const LoginPage = ({ onLogin }) => {
  const [selectedEmail, setSelectedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sampleUsers = [
    { email: 'arun.sharma@kmrl.co.in', role: 'Manager', name: 'Arun Sharma' },
    { email: 'priya.verma@kmrl.co.in', role: 'Employee', name: 'Priya Verma' },
    { email: 'vikram.singh@kmrl.co.in', role: 'Document Assistant', name: 'Vikram Singh' },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedEmail) {
      toast({ title: 'Error', description: 'Please select a user', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/dev-login', { email: selectedEmail });
      onLogin(res.data.user, res.data.token);
      toast({ title: 'Success', description: 'Logged in successfully' });
    } catch (error) {
      console.error('Dev login error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to log in',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">LEDGER - KMRL DMS</h1>
          <p className="text-muted-foreground">Select a user to log in (Development Mode)</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Select User</label>
            <select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a user</option>
              {sampleUsers.map(user => (
                <option key={user.email} value={user.email}>
                  {user.name} ({user.role}) - {user.email}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Log In
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;