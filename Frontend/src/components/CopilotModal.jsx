import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  User,
  ShieldCheck,
  BrainCircuit,
  Bot,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  HelpCircle,
  Leaf
} from 'lucide-react';

export default function CopilotModal({ currentRole = 'PI', activeStudy = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Message Thread State
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Namaste! I am the **AyuDrishti Intelligence Copilot**.\n\nI can assist you with Ayush-GCP compliance, protocol lifecycle tracking, CTRI filings, adverse event triage, or trial risk analysis. What can I help you investigate today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Role-Specific Quick Prompts
  const quickPrompts = [
    { label: '🔍 Predict Trial Delays', query: 'Analyze risk factors and predicted completion dates across my active protocols.' },
    { label: '📋 Check IEC Renewal Status', query: 'Which ethics approvals require renewal within the next 45 days?' },
    { label: '⚠️ Summarize Open SAEs', query: 'Provide a breakdown of serious adverse events needing NPvCC or PI sign-off.' },
    { label: '📑 Draft CTRI Re-filing Notes', query: 'Generate standard re-filing notes for a Phase II Ayush protocol amendment.' }
  ];

  // AI Response Generator Simulation
  const handleSendMessage = (textToSend) => {
    const queryText = textToSend || inputQuery;
    if (!queryText.trim()) return;

    // 1. Add User Message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // 2. Simulate AI Processing & Response
    setTimeout(() => {
      let aiResponseText = `I have analyzed the registry database for your request regarding: **"${queryText}"**.\n\n`;

      const lowerQ = queryText.toLowerCase();

      if (lowerQ.includes('delay') || lowerQ.includes('predict')) {
        aiResponseText += `**AI Delay Prediction Analysis:**\n• **AIIA-AYU-002 (Goa Site):** 14-day predicted lag due to pending IEC renewal.\n• **AIIA-AYU-001 (Delhi Site):** Performing **+18% above trend** with target completion Q2 2027.\n\n*Recommendation:* Re-allocate 1 study coordinator to Goa unit to clear enrollment backlog.`;
      } else if (lowerQ.includes('iec') || lowerQ.includes('renewal')) {
        aiResponseText += `**Ethics & Regulatory Approvals:**\n• **AIIA-AYU-008:** Expiry in **18 days** (Oct 15, 2026). Renewal dossier is awaiting PI sign-off.\n• **AIIA-AYU-003:** Valid until Jan 2027.\n\n*Action:* Drafted renewal cover letter ready in your Ethics Workspace.`;
      } else if (lowerQ.includes('sae') || lowerQ.includes('adverse') || lowerQ.includes('safety')) {
        aiResponseText += `**Safety & NPvCC Alerts:**\n• **3 Expedited SAE Reports** logged on protocol \`AIIA-AYU-004\`.\n• Causality verification is pending DSMB and PI sign-off.\n\n*Regulatory Window:* 7-day expedited reporting deadline active.`;
      } else {
        aiResponseText += `Based on standard **Ayush-GCP guidelines (2026 Edition)** and Indian CDSCO clinical trial protocols:\n\n1. Ensure all subject consent forms are updated with the latest ICF Version 2.1.\n2. Maintain real-time source data verification (SDV) in your eCRF workspace.\n3. All protocol amendments must receive prior IEC clearance before site rollout.`;
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <>
      <style>{`
        @keyframes copilotSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes subtlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .ayudrishti-fab-btn {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ayudrishti-fab-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px -2px rgba(45, 55, 72, 0.18), 0 3px 8px -1px rgba(45, 55, 72, 0.1) !important;
          border-color: #84A98C !important;
        }
        .copilot-window {
          animation: copilotSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .copilot-prompt-pill {
          transition: all 0.15s ease-in-out;
        }
        .copilot-prompt-pill:hover {
          background-color: #E2ECE9 !important;
          border-color: #84A98C !important;
          color: #2C4A3E !important;
        }
      `}</style>

      {/* REFINED FLOATING ACTION BUTTON (MATCHING AYUDRISHTI AESTHETICS) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="ayudrishti-fab-btn"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1500,
            background: '#FAF8F5',
            color: '#1A221E',
            border: '1.5px solid #D4A373',
            borderRadius: '9999px',
            padding: '7px 16px 7px 9px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 6px 20px -2px rgba(45, 55, 72, 0.12), 0 2px 6px -1px rgba(45, 55, 72, 0.08)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <div
            style={{
              background: '#84A98C',
              color: '#FAF8F5',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(132, 169, 140, 0.35)',
              flexShrink: 0
            }}
          >
            <Sparkles size={16} />
          </div>

          <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1A221E', letterSpacing: '0.01em' }}>
              AyuDrishti Copilot
            </div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#5A6A70', marginTop: '1px' }}>
              AI Clinical Assistant
            </div>
          </div>

          <span
            style={{
              background: '#E2ECE9',
              color: '#2C4A3E',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '12px',
              border: '1px solid #84A98C',
              letterSpacing: '0.04em',
              marginLeft: '2px'
            }}
          >
            AI
          </span>
        </button>
      )}

      {/* CHAT DRAWER MODAL (MATCHING APP CARD STYLES) */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: 'calc(100vw - 32px)',
            maxWidth: '430px',
            height: '600px',
            maxHeight: 'calc(100vh - 48px)',
            zIndex: 2000,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <div
            className="copilot-window"
            style={{
              width: '100%',
              height: '100%',
              background: '#FAF8F5',
              border: '1.5px solid #D4A373',
              borderRadius: '16px',
              boxShadow: '0 16px 40px -8px rgba(45, 55, 72, 0.22), 0 0 0 1px rgba(212, 163, 115, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >

            {/* 1. HEADER (CREAM / LINEN AESTHETIC) */}
            <div
              style={{
                background: '#EFE8D8',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1.5px solid #D4A373'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    background: '#84A98C',
                    color: '#FAF8F5',
                    borderRadius: '10px',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(132, 169, 140, 0.3)'
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#1A221E', lineHeight: 1.2 }}>
                      AyuDrishti Copilot
                    </span>
                    <span
                      style={{
                        background: '#E2ECE9',
                        color: '#2C4A3E',
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        border: '1px solid #84A98C'
                      }}
                    >
                      Ayush-GCP AI
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#5A6A70', fontWeight: 500 }}>
                    Protocol Intelligence & Compliance Desk
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #D4A373',
                  color: '#5A6A70',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FAF8F5';
                  e.currentTarget.style.color = '#1A221E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#5A6A70';
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* 2. CHAT MESSAGES BODY */}
            <div
              style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
                background: '#F4F0EA',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        maxWidth: '90%',
                        flexDirection: isUser ? 'row-reverse' : 'row'
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: isUser ? '#84A98C' : '#FAF8F5',
                          color: isUser ? '#FAF8F5' : '#84A98C',
                          border: isUser ? 'none' : '1px solid #D4A373',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          flexShrink: 0,
                          marginTop: '2px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                      >
                        {isUser ? <User size={13} /> : <Sparkles size={13} />}
                      </div>

                      {/* Bubble */}
                      <div
                        style={{
                          background: isUser ? '#84A98C' : '#FAF8F5',
                          color: isUser ? '#FAF8F5' : '#1A221E',
                          border: isUser ? '1px solid #6B9080' : '1px solid #D4A373',
                          borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          padding: '10px 14px',
                          fontSize: '12px',
                          lineHeight: '1.5',
                          boxShadow: '0 2px 8px rgba(45, 55, 72, 0.04)',
                          whiteSpace: 'pre-line'
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '10px',
                        color: '#5A6A70',
                        marginTop: '3px',
                        padding: '0 6px',
                        fontWeight: 500
                      }}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#FAF8F5',
                      border: '1px solid #D4A373',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#84A98C'
                    }}
                  >
                    <Sparkles size={13} />
                  </div>
                  <div
                    style={{
                      background: '#FAF8F5',
                      border: '1px solid #D4A373',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#5A6A70',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>AyuDrishti is synthesizing data...</span>
                    <Sparkles size={12} color="#D48C46" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 3. QUICK PROMPT PILLS */}
            <div
              style={{
                padding: '8px 12px',
                background: '#EFE8D8',
                borderTop: '1px solid #D4A373',
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                scrollbarWidth: 'none'
              }}
            >
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(p.query)}
                  className="copilot-prompt-pill"
                  style={{
                    whiteSpace: 'nowrap',
                    background: '#FAF8F5',
                    border: '1px solid #D4A373',
                    padding: '5px 11px',
                    borderRadius: '14px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#1A221E',
                    cursor: 'pointer'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* 4. INPUT COMPOSER */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{
                padding: '12px 14px',
                background: '#FAF8F5',
                borderTop: '1.5px solid #D4A373',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}
            >
              <input
                type="text"
                placeholder="Ask about GCP, trial timelines, SAEs, or IEC renewals..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #D4A373',
                  background: '#EFE8D8',
                  color: '#1A221E',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                style={{
                  background: inputQuery.trim() ? '#84A98C' : '#EFE8D8',
                  color: inputQuery.trim() ? '#FAF8F5' : '#5A6A70',
                  border: inputQuery.trim() ? 'none' : '1px solid #D4A373',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  cursor: inputQuery.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <Send size={14} />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
