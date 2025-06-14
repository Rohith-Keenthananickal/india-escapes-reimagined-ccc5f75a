
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Volume2, Mic } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [messages, setMessages] = useState<Array<{role: 'ai' | 'user', content: string}>>([]);

  const languages = ['English', 'Hindi', 'Malayalam', 'Tamil'];

  const greetingMessage = "Hello! I'm Robert, your Kerala travel assistant. I can help you discover authentic homestays, plan experiences, and share local insights about Kerala's beautiful destinations. Which language would you prefer?";

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setHasGreeted(true);
    setMessages([
      { role: 'ai', content: greetingMessage },
      { role: 'ai', content: `Great! I'll assist you in ${language}. Kerala offers amazing backwater experiences, hill stations, cultural heritage sites, and warm homestay hosts. What would you like to explore?` }
    ]);
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (!hasGreeted && !isOpen) {
      setMessages([{ role: 'ai', content: greetingMessage }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleAssistant}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 shadow-lg"
          size="icon"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
        {!hasGreeted && !isOpen && (
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 shadow-xl z-50 animate-fade-in">
          <div className="p-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-t-lg">
            <h3 className="font-semibold">AI Robert - Kerala Guide</h3>
            <p className="text-sm opacity-90">Your personal travel assistant</p>
          </div>
          
          <CardContent className="p-4 h-64 overflow-y-auto">
            {!selectedLanguage ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-700">{greetingMessage}</p>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang}
                      variant="outline"
                      size="sm"
                      onClick={() => handleLanguageSelect(lang)}
                      className="text-xs"
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-sm ${
                      message.role === 'ai' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-pink-500 text-white ml-8'
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Volume2 className="w-4 h-4 mr-1" />
                    Voice
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mic className="w-4 h-4 mr-1" />
                    Speak
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;
