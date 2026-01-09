import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
}

const mockProducts: Product[] = [
  { id: 1, name: 'Беспроводные наушники', price: 4990, category: 'Электроника', image: '/placeholder.svg', rating: 4.8, reviews: 234, seller: 'TechStore' },
  { id: 2, name: 'Умные часы', price: 8990, category: 'Электроника', image: '/placeholder.svg', rating: 4.6, reviews: 189, seller: 'GadgetPro' },
  { id: 3, name: 'Кожаная сумка', price: 6490, category: 'Аксессуары', image: '/placeholder.svg', rating: 4.9, reviews: 145, seller: 'FashionHub' },
  { id: 4, name: 'Настольная лампа', price: 2990, category: 'Дом', image: '/placeholder.svg', rating: 4.7, reviews: 312, seller: 'HomeStyle' },
  { id: 5, name: 'Спортивная бутылка', price: 890, category: 'Спорт', image: '/placeholder.svg', rating: 4.5, reviews: 567, seller: 'SportLife' },
  { id: 6, name: 'Книга "Мастер и Маргарита"', price: 590, category: 'Книги', image: '/placeholder.svg', rating: 5.0, reviews: 892, seller: 'BookWorld' },
];

const mockReviews: Review[] = [
  { id: 1, author: 'Алексей М.', rating: 5, text: 'Отличный товар! Быстрая доставка и качественная упаковка.', date: '15 дек 2024' },
  { id: 2, author: 'Мария К.', rating: 4, text: 'Хорошее качество, но цена немного завышена.', date: '10 дек 2024' },
  { id: 3, author: 'Дмитрий П.', rating: 5, text: 'Превзошло ожидания! Рекомендую всем.', date: '5 дек 2024' },
];

