import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const games = ['CS:GO', 'Dota 2', 'Valorant', 'Fortnite', 'PUBG', 'Apex Legends'];
const categories = ['Скины', 'Аккаунты', 'Валюта', 'Предметы', 'Услуги'];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Маркетплейс</h1>
          <p className="text-muted-foreground">Найдите лучшие предложения игровых товаров</p>
        </div>

        <div className="glass-effect rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <Input
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger>
                <SelectValue placeholder="Игра" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все игры</SelectItem>
                {games.map(game => (
                  <SelectItem key={game} value={game}>{game}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-center py-20">
          <Icon name="ShoppingBag" size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-semibold mb-2">Товары появятся здесь</h3>
          <p className="text-muted-foreground mb-6">
            Пользователи начнут выставлять товары на продажу
          </p>
          <Button size="lg" className="hover-glow">
            <Icon name="Plus" className="mr-2" size={20} />
            Выставить первый товар
          </Button>
        </div>
      </div>
    </div>
  );
}
