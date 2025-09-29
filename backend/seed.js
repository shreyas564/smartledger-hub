const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const Document = require('./models/Document');
const Notice = require('./models/Notice');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding.');

    // --- Clear All Existing Data ---
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Task.deleteMany({});
    await Document.deleteMany({});
    await Notice.deleteMany({});

    // --- Seed Users ---
    console.log('Seeding users...');
    const users = await User.create([
      { name: 'Arun Sharma', email: 'arun.sharma@kmrl.co.in', role: 'manager', department: 'Operations' },
      { name: 'Priya Verma', email: 'priya.verma@kmrl.co.in', role: 'employee', department: 'Operations' },
      { name: 'Sunita Nair', email: 'sunita.nair@kmrl.co.in', role: 'employee', department: 'Safety' },
      { name: 'Vikram Singh', email: 'vikram.singh@kmrl.co.in', role: 'doc_assistant', department: 'Admin' },
    ]);
    const manager = users.find(u => u.role === 'manager');
    const employee = users.find(u => u.email === 'priya.verma@kmrl.co.in');

    // --- Seed Documents ---
    console.log('Seeding documents...');
    await Document.create([
        {
            title: 'Q4 Financial Performance Review.pdf',
            englishSummary: 'A comprehensive review of the financial performance for the fourth quarter, detailing revenue streams, expenditures, and net profit margins.',
            malayalamSummary: 'നാലാം പാദത്തിലെ സാമ്പത്തിക പ്രകടനത്തെക്കുറിച്ചുള്ള സമഗ്രമായ അവലോകനം, വരുമാന മാർഗ്ഗങ്ങൾ, ചെലവുകൾ, അറ്റാദായം എന്നിവ വിശദമാക്കുന്നു.',
            keywords: ['finance', 'q4', 'report', 'revenue'],
            filePath: 'uploads/sample-financials.pdf',
            uploadedBy: manager._id,
            department: 'Operations'
        },
        {
            title: 'Updated Metro Safety Protocols.docx',
            englishSummary: 'This document outlines the newly updated safety protocols for all metro stations, including emergency evacuation procedures and new equipment standards.',
            malayalamSummary: 'എല്ലാ മെട്രോ സ്റ്റേഷനുകൾക്കുമുള്ള പുതിയ സുരക്ഷാ പ്രോട്ടോക്കോളുകൾ ഈ പ്രമാണത്തിൽ വിവരിക്കുന്നു, അടിയന്തര ഒഴിപ്പിക്കൽ നടപടിക്രമങ്ങളും പുതിയ ഉപകരണ മാനദണ്ഡങ്ങളും ഉൾപ്പെടെ.',
            keywords: ['safety', 'protocol', 'emergency', 'metro'],
            filePath: 'uploads/sample-safety.docx',
            uploadedBy: manager._id,
            department: 'Safety'
        },
        {
            title: 'Marketing Campaign Analysis - Phase 2.pptx',
            englishSummary: 'Analysis of the second phase of the recent marketing campaign, focusing on digital outreach, social media engagement, and return on investment.',
            malayalamSummary: 'സമീപകാല മാർക്കറ്റിംഗ് കാമ്പെയ്‌നിന്റെ രണ്ടാം ഘട്ടത്തിന്റെ വിശകലനം, ഡിജിറ്റൽ ഔട്ട്‌റീച്ച്, സോഷ്യൽ മീഡിയ ഇടപെടൽ, നിക്ഷേപത്തിൽ നിന്നുള്ള വരുമാനം എന്നിവയിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുന്നു.',
            keywords: ['marketing', 'campaign', 'analysis', 'social media'],
            filePath: 'uploads/sample-marketing.pptx',
            uploadedBy: manager._id,
            department: 'Marketing'
        }
    ]);

    // --- Seed Tasks ---
    console.log('Seeding tasks...');
    await Task.create([
      {
        title: 'Finalize Q4 Financial Reports',
        description: 'Review and summarize the quarterly financial statements.',
        assigneeId: employee._id,
        assignee: employee.name,
        priority: 'high',
        status: 'pending',
        deadline: new Date('2025-10-15'),
        createdBy: manager._id,
      },
    ]);

    console.log('Data seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();