const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['task_assigned', 'doc_submitted', 'task_completed', 'deadline', 'mention'], required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isRead: { type: Boolean, default: false },
  link: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Notification', notificationSchema);