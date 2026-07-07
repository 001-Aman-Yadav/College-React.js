import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your Metropolitan University AI Assistant. Ask me anything about admissions, courses, placement statistics, hostel facilities, or library policies.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('admission') || q.includes('apply') || q.includes('register')) {
      return 'Admissions are currently open for the 2026 academic session! You can submit an online application under the "Admissions" tab of our landing website. Eligibility requires a minimum score of 50% in qualifying boards/graduation.';
    }
    if (q.includes('fee') || q.includes('cost') || q.includes('charge') || q.includes('price')) {
      return 'The tuition fee varies by course stream: \n- B.Tech Engineering: ₹1,50,000/year \n- MCA (Computer Science): ₹1,20,000/year \n- MBA (Management): ₹1,80,000/year \n- Commerce & Arts: ₹60,000/year. Installment schemes and up to 100% merit-based scholarships are available.';
    }
    if (q.includes('course') || q.includes('degree') || q.includes('branch') || q.includes('syllabus')) {
      return 'We offer premium undergraduate & postgraduate degrees across multiple streams:\n- Computer Science (MCA, B.Sc)\n- Management (MBA, BBA)\n- Commerce (M.Com, B.Com)\n- Arts & Humanities\n- Engineering & Technology. Check details in our "All Courses" section!';
    }
    if (q.includes('placement') || q.includes('job') || q.includes('recruiter') || q.includes('salary') || q.includes('package')) {
      return 'Our placement record is excellent! The highest package for the last batch touched ₹42 Lakhs Per Annum (LPA) with an average package of ₹8.5 LPA. Over 150 marquee recruiters visit our campus, including Google, Microsoft, Infosys, and Deloitte.';
    }
    if (q.includes('hostel') || q.includes('accommodation') || q.includes('room') || q.includes('dorm')) {
      return 'We provide separate hostels for boys and girls with full amenities: \n- Block A (Boys): Double & triple sharing with Wi-Fi & Gymnasium access. \n- Block B (Girls): Single AC & double sharing rooms with strict 24/7 security. Mess menu features highly hygienic vegetarian & non-vegetarian food options.';
    }
    if (q.includes('library') || q.includes('book')) {
      return 'Our digital Central Library tracks over 45,000 books and peer-reviewed journals. Students can rent up to 3 books at a time for 14 days directly using their Student Portal account.';
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return 'Hello there! How can I assist you with your Metropolitan University inquiries today?';
    }
    
    return 'I am trained on Metropolitan University information. You can ask me about: \n1. Admission Process \n2. Course & Fees details \n3. Placements Package record \n4. Hostel AC/Non-AC bookings \n5. Library rental limits.';
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response delay
    setTimeout(() => {
      const reply = getAIResponse(userMessage.text);
      const aiMessage = {
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 850);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl hover:bg-blue-500 hover:scale-105 transition transform duration-200 cursor-pointer border border-blue-400"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Console Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
          
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-500/50 p-1">
                <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight">University AI Advisor</h4>
                <p className="text-[10px] text-blue-200 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Active Portal Agent
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:scale-105 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 dark:bg-slate-955 scrollbar-thin scrollbar-thumb-slate-250 dark:scrollbar-thumb-slate-800">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-150 dark:border-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about admissions, fees, syllabus..."
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-xs focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 flex items-center justify-center shadow cursor-pointer transition active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default AIChatbot;
