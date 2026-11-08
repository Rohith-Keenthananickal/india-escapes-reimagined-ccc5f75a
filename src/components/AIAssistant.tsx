
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
          className="w-14 h-14 rounded-full bg-gradient-to-r from-[#2BB0BB] to-[#1A8491] hover:from-[#23959E] hover:to-[#156771] text-white shadow-xl hover:scale-105 transition-all duration-300"
          size="icon"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
        {!hasGreeted && !isOpen && (
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#FFD26E] border-2 border-white rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 shadow-2xl z-50 animate-fade-in border-brand-teal-200 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-[#2BB0BB] to-[#1A8491] text-white rounded-t-lg">
            <h3 className="font-semibold font-heading">AI Robert - Kerala Guide</h3>
            <p className="text-xs text-white/90">Your TriphavenCo travel assistant</p>
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
                      className="text-xs hover:border-[#2BB0BB] hover:bg-brand-teal-50 hover:text-brand-primary-700"
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
                    className={`p-3 rounded-xl text-sm ${
                      message.role === 'ai' 
                        ? 'bg-gray-100 text-[#1F1F1F]' 
                        : 'bg-[#2BB0BB] text-[#1F1F1F] font-medium ml-8 shadow-xs'
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
