import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Link, FileText, Clock, CheckCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const DocumentAssistantDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [cloudLink, setCloudLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [recentUploads, setRecentUploads] = useState([
    { id: 1, name: 'Budget Report Q4.pdf', type: 'file', uploadedAt: '2025-09-27 14:30', status: 'completed' },
    { id: 2, name: 'Safety Guidelines', type: 'link', uploadedAt: '2025-09-27 12:15', status: 'completed' },
    { id: 3, name: 'Meeting Minutes.docx', type: 'file', uploadedAt: '2025-09-26 16:45', status: 'completed' },
    { id: 4, name: 'Project Timeline', type: 'link', uploadedAt: '2025-09-26 11:20', status: 'completed' },
    { id: 5, name: 'Annual Report.pdf', type: 'file', uploadedAt: '2025-09-25 09:30', status: 'completed' }
  ]);

  const { toast } = useToast();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmitFile = () => {
    if (!uploadedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    setTimeout(() => {
      const newUpload = {
        id: recentUploads.length + 1,
        name: uploadedFile.name,
        type: 'file',
        uploadedAt: new Date().toLocaleString(),
        status: 'completed'
      };
      
      setRecentUploads([newUpload, ...recentUploads.slice(0, 4)]);
      setUploadedFile(null);
      setIsUploading(false);
      
      toast({
        title: "Document Submitted Successfully!",
        description: `${uploadedFile.name} has been uploaded and is now available for review.`
      });
    }, 2000);
  };

  const handleSubmitLink = () => {
    if (!cloudLink.trim()) {
      toast({
        title: "No Link Provided",
        description: "Please enter a valid cloud link.",
        variant: "destructive"
      });
      return;
    }

    try {
      new URL(cloudLink);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    setTimeout(() => {
      const newUpload = {
        id: recentUploads.length + 1,
        name: cloudLink.split('/').pop() || 'Cloud Document',
        type: 'link',
        uploadedAt: new Date().toLocaleString(),
        status: 'completed'
      };
      
      setRecentUploads([newUpload, ...recentUploads.slice(0, 4)]);
      setCloudLink('');
      setIsUploading(false);
      
      toast({
        title: "Document Submitted Successfully!",
        description: "Cloud link has been validated and submitted for review."
      });
    }, 1500);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">LEDGER - Document Assistant</h1>
            <p className="text-muted-foreground">Welcome, {user.name}</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Upload Document
              </h2>

              {/* Tab Navigation */}
              <div className="flex mb-8 bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${
                    activeTab === 'upload'
                      ? 'bg-card text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  File Upload
                </button>
                <button
                  onClick={() => setActiveTab('link')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${
                    activeTab === 'link'
                      ? 'bg-card text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Link className="w-5 h-5 mr-2" />
                  Cloud Link
                </button>
              </div>

              {/* File Upload Tab */}
              {activeTab === 'upload' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div
                    className="upload-zone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      Drag and drop your file here
                    </p>
                    <p className="text-muted-foreground mb-4">or</p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      Choose File
                    </label>
                  </div>

                  {uploadedFile && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-primary mr-3" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{uploadedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleSubmitFile}
                    disabled={!uploadedFile || isUploading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
                    size="lg"
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner mr-2"></div>
                        Uploading...
                      </div>
                    ) : (
                      'Submit Document'
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Cloud Link Tab */}
              {activeTab === 'link' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cloud Document Link
                    </label>
                    <input
                      type="url"
                      value={cloudLink}
                      onChange={(e) => setCloudLink(e.target.value)}
                      placeholder="https://drive.google.com/... or https://sharepoint.com/..."
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Supported: Google Drive, SharePoint, Dropbox, OneDrive
                    </p>
                  </div>

                  <Button
                    onClick={handleSubmitLink}
                    disabled={!cloudLink.trim() || isUploading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
                    size="lg"
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner mr-2"></div>
                        Validating...
                      </div>
                    ) : (
                      'Submit Link'
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Recent Uploads Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-foreground mb-6">Recent Uploads</h3>
              
              <div className="space-y-4">
                {recentUploads.map((upload) => (
                  <div key={upload.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {upload.type === 'file' ? (
                          <FileText className="w-5 h-5 text-primary" />
                        ) : (
                          <Link className="w-5 h-5 text-indigo-500" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {upload.name}
                        </p>
                        <div className="flex items-center mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground mr-1" />
                          <p className="text-xs text-muted-foreground">{upload.uploadedAt}</p>
                        </div>
                        <div className="flex items-center mt-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-xs text-green-600 font-medium">Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAssistantDashboard;