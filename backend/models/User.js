const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['manager', 'employee', 'doc_assistant'], required: true },
  department: { type: String, default: 'Unassigned' },
  isVerified: { type: Boolean, default: true }, 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);