const categories = [
  { name: 'Электроника', icon: 'Smartphone', color: 'bg-purple-500' },
  { name: 'Одежда', icon: 'Shirt', color: 'bg-blue-500' },
  { name: 'Дом', icon: 'Home', color: 'bg-orange-500' },
  { name: 'Спорт', icon: 'Dumbbell', color: 'bg-green-500' },
  { name: 'Книги', icon: 'Book', color: 'bg-pink-500' },
  { name: 'Красота', icon: 'Sparkles', color: 'bg-yellow-500' },
];

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'product' | 'profile' | 'reviews' | 'seller-register' | 'seller-dashboard'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addSellerProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now() };
    setSellerProducts(prev => [...prev, newProduct]);
    setEditingProduct(null);
  };

  const updateSellerProduct = (product: Product) => {
    setSellerProducts(prev => prev.map(p => p.id === product.id ? product : p));
    setEditingProduct(null);
  };

  const deleteSellerProduct = (productId: number) => {
    setSellerProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-2 rounded-xl">
                <Icon name="ShoppingBag" size={28} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                MarketHub
              </span>
            </div>
            
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-6 rounded-xl border-2 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setCurrentPage('profile')} className="relative">
                <Icon name="User" size={24} />
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Icon name="ShoppingCart" size={24} />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-orange-500">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle className="text-2xl">Корзина</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <Icon name="ShoppingCart" size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Корзина пуста</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                          {cart.map(item => (
                            <Card key={item.id} className="overflow-hidden">
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                                  <div className="flex-1">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-600">{item.price.toLocaleString()} ₽</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Button 
                                        size="icon" 
                                        variant="outline" 
                                        className="h-8 w-8"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      >
                                        <Icon name="Minus" size={16} />
                                      </Button>
                                      <span className="w-8 text-center">{item.quantity}</span>
                                      <Button 
                                        size="icon" 
                                        variant="outline" 
                                        className="h-8 w-8"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      >
                                        <Icon name="Plus" size={16} />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 ml-auto text-red-500"
                                        onClick={() => removeFromCart(item.id)}
                                      >
                                        <Icon name="Trash2" size={16} />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex justify-between text-lg font-semibold mb-4">
                            <span>Итого:</span>
                            <span>{cartTotal.toLocaleString()} ₽</span>
                          </div>
                          <Button className="w-full py-6 text-lg" size="lg">
                            Оформить заказ
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <nav className="flex gap-2 mt-4 items-center">
            <Button 
              variant={currentPage === 'home' ? 'default' : 'ghost'} 
              onClick={() => setCurrentPage('home')}
              className="gap-2"
            >
              <Icon name="Home" size={18} />
              Главная
            </Button>
            <Button 
              variant={currentPage === 'catalog' ? 'default' : 'ghost'} 
              onClick={() => setCurrentPage('catalog')}
              className="gap-2"
            >
              <Icon name="Grid3x3" size={18} />
              Каталог
            </Button>
            <Button 
              variant={currentPage === 'reviews' ? 'default' : 'ghost'} 
              onClick={() => setCurrentPage('reviews')}
              className="gap-2"
            >
              <Icon name="Star" size={18} />
              Отзывы
            </Button>
            {isSeller ? (
              <Button 
                variant={currentPage === 'seller-dashboard' ? 'default' : 'ghost'} 
                onClick={() => setCurrentPage('seller-dashboard')}
                className="gap-2 ml-auto"
              >
                <Icon name="Store" size={18} />
                Мой магазин
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setCurrentPage('seller-register')}
                className="gap-2 ml-auto"
              >
                <Icon name="Store" size={18} />
                Стать продавцом
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <div className="space-y-12 animate-fade-in">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 p-12 text-white">
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-5xl font-bold mb-4">Добро пожаловать в MarketHub</h1>
                <p className="text-xl mb-8 text-white/90">
                  Универсальный маркетплейс для покупок и продаж. Всё в одном месте!
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg"
                  onClick={() => setCurrentPage('catalog')}
                >
                  Начать покупки
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
                <Icon name="ShoppingBag" size={400} />
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6">Категории</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                  <Card 
                    key={category.name} 
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => setCurrentPage('catalog')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`${category.color} w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
                        <Icon name={category.icon as any} size={32} className="text-white" />
                      </div>
                      <h3 className="font-semibold">{category.name}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6">Популярные товары</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.slice(0, 6).map((product) => (
                  <Card 
                    key={product.id} 
                    className="overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(product);
                      setCurrentPage('product');
                    }}
                  >
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <Badge variant="secondary" className="mt-1">{product.category}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        <Icon name="Star" size={16} fill="currentColor" />
                        <span className="text-sm font-semibold">{product.rating}</span>
                        <span className="text-gray-500 text-sm">({product.reviews})</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{product.price.toLocaleString()} ₽</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentPage === 'catalog' && (
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold mb-8">Каталог товаров</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product);
                    setCurrentPage('product');
                  }}
                >
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  <CardHeader>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <Badge variant="secondary">{product.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                      <Icon name="Star" size={16} fill="currentColor" />
                      <span className="text-sm font-semibold">{product.rating}</span>
                      <span className="text-gray-500 text-sm">({product.reviews})</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{product.price.toLocaleString()} ₽</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'product' && selectedProduct && (
          <div className="animate-fade-in">
            <Button variant="ghost" onClick={() => setCurrentPage('catalog')} className="mb-6">
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад к каталогу
            </Button>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-[500px] object-cover rounded-2xl"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <Badge className="mb-3">{selectedProduct.category}</Badge>
                  <h1 className="text-4xl font-bold mb-4">{selectedProduct.name}</h1>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Icon name="Star" size={20} fill="currentColor" />
                      <span className="font-semibold">{selectedProduct.rating}</span>
                    </div>
                    <span className="text-gray-500">({selectedProduct.reviews} отзывов)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{selectedProduct.seller[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-gray-500">Продавец</p>
                    <p className="font-semibold">{selectedProduct.seller}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl">
                  <p className="text-4xl font-bold text-purple-600 mb-2">
                    {selectedProduct.price.toLocaleString()} ₽
                  </p>
                  <p className="text-gray-600">Доставка: 2-3 дня</p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1 py-6 text-lg"
                    onClick={() => addToCart(selectedProduct)}
                  >
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    Добавить в корзину
                  </Button>
                  <Button size="lg" variant="outline" className="py-6">
                    <Icon name="Heart" size={20} />
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Описание товара</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Высококачественный товар с отличными характеристиками. Идеально подходит для повседневного использования.
                      Изготовлен из качественных материалов с соблюдением всех стандартов качества.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'profile' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Мой профиль</h1>
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">Мои заказы</TabsTrigger>
                <TabsTrigger value="favorites">Избранное</TabsTrigger>
                <TabsTrigger value="settings">Настройки</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Заказ #12345</h3>
                    <p className="text-sm text-gray-500">15 декабря 2024</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Беспроводные наушники</p>
                        <p className="text-gray-600">4 990 ₽</p>
                      </div>
                      <Badge className="bg-green-500">Доставлен</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Заказ #12344</h3>
                    <p className="text-sm text-gray-500">10 декабря 2024</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Умные часы</p>
                        <p className="text-gray-600">8 990 ₽</p>
                      </div>
                      <Badge className="bg-blue-500">В пути</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="favorites">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockProducts.slice(0, 4).map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                      <CardHeader>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-lg font-bold text-purple-600">{product.price.toLocaleString()} ₽</p>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Личные данные</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Имя</label>
                      <Input placeholder="Иван Иванов" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="ivan@example.com" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Телефон</label>
                      <Input placeholder="+7 (999) 123-45-67" className="mt-1" />
                    </div>
                    <Button>Сохранить изменения</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentPage === 'reviews' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Отзывы покупателей</h1>
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{review.author}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Icon key={i} name="Star" size={16} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{review.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'seller-register' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Icon name="Store" size={40} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Станьте продавцом</h1>
                  <p className="text-gray-600">Начните продавать на MarketHub и зарабатывайте</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Название магазина *</label>
                    <Input placeholder="Мой магазин" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Категория товаров *</label>
                    <Input placeholder="Электроника" className="mt-1" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Юридическое название (ИП/ООО) *</label>
                  <Input placeholder="ИП Иванов Иван Иванович" className="mt-1" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">ИНН *</label>
                    <Input placeholder="1234567890" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">ОГРН/ОГРНИП *</label>
                    <Input placeholder="1234567890123" className="mt-1" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Юридический адрес *</label>
                  <Input placeholder="г. Москва, ул. Примерная, д. 1" className="mt-1" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Контактный телефон *</label>
                    <Input placeholder="+7 (999) 123-45-67" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email *</label>
                    <Input type="email" placeholder="shop@example.com" className="mt-1" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Описание магазина</label>
                  <Input placeholder="Расскажите о вашем магазине..." className="mt-1" />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Info" size={20} className="text-blue-600" />
                    Условия работы
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Комиссия платформы: 5% от каждой продажи</li>
                    <li>• Выплаты 2 раза в месяц на расчётный счёт</li>
                    <li>• Поддержка продавцов 24/7</li>
                    <li>• Бесплатная аналитика продаж</li>
                  </ul>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    Я принимаю условия пользовательского соглашения и политику конфиденциальности
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setCurrentPage('home')}
                >
                  Отмена
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setIsSeller(true);
                    setCurrentPage('seller-dashboard');
                  }}
                >
                  Зарегистрироваться
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {currentPage === 'seller-dashboard' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold">Панель продавца</h1>
                <p className="text-gray-600 mt-1">Управляйте вашими товарами и заказами</p>
              </div>
              <Button 
                size="lg"
                onClick={() => setEditingProduct({} as Product)}
                className="gap-2"
              >
                <Icon name="Plus" size={20} />
                Добавить товар
              </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Всего товаров</p>
                      <p className="text-3xl font-bold mt-1">{sellerProducts.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon name="Package" size={24} className="text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Активные заказы</p>
                      <p className="text-3xl font-bold mt-1">12</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="ShoppingBag" size={24} className="text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Продано за месяц</p>
                      <p className="text-3xl font-bold mt-1">47</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" size={24} className="text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Выручка</p>
                      <p className="text-3xl font-bold mt-1">234К ₽</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Icon name="Wallet" size={24} className="text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Мои товары</h2>
              </CardHeader>
              <CardContent>
                {sellerProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Package" size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">У вас пока нет товаров</p>
                    <Button onClick={() => setEditingProduct({} as Product)}>
                      Добавить первый товар
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sellerProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                        <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="secondary">{product.category}</Badge>
                            <span className="text-gray-600">{product.price.toLocaleString()} ₽</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Icon name="Pencil" size={18} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => deleteSellerProduct(product.id)}
                          >
                            <Icon name="Trash2" size={18} className="text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingProduct.id ? 'Редактировать товар' : 'Добавить товар'}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setEditingProduct(null)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Название товара *</label>
                <Input 
                  placeholder="Введите название" 
                  className="mt-1"
                  defaultValue={editingProduct.name}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Цена *</label>
                  <Input 
                    type="number" 
                    placeholder="1000" 
                    className="mt-1"
                    defaultValue={editingProduct.price}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Категория *</label>
                  <Input 
                    placeholder="Электроника" 
                    className="mt-1"
                    defaultValue={editingProduct.category}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Описание товара</label>
                <Input 
                  placeholder="Подробное описание..." 
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">URL изображения</label>
                <Input 
                  placeholder="/placeholder.svg" 
                  className="mt-1"
                  defaultValue={editingProduct.image || '/placeholder.svg'}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Количество на складе</label>
                  <Input 
                    type="number" 
                    placeholder="10" 
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Артикул</label>
                  <Input 
                    placeholder="ART-12345" 
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setEditingProduct(null)}
              >
                Отмена
              </Button>
              <Button 
                className="flex-1"
                onClick={() => {
                  if (editingProduct.id) {
                    updateSellerProduct(editingProduct);
                  } else {
                    addSellerProduct({
                      name: editingProduct.name || 'Новый товар',
                      price: editingProduct.price || 1000,
                      category: editingProduct.category || 'Без категории',
                      image: editingProduct.image || '/placeholder.svg',
                      rating: 0,
                      reviews: 0,
                      seller: 'Мой магазин'
                    });
                  }
                }}
              >
                {editingProduct.id ? 'Сохранить' : 'Добавить'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
        size="icon"
        onClick={() => setChatOpen(!chatOpen)}
      >
        <Icon name="MessageCircle" size={24} />
      </Button>

      {chatOpen && (
        <Card className="fixed bottom-24 right-6 w-80 shadow-xl animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Чат поддержки</h3>
              <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)}>
                <Icon name="X" size={20} className="text-white" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 h-64 overflow-y-auto">
            <div className="space-y-3">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm">Здравствуйте! Чем могу помочь?</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2 w-full">
              <Input placeholder="Введите сообщение..." />
              <Button size="icon">
                <Icon name="Send" size={18} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Index;