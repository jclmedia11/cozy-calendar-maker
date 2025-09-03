import { useState, useEffect } from 'react';
import { EventData } from '@/components/EventCard';

const STORAGE_KEY = 'cozy-calendar-events';

export const useEventStorage = () => {
  const [events, setEvents] = useState<EventData[]>([]);

  // Load events from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedEvents = JSON.parse(stored);
        setEvents(parsedEvents);
      }
    } catch (error) {
      console.error('Failed to load events from storage:', error);
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Failed to save events to storage:', error);
    }
  }, [events]);

  const addEvent = (event: EventData) => {
    setEvents(prev => [...prev, event]);
  };

  const updateEvent = (updatedEvent: EventData) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent
  };
};