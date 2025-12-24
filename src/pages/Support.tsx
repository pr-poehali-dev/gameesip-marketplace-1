import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Как купить товар на маркетплейсе?',
    answer: 'Найдите нужный товар через поиск, нажмите "Купить", пополните баланс и подтвердите покупку. После оплаты откроется чат с продавцом.'
  },
  {
    question: 'Как вывести деньги?',
    answer: 'Перейдите в раздел "Баланс" и выберите "Вывести средства". Укомиссия при выводе составляет 5%.'
  },
  {
    question: 'Что делать если товар не пришёл?',
    answer: 'Обратитесь в поддержку через чат. Мы рассмотрим вашу жалобу и вернём деньги если продавец нарушил правила.'
  },
  {
    question: 'Как работает подписка Premium?',
    answer: 'За 25₽/месяц ваши товары показываются в топе результатов поиска, что увеличивает продажи.'
  }
];

export default function Support() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: 'Здравствуйте! Я ИИ-помощник GAMEESIP. Чем могу помочь?', isUser: false }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, { text: message, isUser: true }]);
    setMessage('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: 'Спасибо за обращение! Специалист поддержки скоро ответит вам.',
        isUser: false 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Поддержка</h1>
        <p className="text-muted-foreground mb-8">Мы всегда на связи</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-effect p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="MessageCircle" size={24} className="text-primary" />
              <h2 className="text-2xl font-bold">Чат с поддержкой</h2>
            </div>
            
            <ScrollArea className="h-[400px] mb-4 rounded-lg border border-border p-4">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.isUser ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={msg.isUser ? 'bg-primary' : 'bg-accent'}>
                        {msg.isUser ? 'П' : 'AI'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg p-3 max-w-[80%] ${
                      msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

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
          </Card>

          <Card className="glass-effect p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="HelpCircle" size={24} className="text-accent" />
              <h2 className="text-2xl font-bold">Часто задаваемые вопросы</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-6 p-4 glass-effect rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="Mail" size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-semibold mb-1">Нужна личная консультация?</p>
                  <p className="text-sm text-muted-foreground">support@gameesip.com</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
