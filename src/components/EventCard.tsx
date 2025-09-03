import { useState } from 'react';
import { Calendar, Clock, MapPin, Edit3, Save, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  context: string;
  photoUrl?: string;
}

interface EventCardProps {
  event: EventData;
  onSave: (event: EventData) => void;
  onCancel?: () => void;
  isEditable?: boolean;
}

export const EventCard = ({ 
  event, 
  onSave, 
  onCancel, 
  isEditable = true 
}: EventCardProps) => {
  const [isEditing, setIsEditing] = useState(isEditable);
  const [editData, setEditData] = useState(event);

  const handleSave = () => {
    onSave(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(event);
    setIsEditing(false);
    onCancel?.();
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <Card className="p-6 bg-card shadow-card border-0 animate-slide-up">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Event Details
            </h3>
          </div>
          
          {!isEditing && isEditable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Event Title</Label>
            {isEditing ? (
              <Input
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Enter event title..."
                className="mt-1 bg-background/50"
              />
            ) : (
              <p className="mt-1 text-lg font-medium text-card-foreground">
                {event.title || 'Untitled Event'}
              </p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Date
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  className="mt-1 bg-background/50"
                />
              ) : (
                <p className="mt-1 text-card-foreground">
                  {event.date ? formatDate(event.date) : 'No date specified'}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Time
              </Label>
              {isEditing ? (
                <Input
                  type="time"
                  value={editData.time}
                  onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                  className="mt-1 bg-background/50"
                />
              ) : (
                <p className="mt-1 text-card-foreground">
                  {event.time ? formatTime(event.time) : 'No time specified'}
                </p>
              )}
            </div>
          </div>

          {/* Context */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Context / Location
            </Label>
            {isEditing ? (
              <Textarea
                value={editData.context}
                onChange={(e) => setEditData({ ...editData, context: e.target.value })}
                placeholder="Add context, location, or notes..."
                className="mt-1 bg-background/50 min-h-[80px]"
              />
            ) : (
              <p className="mt-1 text-card-foreground">
                {event.context || 'No additional context'}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-primary hover:opacity-90 shadow-soft"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Event
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};