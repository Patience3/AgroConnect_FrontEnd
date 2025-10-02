import { useState } from 'react';
import { Video, Phone, MessageSquare, Send, Paperclip, Clock, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { formatDate, formatRelativeTime } from '@/utils/helpers';
import clsx from 'clsx';

const VirtualConsultationPage = () => {
  const [activeChat, setActiveChat] = useState('1');
  const [message, setMessage] = useState('');
  
  const [consultations, setConsultations] = useState([
    {
      id: '1',
      farmer_name: 'John Kwame',
      farm_name: 'Green Valley Farm',
      avatar: null,
      last_message: 'Thank you for the advice on pest control',
      last_message_time: new Date(Date.now() - 3600000).toISOString(),
      unread_count: 2,
      status: 'online',
    },
    {
      id: '2',
      farmer_name: 'Mary Mensah',
      farm_name: 'Organic Harvest',
      avatar: null,
      last_message: 'Can you review my organic certification documents?',
      last_message_time: new Date(Date.now() - 7200000).toISOString(),
      unread_count: 0,
      status: 'offline',
    },
    {
      id: '3',
      farmer_name: 'David Osei',
      farm_name: 'Fresh Fields',
      avatar: null,
      last_message: 'The irrigation system is working perfectly now',
      last_message_time: new Date(Date.now() - 86400000).toISOString(),
      unread_count: 5,
      status: 'online',
    },
  ]);

  const [messages, setMessages] = useState({
    '1': [
      {
        id: '1',
        sender: 'farmer',
        content: 'Hello, I need advice on pest control for my tomato crops',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: '2',
        sender: 'officer',
        content: 'Hello John! I can help with that. What specific pests are you dealing with?',
        timestamp: new Date(Date.now() - 7000000).toISOString(),
      },
      {
        id: '3',
        sender: 'farmer',
        content: 'I\'m seeing whiteflies and some leaf damage',
        timestamp: new Date(Date.now() - 6800000).toISOString(),
      },
      {
        id: '4',
        sender: 'officer',
        content: 'For whiteflies, I recommend using neem oil spray. Apply early morning or late evening. I can also schedule a physical visit if needed.',
        timestamp: new Date(Date.now() - 6600000).toISOString(),
      },
      {
        id: '5',
        sender: 'farmer',
        content: 'Thank you for the advice on pest control',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  });

  const activeConsultation = consultations.find(c => c.id === activeChat);
  const chatMessages = messages[activeChat] || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'officer',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages({
      ...messages,
      [activeChat]: [...chatMessages, newMessage],
    });

    setConsultations(consultations.map(c =>
      c.id === activeChat
        ? { ...c, last_message: message, last_message_time: new Date().toISOString() }
        : c
    ));

    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Virtual Consultation</h1>
        <p className="text-neutral-400">Provide remote support to farmers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        {/* Consultations List */}
        <Card padding="none" className="lg:col-span-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-neutral-800">
            <h2 className="font-semibold text-lg">Consultations</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {consultations.map((consultation) => (
              <button
                key={consultation.id}
                onClick={() => setActiveChat(consultation.id)}
                className={clsx(
                  'w-full p-4 border-b border-neutral-800 hover:bg-neutral-900 transition-colors text-left',
                  activeChat === consultation.id && 'bg-neutral-900'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-accent-teal/20 flex items-center justify-center flex-shrink-0">
                      <User size={24} className="text-accent-cyan" />
                    </div>
                    {consultation.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-primary-light" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold truncate">{consultation.farmer_name}</h3>
                      {consultation.unread_count > 0 && (
                        <span className="badge-error text-xs px-2 py-0.5">
                          {consultation.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mb-1">{consultation.farm_name}</p>
                    <p className="text-sm text-neutral-400 truncate">
                      {consultation.last_message}
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      {formatRelativeTime(consultation.last_message_time)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Chat Area */}
        <Card padding="none" className="lg:col-span-2 overflow-hidden flex flex-col">
          {activeConsultation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-accent-teal/20 flex items-center justify-center">
                      <User size={20} className="text-accent-cyan" />
                    </div>
                    {activeConsultation.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-primary-light" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{activeConsultation.farmer_name}</h3>
                    <p className="text-xs text-neutral-500">{activeConsultation.farm_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" icon={Phone}>
                    Call
                  </Button>
                  <Button size="sm" variant="ghost" icon={Video}>
                    Video
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={clsx(
                      'flex',
                      msg.sender === 'officer' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={clsx(
                        'max-w-[70%] rounded-lg p-3',
                        msg.sender === 'officer'
                          ? 'bg-accent-teal text-primary-dark'
                          : 'bg-primary-dark text-neutral-100'
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={clsx(
                          'text-xs mt-1',
                          msg.sender === 'officer' ? 'text-primary-dark/70' : 'text-neutral-500'
                        )}
                      >
                        {formatDate(msg.timestamp, 'p')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-neutral-800 flex items-end gap-2"
              >
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-accent-cyan transition-colors"
                >
                  <Paperclip size={20} />
                </button>
                
                <textarea
                  rows="1"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  className="input flex-1 resize-none"
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                />

                <Button
                  type="submit"
                  size="sm"
                  icon={Send}
                  disabled={!message.trim()}
                >
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto mb-4 text-neutral-700" />
                <p>Select a consultation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover className="text-center cursor-pointer">
          <Phone className="text-accent-cyan mb-3 mx-auto" size={32} />
          <h3 className="font-semibold mb-1">Voice Call</h3>
          <p className="text-sm text-neutral-400">Start audio consultation</p>
        </Card>
        
        <Card hover className="text-center cursor-pointer">
          <Video className="text-accent-teal mb-3 mx-auto" size={32} />
          <h3 className="font-semibold mb-1">Video Call</h3>
          <p className="text-sm text-neutral-400">Start video consultation</p>
        </Card>
        
        <Card hover className="text-center cursor-pointer">
          <Clock className="text-success mb-3 mx-auto" size={32} />
          <h3 className="font-semibold mb-1">Schedule Session</h3>
          <p className="text-sm text-neutral-400">Plan future consultation</p>
        </Card>
      </div>
    </div>
  );
};

export default VirtualConsultationPage;