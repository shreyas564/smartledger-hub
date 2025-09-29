const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import the Document model to ensure indexes are created
const Document = require('./models/Document');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
console.log(`CORS is configured to allow requests from: ${frontendURL}`); // Debug log
const corsOptions = {
  origin: frontendURL,
};
app.use(cors(corsOptions));

app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/departments', require('./routes/departments'));

// --- Database Connection & Server Startup ---
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env file");
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully.');

    // Ensure indexes are created
    console.log('🔄 Ensuring database indexes are created...');
    await Document.syncIndexes();
    console.log('✅ Text indexes confirmed.');

    // Ensure the 'uploads' directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
      console.log(`📂 Created 'uploads' directory at ${uploadsDir}`);
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to start the server:', err);
    process.exit(1);
  }
})();
