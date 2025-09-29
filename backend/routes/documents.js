const express = require('express');
const multer = require('multer');
const path = require('path');
const Document = require('../models/Document');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure 'uploads' directory exists in your backend folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// GET /api/documents - Fetch and search documents
router.get('/', authMiddleware, async (req, res) => {  
  try {
    const { searchTerm } = req.query;
    let query = {};
    if (searchTerm) {
      query = { $text: { $search: searchTerm } };
    }
    const documents = await Document.find(query).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching documents.' });
  }
});

// POST /api/documents - Upload a new document with automated details
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded.' });
    }

    // Automated field generation
    const title = req.file.originalname;
    const englishSummary = `Auto-generated summary for: ${title}. Please edit to provide more details.`;
    const malayalamSummary = `"${title}" എന്നതിനായുള്ള സംഗ്രഹം. കൂടുതൽ വിവരങ്ങൾ നൽകുന്നതിന് ദയവായി എഡിറ്റ് ചെയ്യുക.`;
    const keywords = title.replace(/\.[^/.]+$/, "").split(/[\s_-]+/).filter(k => k.length > 3);

    const newDocument = new Document({
      title,
      englishSummary,
      malayalamSummary,
      keywords,
      filePath: req.file.path,
      uploadedBy: req.user.id,
      department: req.user.department
    });

    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ message: 'Server error while uploading document.' });
  }
});

module.exports = router;