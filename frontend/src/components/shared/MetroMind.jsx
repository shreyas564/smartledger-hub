import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Plus, MessageSquare, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const MetroMind = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm Metro Mind. As I'm currently in a training phase, my responses are limited. How can I assist you today?",
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsReplying(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Model is under training phase. Sorry for the inconvenience.',
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsReplying(false);
    }, 1500);
  };

  const handleFileUpload = () => {
    // This triggers the hidden file input
    document.getElementById('file-upload-input').click();
  };

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      toast({
        title: "File Selected",
        description: `${file.name} is ready to be processed. (Feature in development)`,
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-card rounded-lg border shadow-sm overflow-hidden">
      {/* Chat History Sidebar */}
      <div className="w-72 bg-secondary/50 border-r p-4 flex flex-col">
        <Button variant="outline" className="w-full mb-4">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-primary/10 text-primary cursor-pointer">
              <p className="font-semibold text-sm truncate">Recent Document Questions</p>
            </div>
            <div className="p-3 rounded-md hover:bg-accent cursor-pointer">
              <p className="text-sm truncate">Task Summarization History</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-4 ${msg.type === 'user' ? 'justify-end' : ''}`}
              >
                {msg.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className={`px-4 py-3 rounded-lg max-w-lg ${
                  msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            {isReplying && (
               <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div className="px-4 py-3 rounded-lg bg-secondary flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-0"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150 mx-1.5"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        <div className="p-4 border-t bg-card">
          <div className="relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask Metro Mind anything..."
              className="w-full pl-12 pr-20 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:outline-none"
              rows={1}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Button variant="ghost" size="icon" onClick={handleFileUpload}>
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </Button>
              <input type="file" id="file-upload-input" className="hidden" onChange={onFileSelect} />
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isReplying}>
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetroMind;