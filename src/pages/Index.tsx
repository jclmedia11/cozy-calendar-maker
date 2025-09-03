import { useState } from 'react';
import { PhotoUpload } from '@/components/PhotoUpload';
import { EventCard, EventData } from '@/components/EventCard';
import { CalendarView } from '@/components/CalendarView';
import { useEventStorage } from '@/hooks/useEventStorage';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const { events, addEvent } = useEventStorage();
  const { toast } = useToast();
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate OCR/AI extraction (in a real app, this would call an API)
  const simulateEventExtraction = (file: File): Promise<EventData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate random realistic event data
        const eventTitles = [
          "Birthday Party",
          "Wedding Reception",
          "Graduation Ceremony",
          "Anniversary Dinner",
          "Beach Vacation",
          "Concert Night",
          "Family Reunion",
          "Holiday Celebration",
          "Business Conference",
          "Art Gallery Opening"
        ];

        const contexts = [
          "Downtown restaurant with friends and family",
          "Beautiful garden venue with amazing decorations",
          "University auditorium filled with proud families",
          "Cozy home setting with loved ones",
          "Sunny beach with crystal clear waters",
          "Outdoor amphitheater under the stars",
          "Family home backyard with barbecue and games",
          "Decorated living room with holiday spirit",
          "Convention center with industry professionals",
          "Modern gallery space showcasing local artists"
        ];

        // Generate a date within the next 30 days
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));
        
        // Generate a random time
        const hours = Math.floor(Math.random() * 12) + 9; // 9 AM to 8 PM
        const minutes = Math.random() < 0.5 ? '00' : '30';

        const extractedData: EventData = {
          id: Date.now().toString(),
          title: eventTitles[Math.floor(Math.random() * eventTitles.length)],
          date: futureDate.toISOString().split('T')[0],
          time: `${hours.toString().padStart(2, '0')}:${minutes}`,
          context: contexts[Math.floor(Math.random() * contexts.length)],
          photoUrl: URL.createObjectURL(file)
        };

        resolve(extractedData);
      }, 2000); // 2 second delay to simulate processing
    });
  };

  const handlePhotoUpload = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const extractedEvent = await simulateEventExtraction(file);
      setCurrentEvent(extractedEvent);
      
      toast({
        title: "✨ Details extracted!",
        description: "Review and edit the event details below.",
      });
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        description: "Please try uploading your photo again.",
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
        {/* Upload Section */}
        <PhotoUpload onPhotoUpload={handlePhotoUpload} isProcessing={isProcessing} />

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