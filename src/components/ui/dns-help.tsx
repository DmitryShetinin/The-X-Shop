import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, Wifi, Smartphone, Monitor } from 'lucide-react';
import { toast } from 'sonner';

interface DnsHelpProps {
  onClose?: () => void;
}

const DnsHelp: React.FC<DnsHelpProps> = ({ onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const dnsServers = [
    { name: 'Google DNS', primary: '8.8.8.8', secondary: '8.8.4.4' },
    { name: 'Cloudflare DNS', primary: '1.1.1.1', secondary: '1.0.0.1' },
    { name: 'OpenDNS', primary: '208.67.222.222', secondary: '208.67.220.220' },
    { name: 'Yandex DNS', primary: '77.88.8.8', secondary: '77.88.8.1' }
  ];

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast.success(`${label} скопирован в буфер обмена`);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast.error('Не удалось скопировать');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Проблемы с загрузкой? Смените DNS
        </CardTitle>
        <CardDescription>
          Если сайт не загружается, попробуйте сменить DNS-серверы. Это поможет обойти проблемы с интернет-провайдером.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Wifi className="h-4 w-4" />
          <AlertDescription>
            <strong>Почему это помогает?</strong> Некоторые интернет-провайдеры используют DNS-серверы, 
            которые могут блокировать или медленно обрабатывать запросы к зарубежным сервисам. 
            Смена на публичные DNS-серверы часто решает эту проблему.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="android" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="android" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Android
            </TabsTrigger>
            <TabsTrigger value="ios" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              iPhone
            </TabsTrigger>
            <TabsTrigger value="desktop" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Компьютер
            </TabsTrigger>
          </TabsList>

          <TabsContent value="android" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Как сменить DNS на Android:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Откройте <strong>Настройки</strong> → <strong>Сеть и интернет</strong></li>
                <li>Нажмите на ваше Wi-Fi соединение</li>
                <li>Нажмите <strong>Изменить</strong> (значок карандаша)</li>
                <li>Разверните <strong>Дополнительные параметры</strong></li>
                <li>В разделе <strong>IP-настройки</strong> выберите <strong>Статический</strong></li>
                <li>Прокрутите вниз и найдите поля <strong>DNS 1</strong> и <strong>DNS 2</strong></li>
                <li>Введите один из вариантов ниже</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="ios" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Как сменить DNS на iPhone:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Откройте <strong>Настройки</strong> → <strong>Wi-Fi</strong></li>
                <li>Нажмите на значок ⓘ рядом с вашим Wi-Fi</li>
                <li>Прокрутите вниз и нажмите <strong>Настроить DNS</strong></li>
                <li>Выберите <strong>Вручную</strong></li>
                <li>Нажмите <strong>Добавить сервер</strong></li>
                <li>Введите один из вариантов ниже</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="desktop" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Как сменить DNS на компьютере:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Windows:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Откройте <strong>Панель управления</strong></li>
                    <li><strong>Сеть и интернет</strong> → <strong>Центр управления сетями</strong></li>
                    <li>Нажмите на ваше соединение</li>
                    <li><strong>Свойства</strong> → <strong>Протокол Интернета версии 4</strong></li>
                    <li>Нажмите <strong>Свойства</strong></li>
                    <li>Выберите <strong>Использовать следующие адреса DNS</strong></li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Mac:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li><strong>Системные настройки</strong> → <strong>Сеть</strong></li>
                    <li>Выберите ваше соединение</li>
                    <li>Нажмите <strong>Дополнительно</strong></li>
                    <li>Перейдите на вкладку <strong>DNS</strong></li>
                    <li>Нажмите <strong>+</strong> и добавьте DNS-серверы</li>
                  </ol>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="font-semibold mb-4">Рекомендуемые DNS-серверы:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dnsServers.map((dns) => (
              <div key={dns.name} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{dns.name}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Основной:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {dns.primary}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(dns.primary, dns.primary)}
                      >
                        {copied === dns.primary ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Дополнительный:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {dns.secondary}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(dns.secondary, dns.secondary)}
                      >
                        {copied === dns.secondary ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Совет:</h4>
          <p className="text-sm text-blue-800">
            Попробуйте сначала <strong>Google DNS (8.8.8.8)</strong> или <strong>Cloudflare DNS (1.1.1.1)</strong>. 
            Эти серверы обычно работают лучше всего и быстрее всего.
          </p>
        </div>

        {onClose && (
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="outline">
              Закрыть
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DnsHelp; 