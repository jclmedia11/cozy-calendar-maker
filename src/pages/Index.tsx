import { useState } from 'react';
import { PhotoUpload } from '@/components/PhotoUpload';
import { EventCard, EventData } from '@/components/EventCard';
import { CalendarView } from '@/components/CalendarView';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { useEventStorage } from '@/hooks/useEventStorage';
import { useToast } from '@/hooks/use-toast';
import { imageAnalysisService } from '@/utils/imageAnalysisService';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const { events, addEvent } = useEventStorage();
  const { toast } = useToast();
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');

  const extractEventFromImage = async (file: File): Promise<EventData> => {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    return await imageAnalysisService.analyzeImage(file, apiKey);
  };

  const handlePhotoUpload = async (file: File) => {
    if (!apiKey) {
      toast({
        title: "API key required",
        description: "Please set your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const extractedEvent = await extractEventFromImage(file);
      setCurrentEvent(extractedEvent);
      
      toast({
        title: "✨ Details extracted!",
        description: "Review and edit the event details below.",
      });
    } catch (error) {
      console.error('Photo analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEventSave = (event: EventData) => {
    addEvent(event);
    setCurrentEvent(null);
    
    toast({
      title: "🎉 Event saved!",
      description: "Your memory has been added to your calendar.",
    });
  };

  const handleEventCancel = () => {
    setCurrentEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-warm p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
          Memory Keeper
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your photos into organized events. Upload a picture and watch as we extract 
          all the important details for your personal calendar.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* API Key Section */}
        <ApiKeyInput onApiKeySet={setApiKey} hasApiKey={!!apiKey} />
        
        {/* Upload Section */}
        {apiKey && <PhotoUpload onPhotoUpload={handlePhotoUpload} isProcessing={isProcessing} />}

        {/* Event Card Section */}
        {currentEvent && (
          <div className="animate-slide-up">
            <EventCard
              event={currentEvent}
              onSave={handleEventSave}
              onCancel={handleEventCancel}
              isEditable={true}
            />
          </div>
        )}

        {/* Calendar Section */}
        {events.length > 0 && (
          <div className="animate-fade-in">
            <CalendarView events={events} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-border/50 text-center animate-fade-in">
        <p className="text-sm text-muted-foreground">
          Made with{' '}
          <span className="text-primary">♥</span>{' '}
          to help you cherish your precious moments
        </p>
      </div>
    </div>
  );
};

export default Index;