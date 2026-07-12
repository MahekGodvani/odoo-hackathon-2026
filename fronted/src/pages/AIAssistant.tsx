// src/pages/AIAssistant.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';

interface Message {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

const suggestedQueries = [
  'How many assets do we have?',
  'What is the system health status?',
  'Are there any pending repair tickets?',
];

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am your AssetFlow AI Assistant. How can I help you manage your enterprise assets today? You can ask me about registered assets, pending repair tickets, or general system health.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setTyping(true);

    try {
      const res = await api.post<{ reply: string }>('/ai/chat', { message: textToSend });
      const assistantMessage: Message = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: res.reply || "I am sorry, I couldn't process that query.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: "Sorry, I am having trouble connecting to the analytics engine right now. Please try again shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>AI Assistant</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Ask questions, get health check summaries, and fetch database statistics</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: 20, height: 'calc(100vh - 200px)' }}>
        {/* Chat window */}
        <Card padding="0" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Chat Header */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.colors.primaryLight, color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.Cpu />
            </div>
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text.primary }}>AssetFlow AI Agent</span>
              <div style={{ fontSize: 11, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}/> Online & Ready
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16, background: '#FAF9FB' }}>
            {messages.map(m => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '75%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: isUser ? theme.colors.primary : '#fff',
                    color: isUser ? '#fff' : theme.colors.text.primary,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
                    border: isUser ? 'none' : `1px solid ${theme.colors.borderLight}`
                  }}>
                    <div style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                      {m.text}
                    </div>
                    <div style={{ fontSize: 10, textAlign: 'right', marginTop: 4, color: isUser ? 'rgba(255, 255, 255, 0.7)' : theme.colors.text.light }}>
                      {m.time}
                    </div>
                  </div>
                </div>
              );
            })}
            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '12px 16px', borderRadius: 12, background: '#fff', border: `1px solid ${theme.colors.borderLight}`, color: theme.colors.text.muted, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icons.Clock /> AI Agent is compiling statistics...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input bar */}
          <form onSubmit={e => { e.preventDefault(); handleSend(inputMsg); }} style={{ padding: 16, borderTop: `1px solid ${theme.colors.borderLight}`, display: 'flex', gap: 10, background: '#fff' }}>
            <input
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              placeholder="Ask anything about registered assets or repairs..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, outline: 'none', fontSize: 14, fontFamily: theme.font }}
            />
            <Button variant="primary" type="submit" icon={<Icons.Send />} disabled={!inputMsg.trim() || typing}>
              Send
            </Button>
          </form>
        </Card>

        {/* Sidebar suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: theme.colors.text.primary }}>Suggested Queries</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {suggestedQueries.map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  style={{
                    textAlign: 'left',
                    background: '#fff',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: theme.colors.text.secondary,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                    e.currentTarget.style.color = theme.colors.primary;
                    e.currentTarget.style.background = theme.colors.primaryLight;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = theme.colors.border;
                    e.currentTarget.style.color = theme.colors.text.secondary;
                    e.currentTarget.style.background = '#fff';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: theme.colors.text.primary }}>Real-time Analytics</h3>
            <p style={{ fontSize: 12, color: theme.colors.text.muted, lineHeight: 1.5, margin: 0 }}>
              The AI assistant is securely integrated with your SQLite database to provide accurate, up-to-the-minute figures without exposing sensitive configuration records.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
