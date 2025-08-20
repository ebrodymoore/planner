'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Loader2,
  X,
  AlertCircle,
  Clock,
  Zap,
  Minimize2,
  Maximize2
} from 'lucide-react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  messageId?: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'quick' | 'comprehensive' | 'none';
}

export default function ChatBot({ isOpen, onClose, planType }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useUser();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: `Hello! I'm your AI financial planning assistant. I can help you with questions about your investments, retirement planning, debt strategies, tax optimization, and more. What would you like to discuss today?`,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
          conversationHistory: messages.slice(-8), // Send last 8 messages for context
          context: {
            planType,
            timestamp: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to send message');
      }

      const chatResponse = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: chatResponse.message,
        timestamp: new Date().toISOString(),
        messageId: chatResponse.messageId
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update session ID and rate limit info
      if (chatResponse.sessionId) {
        setSessionId(chatResponse.sessionId);
      }
      if (chatResponse.rateLimitInfo) {
        setRateLimitInfo(chatResponse.rateLimitInfo);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your message. Please try again or contact support if the issue persists.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    setRateLimitInfo(null);
    
    // Re-add welcome message
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: `Hello! I'm your AI financial planning assistant. I can help you with questions about your investments, retirement planning, debt strategies, tax optimization, and more. What would you like to discuss today?`,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-b border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg border border-emerald-500/30">
                <Bot className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-gray-800">
                  Financial Assistant
                </CardTitle>
                {!isMinimized && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Powered by Claude AI
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {!isMinimized && rateLimitInfo && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {rateLimitInfo.remaining} left
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 h-auto"
              >
                {isMinimized ? (
                  <Maximize2 className="w-3 h-3" />
                ) : (
                  <Minimize2 className="w-3 h-3" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1.5 h-auto text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="p-4 h-[440px] overflow-y-auto space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-emerald-500" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : ''}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                          : 'bg-gray-100/80 text-gray-800 border border-gray-200/50'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 order-3">
                      <User className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="bg-gray-100/80 border border-gray-200/50 rounded-lg p-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t border-gray-200/30 bg-gray-50/50">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your financial plan..."
                  className="flex-1 border-gray-300/50 focus:border-emerald-500/50 focus:ring-emerald-500/20 bg-white/80"
                  disabled={isLoading}
                  maxLength={500}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-0"
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {inputMessage.length > 400 && (
                <p className="text-xs text-gray-500 mt-1">
                  {500 - inputMessage.length} characters remaining
                </p>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}