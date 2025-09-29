import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, CheckSquare, FileText, Megaphone, Calendar, 
  MessageSquare, Building, Leaf, Brain, Bell, Settings, LogOut,
  Menu, ChevronsUp, ChevronUp, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap = {
  LayoutDashboard, CheckSquare, FileText, Megaphone, Calendar, 
  MessageSquare, Building, Leaf, Brain, Bell, Settings
};

// Added tasks = [] as a default value to prevent crashes
const Sidebar = ({ menuItems, activeModule, onModuleChange, collapsed, onToggleCollapse, userRole, onLogout, tasks = [] }) => {
  
  const priorityCounts = {
    urgent: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length,
    high: tasks.filter(t => t.priority === 'medium' && t.status !== 'completed').length,
    low: tasks.filter(t => t.priority === 'low' && t.status !== 'completed').length
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      className="bg-card shadow-lg flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between h-[65px]">
        {!collapsed && (
          <motion.div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mr-3">
              <Building className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">LEDGER</h2>
              <p className="text-xs text-muted-foreground">KMRL DMS</p>
            </div>
          </motion.div>
        )}
        <Button onClick={onToggleCollapse} variant="ghost" size="icon" className="w-8 h-8">
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Priority Alerts (Only for Manager) */}
      {!collapsed && userRole === 'manager' && (
        <motion.div className="p-4 border-b overflow-hidden">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Priority Items</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-red-600"><ChevronsUp className="w-4 h-4 mr-2" /> Urgent</span>
              <span className="bg-red-100 text-red-700 font-bold text-xs rounded-full px-2 py-0.5">{priorityCounts.urgent}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-yellow-600"><ChevronUp className="w-4 h-4 mr-2" /> High</span>
              <span className="bg-yellow-100 text-yellow-700 font-bold text-xs rounded-full px-2 py-0.5">{priorityCounts.high}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-green-600"><ChevronDown className="w-4 h-4 mr-2" /> Low</span>
              <span className="bg-green-100 text-green-700 font-bold text-xs rounded-full px-2 py-0.5">{priorityCounts.low}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = iconMap[item.icon];
            const isActive = activeModule === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onModuleChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-md ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'} ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : ''}
                >
                  <IconComponent className="w-5 h-5" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t">
        <button 
          onClick={onLogout}
          className={`w-full flex items-center px-3 py-2 text-muted-foreground hover:bg-accent hover:text-destructive rounded-md ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;