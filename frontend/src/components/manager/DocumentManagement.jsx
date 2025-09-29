import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Search, UserPlus, RefreshCw, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-card rounded-lg shadow-xl w-full max-w-lg"
      onClick={e => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </div>
);

const DocumentManagement = ({ user }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasFetched, setHasFetched] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async (isInitial = false) => {
    setIsLoading(true);
    if (!isInitial) setHasFetched(true);
    try {
      const { data } = await api.get(`/documents?searchTerm=${searchTerm}`);
      setDocuments(data);
      if (!isInitial) {
        toast({ title: "Documents Refreshed", description: `${data.length} documents found.` });
      }
    } catch (error) {
      toast({ title: "Error Fetching Documents", description: error.response?.data?.message || "An unexpected server error occurred.", variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDocuments();
  };

  const openAssignModal = (doc) => {
    setSelectedDoc(doc);
    setShowAssignModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">Upload, search, and assign documents</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => fetchDocuments()}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Fetch
            </Button>
            <Button onClick={() => setShowUploadModal(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
            </Button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name, summary, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-4 py-2 border rounded-lg"
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="space-y-4">
        {isLoading && <div className="text-center p-8"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>}
        
        {!isLoading && documents.map(doc => (
          <motion.div key={doc._id} className="p-4 bg-card rounded-lg shadow-sm border">
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-4">
                <h3 className="font-semibold text-lg text-primary">{doc.title}</h3>
                <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <p><strong className="font-medium text-foreground">Summary:</strong> {doc.englishSummary}</p>
                  <p><strong className="font-medium text-foreground">സംഗ്രഹം:</strong> {doc.malayalamSummary}</p>
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-muted-foreground"/>
                  {doc.keywords.map(k => <span key={k} className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full">{k}</span>)}
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => openAssignModal(doc)}>
                <UserPlus className="w-4 h-4 mr-2" /> Assign
              </Button>
            </div>
          </motion.div>
        ))}

         {!isLoading && !documents.length && hasFetched && (
            <div className="text-center p-12 bg-card rounded-lg border-2 border-dashed">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No Documents Found</h3>
                <p className="text-muted-foreground">Click "Fetch" or try a different search term.</p>
            </div>
        )}
      </div>

      {showUploadModal && <UploadDocumentModal onClose={() => setShowUploadModal(false)} onUploadSuccess={fetchDocuments} />}
      {showAssignModal && <AssignDocumentModal doc={selectedDoc} onClose={() => setShowAssignModal(false)} />}
    </div>
  );
};

// --- Upload Modal ---
const UploadDocumentModal = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    if (e.target.files.length) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast({ title: "No File Selected", variant: 'destructive'});
    setIsUploading(true);
    const postData = new FormData();
    postData.append('file', file);
    
    try {
        await api.post('/documents', postData);
        toast({ title: "Success", description: `${file.name} uploaded.`});
        onUploadSuccess();
        onClose();
    } catch (error) {
        toast({ title: "Upload Failed", description: error.response?.data?.message, variant: 'destructive'});
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
        <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
        {file && <p className="text-sm font-medium text-center bg-secondary p-2 mt-4 rounded-md">{file.name}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// --- Assign Modal ---
const AssignDocumentModal = ({ doc, onClose }) => {
    const [employees, setEmployees] = useState([]);
    const [assigneeId, setAssigneeId] = useState('');
    const [deadline, setDeadline] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        api.get('/users').then(res => setEmployees(res.data.filter(u => u.role === 'employee')));
    }, []);

    const handleAssign = async () => {
        if (!assigneeId || !deadline) return toast({ title: "Missing Fields", variant: "destructive"});
        try {
            const assignee = employees.find(emp => emp._id === assigneeId);
            await api.post('/tasks', { title: `Review: ${doc.title}`, assigneeId, assignee: assignee.name, deadline, documentId: doc._id });
            toast({ title: "Success", description: "Document assigned." });
            onClose();
        } catch (error) {
            toast({ title: "Failed", description: "Could not assign document.", variant: 'destructive' });
        }
    };
    
    return (
        <Modal onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Assign: {doc.title}</h2>
                <div className="space-y-4">
                    <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="w-full p-2 border rounded"><option value="">Select Employee</option>{employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}</select>
                    <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAssign}>Assign</Button>
                </div>
            </div>
        </Modal>
    )
};

export default DocumentManagement;