import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Send, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const DocumentManagement = ({ user, documents, setDocuments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleSubmitForReview = (docId) => {
    setDocuments(docs => docs.map(d => d.id === docId ? { ...d, status: 'submitted' } : d));
    toast({
      title: "Document Submitted",
      description: "Your document has been sent to the manager for review."
    });
  };

  const handleUpload = () => {
    toast({
      title: "Upload Deliverable",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="status-badge status-completed">Approved</span>;
      case 'rejected':
        return <span className="status-badge status-rejected">Rejected</span>;
      case 'submitted':
        return <span className="status-badge status-submitted">Submitted</span>;
      default:
        return <span className="status-badge status-pending">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Documents</h1>
        <p className="text-muted-foreground">Manage and submit your documents</p>
      </div>

      <div className="bg-card rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button onClick={handleUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Deliverable
          </Button>
        </div>

        <div className="space-y-3">
          {filteredDocuments.length > 0 ? filteredDocuments.map(doc => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="document-card p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="flex items-center mb-3 sm:mb-0">
                <FileText className="w-6 h-6 text-primary mr-4" />
                <p className="font-medium text-foreground">{doc.title}</p>
              </div>
              <div className="flex items-center space-x-4">
                {getStatusBadge(doc.status)}
                <Button
                  onClick={() => handleSubmitForReview(doc.id)}
                  size="sm"
                  disabled={doc.status === 'submitted' || doc.status === 'approved'}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Review
                </Button>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <p>No documents found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;