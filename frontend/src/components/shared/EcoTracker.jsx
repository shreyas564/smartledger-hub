import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Zap, TreePine, TrendingUp, Award, FileText } from 'lucide-react';

const EcoTracker = ({ user }) => {
  const [ecoData, setEcoData] = useState({
    paperSaved: 1250, // kg
    waterSaved: 12500, // liters
    co2Saved: 5.0, // kg
    energySaved: 6.25, // kWh
    treesEquivalent: 15
  });

  const [departmentData, setDepartmentData] = useState([
    { name: 'Operations', paperSaved: 450, percentage: 36 },
    { name: 'Administration', paperSaved: 320, percentage: 25.6 },
    { name: 'Engineering', paperSaved: 280, percentage: 22.4 },
    { name: 'Safety', paperSaved: 200, percentage: 16 }
  ]);

  const [monthlyTrend, setMonthlyTrend] = useState([
    { month: 'Jan', paperSaved: 180 },
    { month: 'Feb', paperSaved: 220 },
    { month: 'Mar', paperSaved: 195 },
    { month: 'Apr', paperSaved: 240 },
    { month: 'May', paperSaved: 210 },
    { month: 'Jun', paperSaved: 205 }
  ]);

  // Calculations based on the requirements
  useEffect(() => {
    const { paperSaved } = ecoData;
    setEcoData(prev => ({
      ...prev,
      waterSaved: paperSaved * 10,
      co2Saved: (paperSaved * 4) / 1000,
      energySaved: (paperSaved / 1000) * 5,
      treesEquivalent: Math.floor(paperSaved / 83) // Approximate trees saved
    }));
  }, [ecoData.paperSaved]);

  const ecoMetrics = [
    {
      icon: FileText,
      label: 'Paper Saved',
      value: ecoData.paperSaved,
      unit: 'kg',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Droplets,
      label: 'Water Saved',
      value: ecoData.waterSaved,
      unit: 'liters',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: TreePine,
      label: 'CO₂ Saved',
      value: ecoData.co2Saved,
      unit: 'kg',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Zap,
      label: 'Energy Saved',
      value: ecoData.energySaved,
      unit: 'kWh',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Leaf className="w-8 h-8 text-green-600 mr-3" />
            EcoTracker
          </h1>
          <p className="text-gray-600">Environmental impact of digital transformation</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="font-medium">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ecoMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="eco-card"
            >
              <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <IconComponent className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className="eco-value">{metric.value.toLocaleString()}</div>
              <div className="eco-unit">{metric.unit}</div>
              <div className="text-sm text-white/80 mt-1">{metric.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Trees Equivalent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Trees Saved Equivalent</h3>
            <p className="text-green-100">Your digital efforts have saved the equivalent of</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{ecoData.treesEquivalent}</div>
            <div className="text-green-100">trees</div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <TreePine className="w-5 h-5 mr-2" />
          <span className="text-sm">Based on average paper consumption per tree</span>
        </div>
      </motion.div>

      {/* Department Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Department Contribution
          </h3>
          <div className="space-y-4">
            {departmentData.map((dept, index) => (
              <div key={dept.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{dept.name}</span>
                  <span className="text-gray-600">{dept.paperSaved}kg ({dept.percentage}%)</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.percentage}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                    className="progress-fill bg-green-500"
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Monthly Trend
          </h3>
          <div className="space-y-3">
            {monthlyTrend.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm font-medium w-12">{month.month}</span>
                <div className="flex-1 mx-3">
                  <div className="progress-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(month.paperSaved / 250) * 100}%` }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                      className="progress-fill bg-blue-500"
                    ></motion.div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">{month.paperSaved}kg</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Calculation Explanations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-50 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">How We Calculate Environmental Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="help-section">
              <div className="help-title">Water Saved</div>
              <div className="help-content">
                Water Saved = Paper Saved × 10 liters
                <br />
                <span className="text-xs text-gray-500">Based on water consumption in paper production</span>
              </div>
            </div>
            
            <div className="help-section">
              <div className="help-title">CO₂ Saved</div>
              <div className="help-content">
                CO₂ Saved = (Paper Saved × 4) ÷ 1000 kg
                <br />
                <span className="text-xs text-gray-500">Carbon footprint reduction from digital documents</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="help-section">
              <div className="help-title">Energy Saved</div>
              <div className="help-content">
                Energy Saved = (Paper Saved ÷ 1000) × 5 kWh
                <br />
                <span className="text-xs text-gray-500">Energy consumption in paper manufacturing</span>
              </div>
            </div>
            
            <div className="help-section">
              <div className="help-title">Department Contribution</div>
              <div className="help-content">
                Contribution% = (Department Paper Saved ÷ Total Paper Saved) × 100
                <br />
                <span className="text-xs text-gray-500">Relative environmental impact by department</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EcoTracker;