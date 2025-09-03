import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventData } from './EventCard';

interface CalendarViewProps {
  events: EventData[];
}

export const CalendarView = ({ events }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + (direction === 'next' ? 1 : -1),
      1
    ));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDay }, (_, i) => i);

  const today = new Date();
  const isCurrentMonth = 
    today.getFullYear() === currentDate.getFullYear() && 
    today.getMonth() === currentDate.getMonth();

  return (
    <Card className="p-6 bg-card shadow-card border-0 animate-fade-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-card-foreground">
                Your Events
              </h3>
              <p className="text-sm text-muted-foreground">
                {events.length} {events.length === 1 ? 'memory' : 'memories'} saved
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-secondary"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h4 className="text-lg font-medium text-card-foreground min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="hover:bg-secondary"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-3">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Padding days */}
            {paddingDays.map(index => (
              <div key={`padding-${index}`} className="p-2 h-16" />
            ))}
            
            {/* Actual days */}
            {days.map(day => {
              const dayEvents = getEventsForDate(day);
              const isToday = isCurrentMonth && day === today.getDate();
              
              return (
                <div
                  key={day}
                  className={`
                    p-2 h-16 rounded-lg border transition-all duration-200 hover:bg-secondary/50
                    ${isToday 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-background/50 border-border/50'
                    }
                  `}
                >
                  <div className="flex flex-col h-full">
                    <span className={`
                      text-sm font-medium 
                      ${isToday ? 'text-primary' : 'text-card-foreground'}
                    `}>
                      {day}
                    </span>
                    
                    {dayEvents.length > 0 && (
                      <div className="flex-1 flex flex-col justify-end">
                        {dayEvents.slice(0, 2).map((event, index) => (
                          <div
                            key={event.id}
                            className="text-xs bg-primary text-primary-foreground px-1 py-0.5 rounded mb-0.5 truncate"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="p-4 mx-auto w-fit bg-accent/50 rounded-full mb-4">
              <Heart className="w-8 h-8 text-accent-foreground" />
            </div>
            <h4 className="text-lg font-medium text-card-foreground mb-2">
              No memories yet
            </h4>
            <p className="text-muted-foreground">
              Upload your first photo to start organizing your precious moments
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};