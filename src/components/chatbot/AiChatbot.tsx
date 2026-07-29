import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { ChatMessage } from '../../types';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  User,
  Sparkles,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export const AiChatbot: React.FC = () => {
  const { t, language } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: language === 'hi'
        ? 'नमस्ते! मैं कृषि मित्र AI हूँ। आप मुझसे फसल, खाद, रोग, मौसम या सरकारी योजनाओं के बारे में हिंदी, मराठी या अंग्रेजी में पूछ सकते हैं।'
        : language === 'mr'
        ? 'नमस्कार! मी कृषी मित्र AI आहे. आपण मला पिके, खते, रोग, हवामान किंवा शासकीय योजनांबद्दल विचारू शकता.'
        : 'Namaste! I am Krishi Mitra AI. Ask me anything about crops, fertilizers, pest management, weather, or government schemes 24/7.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'How to control Tomato Early Blight?',
        'Wheat fertilizer schedule per acre',
        'PM-Kisan scheme eligibility'
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(query, messages, language);
      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.suggestedActions
      };
      setMessages((prev) => [...prev, botMsg]);

      // Automatically speak out the response if browser speech synthesis is supported
      speakText(res.reply);
    } catch (err) {
      console.error('Chatbot error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech Recognition for Voice Input
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  // Web Speech Synthesis for Voice Output
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-h-[700px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="bg-emerald-900 text-white p-3.5 flex items-center justify-between border-b border-emerald-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>{t('chatbot')}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </h3>
            <p className="text-[11px] text-emerald-200/80 font-light">
              Voice & Text AI Agronomist (24/7 Active)
            </p>
          </div>
        </div>

        {isSpeaking && (
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              setIsSpeaking(false);
            }}
            className="flex items-center gap-1 text-xs bg-emerald-800 hover:bg-emerald-700 text-emerald-200 px-2.5 py-1 rounded-lg border border-emerald-600"
          >
            <VolumeX className="w-3.5 h-3.5 text-amber-400" />
            <span>Mute AI</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-end gap-2 max-w-[88%] sm:max-w-[80%]">
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs shrink-0 mb-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="hover:text-emerald-700 flex items-center gap-0.5"
                      title="Listen response"
                    >
                      <Volume2 className="w-3 h-3 text-emerald-600" />
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 mb-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Action Chips */}
            {msg.suggestedActions && (
              <div className="flex flex-wrap gap-1.5 mt-2 ml-9">
                {msg.suggestedActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action)}
                    className="text-[11px] bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 font-medium px-2.5 py-1 rounded-full shadow-2xs transition-all"
                  >
                    💡 {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 p-3 rounded-2xl w-fit">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Krishi Mitra is composing response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 space-y-2">
        <div className="flex items-center gap-2">
          {/* Voice Input Mic Button */}
          <button
            id="mic-voice-input-btn"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-600 text-white border-rose-700 animate-bounce'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Speech Voice Input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            id="chatbot-text-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('askQuestion')}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />

          {/* Send Button */}
          <button
            id="chatbot-send-btn"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || loading}
            className={`p-2.5 rounded-xl font-bold text-white transition-all shadow-sm ${
              inputText.trim() && !loading
                ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[10px] text-slate-400 text-center font-light">
          {t('voicePrompt')}
        </p>
      </div>
    </div>
  );
};
