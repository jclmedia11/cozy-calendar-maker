import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  hasApiKey: boolean;
}

export const ApiKeyInput = ({ onApiKeySet, hasApiKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      setApiKey('');
    }
  };

  if (hasApiKey) {
    return (
      <Card className="p-4 bg-primary/5 border-primary/20 animate-fade-in">
        <div className="flex items-center gap-2 text-sm text-primary">
          <Key className="w-4 h-4" />
          <span>API key configured ✓</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-warm shadow-soft border-0 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-2 bg-primary/10 rounded-full">
              <Key className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground">OpenAI API Key Required</h3>
          <p className="text-sm text-muted-foreground">
            To analyze your photos and extract event details, please provide your OpenAI API key.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-sm font-medium">
            API Key
          </Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          Set API Key
        </Button>
      </form>
    </Card>
  );
};