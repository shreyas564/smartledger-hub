const mongoose = require('mongoose');
const User = require('./models/User');
const Document = require('./models/Document');
require('dotenv').config();

const seedDocuments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding documents.');

    // --- Find the Manager User to Assign Ownership ---
    const manager = await User.findOne({ role: 'manager' });
    if (!manager) {
      console.error('Error: A manager role user is required to seed documents. Please seed users first.');
      mongoose.connection.close();
      return;
    }
    console.log(`Found manager: ${manager.name} (${manager._id})`);

    // --- Clear Only the Documents Collection ---
    console.log('Clearing existing documents...');
    await Document.deleteMany({});

    // --- Seed New Sample Documents ---
    console.log('Seeding new sample documents...');
    await Document.create([
        {
            title: 'Q4 Financial Performance Review.pdf',
            englishSummary: 'A comprehensive review of the financial performance for the fourth quarter, detailing revenue streams, expenditures, and net profit margins.',
            malayalamSummary: 'നാലാം പാദത്തിലെ സാമ്പത്തിക പ്രകടനത്തെക്കുറിച്ചുള്ള സമഗ്രമായ അവലോകനം, വരുമാന മാർഗ്ഗങ്ങൾ, ചെലവുകൾ, അറ്റാദായം എന്നിവ വിശദമാക്കുന്നു.',
            keywords: ['finance', 'q4', 'report', 'revenue'],
            filePath: 'uploads/sample-financials.pdf', // Note: This is a placeholder path
            uploadedBy: manager._id,
            department: manager.department
        },
        {
            title: 'Updated Metro Safety Protocols.docx',
            englishSummary: 'This document outlines the newly updated safety protocols for all metro stations, including emergency evacuation procedures and new equipment standards.',
            malayalamSummary: 'എല്ലാ മെട്രോ സ്റ്റേഷനുകൾക്കുമുള്ള പുതിയ സുരക്ഷാ പ്രോട്ടോക്കോളുകൾ ഈ പ്രമാണത്തിൽ വിവരിക്കുന്നു, അടിയന്തര ഒഴിപ്പിക്കൽ നടപടിക്രമങ്ങളും പുതിയ ഉപകരണ മാനദണ്ഡങ്ങളും ഉൾപ്പെടെ.',
            keywords: ['safety', 'protocol', 'emergency', 'metro'],
            filePath: 'uploads/sample-safety.docx', // Note: This is a placeholder path
            uploadedBy: manager._id,
            department: 'Safety'
        },
        {
            title: 'Marketing Campaign Analysis - Phase 2.pptx',
            englishSummary: 'Analysis of the second phase of the recent marketing campaign, focusing on digital outreach, social media engagement, and return on investment.',
            malayalamSummary: 'സമീപകാല മാർക്കറ്റിംഗ് കാമ്പെയ്‌നിന്റെ രണ്ടാം ഘട്ടത്തിന്റെ വിശകലനം, ഡിജിറ്റൽ ഔട്ട്‌റീച്ച്, സോഷ്യൽ മീഡിയ ഇടപെടൽ, നിക്ഷേപത്തിൽ നിന്നുള്ള വരുമാനം എന്നിവയിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുന്നു.',
            keywords: ['marketing', 'campaign', 'analysis', 'social media'],
            filePath: 'uploads/sample-marketing.pptx', // Note: This is a placeholder path
            uploadedBy: manager._id,
            department: 'Marketing'
        }
    ]);

    console.log('Documents seeded successfully!');
  } catch (error) {
    console.error('Error seeding documents:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDocuments();