import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ChatRoom {
  id: number;
  listing_title: string;
  buyer_name: string;
  seller_name: string;
  unread_count: number;
}

interface Message {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
  sender_name: string;
}

export default function Chat() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [rooms] = useState<ChatRoom[]>([
    {
      id: 1,
      listing_title: 'AWP Dragon Lore FN',
      buyer_name: 'Покупатель_123',
      seller_name: 'Продавец_456',
      unread_count: 2
    }
  ]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender_id: 1,
      message: 'Здравствуйте! Этот товар еще актуален?',
      created_at: new Date().toISOString(),
      sender_name: 'Покупатель_123'
    },
    {
      id: 2,
      sender_id: 2,
      message: 'Да, товар в наличии. Могу передать прямо сейчас.',
      created_at: new Date().toISOString(),
      sender_name: 'Продавец_456'
    }
  ]);

  const currentUserId = 1;

  const sendMessage = () => {
    if (!message.trim() || !selectedRoom) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender_id: currentUserId,
      message: message,
      created_at: new Date().toISOString(),
      sender_name: 'Вы'
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Чаты</h1>
          <p className="text-muted-foreground">Общайтесь с покупателями и продавцами</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass-effect p-4 lg:col-span-1">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon name="MessageSquare" size={20} />
              Диалоги
            </h2>
            
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {rooms.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="MessageCircle" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Нет активных чатов</p>
                  </div>
                ) : (
                  rooms.map(room => (
                    <Card
                      key={room.id}
                      className={`p-4 cursor-pointer transition-all hover:bg-secondary/50 ${
                        selectedRoom === room.id ? 'bg-secondary border-primary' : ''
                      }`}
                      onClick={() => setSelectedRoom(room.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm">{room.listing_title}</h3>
                        {room.unread_count > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {room.unread_count}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon name="User" size={12} />
                        <span>{room.buyer_name}</span>
                        <Icon name="ArrowRight" size={12} />
                        <span>{room.seller_name}</span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>

          <Card className="glass-effect lg:col-span-2">
            {selectedRoom ? (
              <div className="flex flex-col h-[680px]">
                <div className="p-4 border-b border-border">
                  <h2 className="text-xl font-bold">
                    {rooms.find(r => r.id === selectedRoom)?.listing_title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Сделка между покупателем и продавцом
                  </p>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isCurrentUser = msg.sender_id === currentUserId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className={isCurrentUser ? 'bg-primary' : 'bg-accent'}>
                              {msg.sender_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex flex-col ${isCurrentUser ? 'items-end' : ''}`}>
                            <div
                              className={`rounded-lg p-3 max-w-md ${
                                isCurrentUser
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary'
                              }`}
                            >
                              <p className="text-sm">{msg.message}</p>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">
                              {new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Напишите сообщение..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} className="hover-glow">
                      <Icon name="Send" size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[680px] text-center">
                <div>
                  <Icon name="MessageCircle" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Выберите чат</h3>
                  <p className="text-muted-foreground">
                    Выберите диалог слева для начала общения
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
