import { EventData } from '@/components/EventCard';

interface ImageAnalysisService {
  analyzeImage(file: File, apiKey: string): Promise<EventData>;
}

class OpenAIImageAnalysisService implements ImageAnalysisService {
  async analyzeImage(file: File, apiKey: string): Promise<EventData> {
    try {
      // Convert file to base64
      const base64Image = await this.fileToBase64(file);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5-2025-08-07',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this image and extract event details. Look for any text, signs, screens, or visual clues that indicate:
                  1. Event title/name
                  2. Date (try to find actual dates, not just infer from the photo)
                  3. Time 
                  4. Location/venue/context
                  
                  Return the information as JSON in this exact format:
                  {
                    "title": "Event name or descriptive title",
                    "date": "YYYY-MM-DD format",
                    "time": "HH:MM format (24-hour)",
                    "context": "Location, venue, or brief description of what/where"
                  }
                  
                  If you cannot find specific details, make reasonable inferences based on what you see in the image. For dates, if no specific date is visible, estimate based on context clues or use today's date. For times, estimate based on lighting/context.`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: base64Image,
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from OpenAI API');
      }

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in API response');
      }

      const extractedData = JSON.parse(jsonMatch[0]);
      
      // Create EventData object
      const eventData: EventData = {
        id: Date.now().toString(),
        title: extractedData.title || 'Untitled Event',
        date: this.validateDate(extractedData.date),
        time: this.validateTime(extractedData.time),
        context: extractedData.context || 'Event location',
        photoUrl: URL.createObjectURL(file)
      };

      return eventData;
    } catch (error) {
      console.error('Image analysis error:', error);
      throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private validateDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }

  private validateTime(timeStr: string): string {
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (timeRegex.test(timeStr)) {
      return timeStr;
    }
    // Default to current time if invalid
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
}

export const imageAnalysisService = new OpenAIImageAnalysisService();