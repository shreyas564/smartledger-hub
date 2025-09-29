import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Search, User, Circle, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

const MessagingSystem = ({ user, initialUser }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Conversations are kept in local state for demonstration purposes
  const [conversations, setConversations] = useState({});
  const { toast } = useToast();

  // Fetch all other users to serve as the contact list
  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/users');
      // Filter out the current user from the contact list
      const otherUsers = data.filter(u => u._id !== user.id);
      setContacts(otherUsers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch contacts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user.id]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // This hook handles opening a chat when directed from the Departments page
  useEffect(() => {
    if (initialUser && contacts.length > 0) {
      const contactToSelect = contacts.find(c => c._id === initialUser._id);
      if (contactToSelect) {
        setSelectedChat(contactToSelect);
      }
    }
  }, [initialUser, contacts]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(), // Use timestamp for a unique key
      senderId: user.id,
      senderName: user.name,
      content: messageInput,
    };

    setConversations(prev => {
      const existingMessages = prev[selectedChat._id] || [];
      return {
        ...prev,
        [selectedChat._id]: [...existingMessages, newMessage]
      };
    });
    setMessageInput('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-card rounded-lg shadow-sm border overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            contacts.map(contact => (
              <div
                key={contact._id}
                onClick={() => setSelectedChat(contact)}
                className={`p-3 border-b cursor-pointer flex items-center ${
                  selectedChat?._id === contact._id ? 'bg-primary/10' : 'hover:bg-accent'
                }`}
              >
                <div className="relative mr-3">
                  <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.department}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b bg-secondary">
              <p className="font-semibold">{selectedChat.name}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Welcome message for new chat */}
              {(!conversations[selectedChat._id] || conversations[selectedChat._id].length === 0) && (
                  <div className="text-center text-sm text-muted-foreground p-4">
                      This is the beginning of your conversation with {selectedChat.name}.
                  </div>
              )}

              {/* Display messages */}
              {conversations[selectedChat._id]?.map((message) => (
                <div key={message.id} className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${message.senderId === user.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Message ${selectedChat.name}`}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <Button onClick={handleSendMessage} disabled={!messageInput.trim()}><Send className="w-4 h-4" /></Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
            <div>
              <MessageSquare className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Select a Conversation</h3>
              <p className="text-sm">Choose a contact from the list to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingSystem;