import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

export default function Profile() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="glass-effect p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                П
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Пользователь #12345</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">
                  <Icon name="Star" size={14} className="mr-1" />
                  Рейтинг: 4.9
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Icon name="ShoppingBag" size={14} className="mr-1" />
                  156 продаж
                </Badge>
              </div>
              
              <div className="glass-effect rounded-lg p-4 inline-block">
                <div className="flex items-center gap-3">
                  <Icon name="Wallet" size={24} className="text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Баланс</p>
                    <p className="text-2xl font-bold gradient-text">0.00 ₽</p>
                  </div>
                  <Button size="sm" className="ml-4 hover-glow">
                    <Icon name="Plus" size={16} className="mr-1" />
                    Пополнить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="glass-effect">
            <TabsTrigger value="items">
              <Icon name="Package" size={18} className="mr-2" />
              Мои товары
            </TabsTrigger>
            <TabsTrigger value="purchases">
              <Icon name="ShoppingCart" size={18} className="mr-2" />
              Покупки
            </TabsTrigger>
            <TabsTrigger value="sales">
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Продажи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <Card className="glass-effect p-8 text-center">
              <Icon name="Package" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Нет выставленных товаров</h3>
              <p className="text-muted-foreground mb-6">
                Начните продавать игровые предметы
              </p>
              <Link to="/create-listing">
                <Button className="hover-glow">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить товар
                </Button>
              </Link>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <Card className="glass-effect p-8 text-center">
              <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Нет покупок</h3>
              <p className="text-muted-foreground">
                Ваши покупки появятся здесь
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card className="glass-effect p-8 text-center">
              <Icon name="TrendingUp" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Нет продаж</h3>
              <p className="text-muted-foreground">
                История ваших продаж появится здесь
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}