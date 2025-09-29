const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  englishSummary: { type: String, default: '' },
  malayalamSummary: { type: String, default: '' },
  keywords: { type: [String], default: [] },
  filePath: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String },
  source: { type: String, default: 'upload' },
}, { timestamps: true });

// Create a text index to enable powerful searching across multiple fields
documentSchema.index({ 
    title: 'text', 
    englishSummary: 'text', 
    malayalamSummary: 'text',
    keywords: 'text'
});

module.exports = mongoose.model('Document', documentSchema);