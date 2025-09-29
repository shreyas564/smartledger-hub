const mongoose = require('mongoose');
const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  type: { type: String, enum: ['Central', 'State', 'Dept'], default: 'Dept' },
  departments: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filePath: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Notice', noticeSchema);