import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { mockMessages } from '../../data/mockData';

export const BuyerMessages: React.FC = () => {
  const [activeThread, setActiveThread] = useState('shop-1');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const threads = [
    { id: 'shop-1', name: 'Мастерская Ольги', lastMessage: 'Добрый день! Отправлю в пятницу...', time: '14:32', unread: 0 },
    { id: 'shop-5', name: 'ЭкоБьюти', lastMessage: 'Ваш заказ отправлен!', time: 'Вчера', unread: 1 },
  ];

  const threadMessages = messages.filter(m => m.fromId === activeThread || m.toId === activeThread);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      id: `msg-${Date.now()}`, fromId: 'buyer-1', fromName: 'Иван П.',
      toId: activeThread, text: newMessage, createdAt: new Date().toISOString(), isRead: false,
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Сообщения</h2>
      <div className="grid md:grid-cols-3 gap-4 h-[500px]">
        {/* Threads */}
        <div className="md:col-span-1 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-semibold text-gray-700 text-sm">Диалоги</div>
          <div>
            {threads.map(thread => (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread.id)}
                className={`w-full flex items-center gap-3 p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${activeThread === thread.id ? 'bg-amber-50' : ''}`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {thread.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900 truncate">{thread.name}</span>
                    <span className="text-xs text-gray-400">{thread.time}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{thread.lastMessage}</div>
                </div>
                {thread.unread > 0 && (
                  <span className="w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">{thread.unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="font-semibold text-gray-900 text-sm">{threads.find(t => t.id === activeThread)?.name}</div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {threadMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">Нет сообщений</div>
            ) : (
              threadMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.fromId === 'buyer-1' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${msg.fromId === 'buyer-1' ? 'bg-amber-500 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'}`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.fromId === 'buyer-1' ? 'text-amber-100' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-2">
            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Написать сообщение..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button type="submit" className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
