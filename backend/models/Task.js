const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignee: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'working', 'submitted_for_review', 'completed'], default: 'pending' },
  deadline: { type: Date, required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);