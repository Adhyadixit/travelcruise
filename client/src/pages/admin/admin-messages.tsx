import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { 
  initializeSocket, 
  subscribeToNewMessages, 
  subscribeToNewConversations,
  unsubscribeFromEvent,
  joinConversation,
  leaveConversation,
  sendTypingIndicator,
  subscribeToTypingIndicators,
  ConversationNotification
} from "@/lib/socket";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Search, MessageCircle, MessagesSquare, Send } from "lucide-react";
import { format, isValid } from "date-fns";

// Format date safely
const formatDate = (dateString: string | null | undefined, formatStr: string = "MMM d, h:mm a"): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return "Invalid date";
    return format(date, formatStr);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Error";
  }
};

// Message and conversation types from schema
type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

type GuestUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  sessionId: string;
};

type Conversation = {
  id: number;
  userId: number | null;
  guestUserId: number | null;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  unreadByAdmin: boolean;
  unreadByUser: boolean;
  user?: User;
  guestUser?: GuestUser;
};

// Enhanced Message type to handle both API return formats
type Message = {
  id: number;
  conversationId: number;
  
  // Message content (can be body or content depending on API)
  body?: string;
  content?: string;
  
  // Sender info (can be type or senderType)
  type?: string;
  senderType?: string;
  senderId?: number;
  
  // Timestamps (can be sentAt or createdAt)
  sentAt?: string;
  createdAt?: string;
  
  // Other fields
  readAt?: string | null;
  messageType?: string;
  fileUrl?: string | null;
};

