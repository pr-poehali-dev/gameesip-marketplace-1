import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: 'Shield',
    title: 'Безопасные сделки',
    description: 'Система защиты покупателей и продавцов'
  },
  {
    icon: 'Zap',
    title: 'Мгновенная доставка',
    description: 'Получайте товары сразу после оплаты'
  },
  {
    icon: 'MessageCircle',
    title: 'Чат с продавцом',
    description: 'Общайтесь напрямую при каждой сделке'
  },
  {
    icon: 'TrendingUp',
    title: 'Premium подписка',
    description: 'Поднимайте товары в топ за 25₽/мес'
  }
];

const games = [
  { name: 'CS:GO', icon: '🎯' },
  { name: 'Dota 2', icon: '⚔️' },
  { name: 'Valorant', icon: '🎮' },
  { name: 'Fortnite', icon: '🏆' },
  { name: 'PUBG', icon: '🔫' },
  { name: 'Apex Legends', icon: '🎪' }
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge className="mb-6 text-sm px-4 py-2 hover-glow">
            <Icon name="Sparkles" size={16} className="mr-2" />
            Премиальный маркетплейс игровых товаров
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">GAMEESIP</span>
            <br />
            <span className="text-foreground">Ваш игровой маркет</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Покупайте и продавайте игровые товары безопасно. 
            Комиссия всего 12% с продаж.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="text-lg px-8 hover-glow">
                <Icon name="ShoppingBag" size={20} className="mr-2" />
                Перейти к покупкам
              </Button>
            </Link>
            <Link to="/profile">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Icon name="Plus" size={20} className="mr-2" />
                Продать товар
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Популярные игры</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {games.map(game => (
              <Card key={game.name} className="glass-effect p-6 text-center hover-glow cursor-pointer transition-all hover:scale-105">
                <div className="text-4xl mb-3">{game.icon}</div>
                <p className="font-semibold">{game.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Почему выбирают нас</h2>
          <p className="text-center text-muted-foreground mb-12">
            Лучший сервис для торговли игровыми товарами
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(feature => (
              <Card key={feature.title} className="glass-effect p-6 hover-glow transition-all hover:scale-105">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                  <Icon name={feature.icon as any} size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass-effect p-12 hover-glow">
            <Icon name="Crown" size={48} className="mx-auto mb-6 text-accent" />
            <h2 className="text-3xl font-bold mb-4">Premium подписка</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Всего <span className="text-accent font-bold">25₽/месяц</span> — и ваши товары в топе результатов
            </p>
            <Link to="/profile">
              <Button size="lg" className="hover-glow">
                <Icon name="Sparkles" size={20} className="mr-2" />
                Оформить подписку
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
