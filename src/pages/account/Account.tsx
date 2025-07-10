import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import UserOrders from "./UserOrders";
import AccountSidebar from "@/components/account/AccountSidebar";
import ProfileForm from "@/components/account/ProfileForm";
import { Camera, User, LogOut, Loader2, Edit, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Account = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Проверяем, есть ли у пользователя права администратора/редактора
  const hasAdminAccess = user?.roles?.includes("admin") || user?.roles?.includes("editor");

  // Обработка аутентификации и загрузки данных
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
    
    if (user?.avatar_url) {
      setIsAvatarLoading(true);
      const img = new Image();
      img.src = user.avatar_url;
      img.onload = () => {
        setAvatar(user.avatar_url);
        setIsAvatarLoading(false);
      };
      img.onerror = () => {
        setIsAvatarLoading(false);
      };
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Обработка изменения аватара
  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    
    if (!validTypes.includes(file.type)) {
      alert("Пожалуйста, выберите файл формата JPG, PNG или WebP");
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert("Максимальный размер файла 2MB");
      return;
    }
    
    setIsAvatarLoading(true);
    const reader = new FileReader();
    
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
      setIsAvatarLoading(false);
    };
    
    reader.onerror = () => {
      setIsAvatarLoading(false);
      alert("Ошибка при чтении файла");
    };
    
    reader.readAsDataURL(file);
  }, []);

  // Выход из аккаунта
  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  // Переход в админ панель
  const goToAdminPanel = useCallback(() => {
    navigate("/admin");
  }, [navigate]);

  // Обработчик клика по аватару
  const handleAvatarClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка данных профиля...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="flex-grow container px-4 py-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Боковая панель с профилем */}
          <div className="md:w-1/4 flex flex-col">
            <Card className="bg-white rounded-xl shadow-lg mb-6 border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">Аккаунт</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative group">
                  <div 
                    className="relative mx-auto w-32 h-32 mb-4 cursor-pointer rounded-full overflow-hidden border-4 border-white shadow-lg"
                    onClick={handleAvatarClick}
                  >
                    {isAvatarLoading ? (
                      <Skeleton className="w-full h-full rounded-full" />
                    ) : avatar ? (
                      <img
                        src={avatar}
                        alt="Аватар пользователя"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={() => setAvatar(null)}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        <User className="w-16 h-16 text-indigo-400" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white p-2 rounded-full">
                        <Camera className="w-5 h-5 text-gray-700" />
                      </div>
                    </div>
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/jpeg, image/png, image/webp"
                    className="hidden"
                    aria-label="Выбрать файл аватара"
                  />
                </div>
                
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 truncate">
                    {user?.name || "Пользователь"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 truncate flex items-center justify-center">
                    <span className="bg-gray-200 px-2 py-1 rounded-md text-gray-700">
                      {user?.email || "Электронная почта не указана"}
                    </span>
                  </p>
                  
                  {/* Бейдж роли */}
                  {hasAdminAccess && (
                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
                      {user.roles?.includes("admin") ? "Администратор" : "Редактор"}
                    </div>
                  )}
                </div>
                
                {hasAdminAccess && (
                  <div className="mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                      <h3 className="font-bold text-blue-800 mb-1">Администрирование</h3>
                      <p className="text-sm text-blue-700">У вас есть доступ к панели администратора</p>
                    </div>
                    <Button
                      onClick={goToAdminPanel}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg transition-all"
                    >
                      Перейти в панель администратора
                    </Button>
                  </div>
                )}
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Искать..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <AccountSidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLogout={handleLogout}
            />
          </div>
          
          {/* Основной контент */}
          <div className="md:w-3/4">
            <Card className="bg-white rounded-xl shadow-lg border-0 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-50 border-b border-gray-200 px-6 py-0">
                  <TabsTrigger 
                    value="profile"
                    className="py-4 px-4 data-[state=active]:text-primary data-[state=active]:bg-white data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:shadow-sm"
                  >
                    Личные данные
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders"
                    className="py-4 px-4 data-[state=active]:text-primary data-[state=active]:bg-white data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:shadow-sm"
                  >
                    Мои заказы
                  </TabsTrigger>
                </TabsList>
                
                <div className="p-6">
                  <TabsContent value="profile">
                    {/* Заголовок и кнопка редактирования */}
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Личные данные</h2>
                      {!isEditingProfile && (
                        <Button
                          onClick={() => setIsEditingProfile(true)}
                          variant="outline"
                          className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                          Редактировать профиль
                        </Button>
                      )}
                    </div>
                    
                    {/* Режим просмотра профиля */}
                    {!isEditingProfile ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Имя</h3>
                            <p className="text-lg font-medium">{user?.name || "Не указано"}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
                            <p className="text-lg font-medium">{user?.email || "Не указан"}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Аватар</h3>
                          <div className="flex items-center">
                            {avatar ? (
                              <img 
                                src={avatar} 
                                alt="Аватар" 
                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                              />
                            ) : (
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-300">
                                <User className="w-8 h-8 text-indigo-400" />
                              </div>
                            )}
                            <Button 
                              variant="link"
                              onClick={handleAvatarClick}
                              className="ml-4 text-blue-600 hover:text-blue-800"
                            >
                              Изменить аватар
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Режим редактирования профиля
                      <div className="space-y-6">
                        <ProfileForm 
                          initialData={{
                            name: user?.name || "",
                            email: user?.email || "",
                            avatar: avatar || undefined
                          }} 
                          onCancel={() => setIsEditingProfile(false)}
                          onSuccess={() => setIsEditingProfile(false)}
                        />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="orders">
    
                    <UserOrders />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Account;