export default function AdminMessages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [remoteTypingUsers, setRemoteTypingUsers] = useState<{[conversationId: string]: boolean}>({});
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Initialize the socket connection for real-time updates
  useEffect(() => {
    // Initialize socket connection
    const socket = initializeSocket();
    
    // Subscribe to new message notifications
    subscribeToNewMessages((newMessage) => {
      console.log("New message received via socket:", newMessage);
      
      // Play a notification sound for new messages
      const audio = new Audio('/notification.mp3');
      audio.play().catch(err => console.log('Audio play failed:', err));
      
      // Show a toast notification for the new message
      toast({
        title: "New Message",
        description: `You have a new message${selectedConversation ? (newMessage.conversationId === selectedConversation.id ? " in the current conversation" : " in another conversation") : ""}`,
        variant: "default",
      });
      
      // Refresh the messages if we're viewing the conversation that received a new message
      if (selectedConversation && newMessage.conversationId === selectedConversation.id) {
        queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedConversation.id] });
      }
      
      // Always refresh the conversations list to update unread indicators and last message times
      queryClient.invalidateQueries({ queryKey: ["/api/direct/conversations"] });
    });
    
    // Subscribe to new conversation events
    subscribeToNewConversations((conversationData: ConversationNotification | number) => {
      console.log("New conversation created via socket:", conversationData);
      
      // Play notification sound for new conversation
      const audio = new Audio('/notification.mp3');
      audio.play().catch(err => console.log('Audio play failed:', err));
      
      // Check if the conversation data is an object with id or just an id
      const conversationId = typeof conversationData === 'object' ? conversationData.id : conversationData;
      const conversationSubject = typeof conversationData === 'object' && conversationData.subject 
        ? conversationData.subject 
        : "New conversation";
      
      // Show a detailed toast notification
      toast({
        title: "New Conversation",
        description: `${conversationSubject} - A new conversation has been started. Refreshing your conversations list.`,
        variant: "default",
      });
      
      // Refresh conversations list
      queryClient.invalidateQueries({ queryKey: ["/api/direct/conversations"] });
    });
    
    // Subscribe to typing indicators
    subscribeToTypingIndicators((typingData) => {
      console.log("Typing indicator received:", typingData);
      
      // Update typing indicators state
      setRemoteTypingUsers(prev => ({
        ...prev,
        [typingData.conversationId]: typingData.isTyping
      }));
    });
    
    // Cleanup function
    return () => {
      unsubscribeFromEvent('message-received');
      unsubscribeFromEvent('new-conversation');
      unsubscribeFromEvent('user-typing');
    };
  }, [selectedConversation]);
  
  // Handle cleanup is managed in a separate effect

  // Use direct database access to fetch conversations with user data
  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    error: conversationsError,
  } = useQuery<Conversation[]>({
    queryKey: ["/api/direct/conversations"],
  });

  // Get messages for selected conversation
  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
  } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedConversation?.id],
    queryFn: async () => {
      if (!selectedConversation) return [];
      const res = await fetch(`/api/messages?conversationId=${selectedConversation.id}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      return res.json();
    },
    enabled: !!selectedConversation,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, message }: { conversationId: number; message: string }) => {
      const response = await apiRequest("POST", `/api/messages`, {
        conversationId: conversationId,
        message: message,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedConversation?.id] });
      setMessageInput("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error: Error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mark conversation as read by admin
  const markAsReadMutation = useMutation({
    mutationFn: async (conversationId: number) => {
      const response = await apiRequest("POST", `/api/conversations/${conversationId}/read-admin`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/direct/conversations"] });
    },
  });

  const handleSelectConversation = (conversation: Conversation) => {
    // If we're changing conversations, leave the previous one
    if (selectedConversation && selectedConversation.id !== conversation.id) {
      leaveConversation(selectedConversation.id);
    }
    
    // Join the new conversation's socket room
    joinConversation(conversation.id);
    
    setSelectedConversation(conversation);
    
    if (conversation.unreadByAdmin) {
      markAsReadMutation.mutate(conversation.id);
    }
  };

  // State for typing indicator to show when admin is typing
  const [isTyping, setIsTyping] = useState(false);
  
  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!selectedConversation) return;
    
    // Only send typing indicator if not already typing
    if (!isTyping) {
      setIsTyping(true);
      // Join the room and send typing indicator
      joinConversation(selectedConversation.id);
      sendTypingIndicator(selectedConversation.id, user?.id || 0, 'admin', true);
    }
    
    // Clear previous timeout if any
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set a new timeout to stop typing indicator after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      setIsTyping(false);
      if (selectedConversation) {
        sendTypingIndicator(selectedConversation.id, user?.id || 0, 'admin', false);
      }
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    // Make sure we've joined the conversation room for real-time updates
    joinConversation(selectedConversation.id);
    
    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      sendTypingIndicator(selectedConversation.id, user?.id || 0, 'admin', false);
    }
    
    sendMessageMutation.mutate({
      conversationId: selectedConversation.id,
      message: messageInput,
    });
  };

  // Filter conversations based on search query
  const filteredConversations = searchQuery
    ? conversations.filter(
        (conv) =>
          (conv.subject && conv.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (conv.user && 
            ((conv.user.firstName + " " + conv.user.lastName).toLowerCase().includes(searchQuery.toLowerCase()) || 
             conv.user.email.toLowerCase().includes(searchQuery.toLowerCase()))) ||
          (conv.guestUser && 
            (conv.guestUser.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             conv.guestUser.email.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : conversations;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="md:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle>Conversations</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-auto">
                {conversationsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : conversationsError ? (
                  <div className="text-center py-4 text-destructive">
                    Failed to load conversations
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessagesSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No conversations found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        } ${conversation.unreadByAdmin ? "border-l-4 border-primary" : ""}`}
                        onClick={() => handleSelectConversation(conversation)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              {conversation.user
                                ? `${conversation.user.firstName} ${conversation.user.lastName}`
                                : conversation.guestUser
                                ? conversation.guestUser.name
                                : "Unknown User"}
                            </h3>
                            <p className="text-sm truncate">
                              {conversation.subject || "No subject"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs whitespace-nowrap">
                              {formatDate(conversation.lastMessageAt || conversation.createdAt)}
                            </span>
                            {conversation.unreadByAdmin && (
                              <Badge className="mt-1">New</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs">
                            {conversation.user
                              ? conversation.user.email
                              : conversation.guestUser
                              ? conversation.guestUser.email
                              : ""}
                          </span>
                          <Badge
                            variant={conversation.status === "open" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {conversation.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Messages View */}
          <div className="md:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle>
                  {selectedConversation ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <span>
                          {selectedConversation.user
                            ? `${selectedConversation.user.firstName} ${selectedConversation.user.lastName}`
                            : selectedConversation.guestUser
                            ? selectedConversation.guestUser.name
                            : "Unknown User"}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.subject || "No subject"}
                        </p>
                      </div>
                      <Badge
                        variant={selectedConversation.status === "open" ? "default" : "secondary"}
                      >
                        {selectedConversation.status}
                      </Badge>
                    </div>
                  ) : (
                    "Select a conversation"
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-auto pb-4">
                {selectedConversation ? (
                  messagesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : messagesError ? (
                    <div className="text-center py-4 text-destructive">
                      Failed to load messages
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No messages in this conversation</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        // Support both message.type and message.senderType (API inconsistency)
                        const isAdmin = message.senderType === "admin" || message.type === "admin";
                        
                        // Debug what fields are available
                        console.log("Message fields:", Object.keys(message), message);
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[75%] p-3 rounded-lg ${
                                isAdmin
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              {/* Support different field names for message content */}
                              <p className="text-sm">{message.content || message.body || "N/A"}</p>
                              <p className="text-xs mt-1 text-right">
                                {formatDate(message.createdAt || message.sentAt || new Date().toISOString())}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <MessagesSquare className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-xl font-medium">Select a conversation</p>
                    <p className="text-muted-foreground">
                      Choose a conversation from the list to view messages
                    </p>
                  </div>
                )}
              </CardContent>
              {selectedConversation && selectedConversation.status === "open" && (
                <div className="p-3 border-t">
                  <div className="flex space-x-2">
                    <div className="flex flex-col w-full">
                      {/* Typing indicator */}
                      {selectedConversation && remoteTypingUsers[selectedConversation.id.toString()] && (
                        <div className="text-xs text-muted-foreground animate-pulse mb-1 ml-2">
                          {selectedConversation.user 
                            ? `${selectedConversation.user.firstName} is typing...` 
                            : selectedConversation.guestUser 
                              ? `${selectedConversation.guestUser.name} is typing...` 
                              : "Someone is typing..."}
                        </div>
                      )}
                      <Textarea
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => {
                          setMessageInput(e.target.value);
                          handleTyping();
                        }}
                        className="min-h-[80px]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <Button
                      className="self-end"
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || sendMessageMutation.isPending}
                    >
                      {sendMessageMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}