import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const pcGames = [
  'CS:GO', 'Dota 2', 'Valorant', 'League of Legends', 'Minecraft', 
  'World of Warcraft', 'Overwatch 2', 'Apex Legends', 'PUBG', 
  'Rust', 'GTA V', 'Dead by Daylight', 'Rainbow Six Siege',
  'Warframe', 'Path of Exile', 'Lost Ark', 'Escape from Tarkov'
];

const mobileGames = [
  'PUBG Mobile', 'Call of Duty Mobile', 'Fortnite', 'Genshin Impact',
  'Mobile Legends', 'Clash of Clans', 'Clash Royale', 'Brawl Stars',
  'Free Fire', 'Among Us', 'Standoff 2', 'Pokemon GO'
];

const games = [...pcGames, ...mobileGames];

const itemTypes = ['Скин', 'Аккаунт', 'Валюта', 'Предмет', 'Услуга', 'Прочее'];

const gameCategories: Record<string, string[]> = {
  'CS:GO': ['Оружие', 'Ножи', 'Перчатки', 'Наклейки', 'Кейсы', 'Аккаунты'],
  'Dota 2': ['Герои', 'Курьеры', 'Варды', 'Сеты', 'Аркана', 'Аккаунты'],
  'Valorant': ['Оружие', 'Ножи', 'Баддики', 'Банеры', 'Спреи', 'Аккаунты'],
  'Fortnite': ['Скины', 'Пикаксы', 'Планеры', 'Эмоции', 'Аккаунты'],
  'PUBG': ['Одежда', 'Оружие', 'Транспорт', 'Аккаунты'],
  'PUBG Mobile': ['Одежда', 'Оружие', 'UC', 'Аккаунты'],
  'Apex Legends': ['Скины легенд', 'Оружие', 'Баннеры', 'Аккаунты'],
  'League of Legends': ['Чемпионы', 'Скины', 'Варды', 'Аккаунты'],
  'Minecraft': ['Аккаунты', 'Предметы', 'Сервера', 'Плагины'],
  'Mobile Legends': ['Скины', 'Герои', 'Diamonds', 'Аккаунты'],
  'Genshin Impact': ['Персонажи', 'Оружие', 'Кристаллы', 'Аккаунты'],
  'Call of Duty Mobile': ['Скины', 'Оружие', 'CP', 'Аккаунты'],
  'Free Fire': ['Скины', 'Оружие', 'Diamonds', 'Аккаунты']
};

export default function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    game: '',
    itemType: '',
    category: '',
    isPremium: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.game || !formData.itemType || !formData.category) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    toast.success('Товар выставлен на продажу!');
    setTimeout(() => navigate('/profile'), 1500);
  };

  const categories = formData.game ? gameCategories[formData.game] || [] : [];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Создать объявление</h1>
          <p className="text-muted-foreground">Выставьте свой товар на продажу</p>
        </div>

        <Card className="glass-effect p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">
                Название товара <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Например: AWP Dragon Lore FN"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="game" className="text-base">
                  Игра <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.game} onValueChange={(val) => setFormData({...formData, game: val, category: ''})}>
                  <SelectTrigger id="game">
                    <SelectValue placeholder="Выберите игру" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      Компьютерные игры
                    </div>
                    {pcGames.map(game => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground mt-2 border-t">
                      Мобильные игры
                    </div>
                    {mobileGames.map(game => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemType" className="text-base">
                  Тип товара <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.itemType} onValueChange={(val) => setFormData({...formData, itemType: val})}>
                  <SelectTrigger id="itemType">
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-base">
                Категория <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(val) => setFormData({...formData, category: val})}
                disabled={!formData.game}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={formData.game ? "Выберите категорию" : "Сначала выберите игру"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-base">
                Цена <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="text-base pr-12"
                  min="1"
                  step="0.01"
                />
                <span className="absolute right-3 top-3 text-muted-foreground">₽</span>
              </div>
              {formData.price && (
                <p className="text-sm text-muted-foreground">
                  Вы получите: <span className="text-accent font-semibold">
                    {(parseFloat(formData.price) * 0.88).toFixed(2)} ₽
                  </span> (комиссия 12%)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">Описание</Label>
              <Textarea
                id="description"
                placeholder="Опишите ваш товар подробнее..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={5}
                className="resize-none"
              />
            </div>

            <Card className="glass-effect p-4 border-primary/50">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Icon name="Crown" size={24} className="text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Premium размещение</h3>
                    <p className="text-sm text-muted-foreground">
                      25₽/месяц — товар всегда в топе поиска
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => setFormData({...formData, isPremium: checked})}
                />
              </div>
            </Card>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                size="lg" 
                className="flex-1 hover-glow"
              >
                <Icon name="CheckCircle" size={20} className="mr-2" />
                Выставить товар
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/profile')}
              >
                <Icon name="X" size={20} className="mr-2" />
                Отмена
              </Button>
            </div>
          </form>
        </Card>

        <Card className="glass-effect p-4 mt-6 border-accent/50">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-accent mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">После создания объявления покупатели смогут связаться с вами через встроенный чат.</p>
              <p>Комиссия GAMEESIP составляет 12% от суммы продажи.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}