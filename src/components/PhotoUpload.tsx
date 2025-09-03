import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PhotoUploadProps {
  onPhotoUpload: (file: File) => void;
  isProcessing?: boolean;
}

export const PhotoUpload = ({ onPhotoUpload, isProcessing = false }: PhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      onPhotoUpload(file);
    }
  }, [onPhotoUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const resetUpload = () => {
    setPreview(null);
  };

  return (
    <Card className="p-8 bg-gradient-warm shadow-soft border-0 animate-fade-in">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <Sparkles className="w-8 h-8 text-primary animate-bounce-gentle" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Upload Your Photo
          </h2>
          <p className="text-muted-foreground">
            Drop a photo to extract event details automagically ✨
          </p>
        </div>

        {!preview ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-primary bg-primary/5 scale-105' 
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className={`w-12 h-12 text-muted-foreground ${isDragActive ? 'animate-bounce-gentle' : ''}`} />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {isDragActive ? 'Drop your photo here!' : 'Drag & drop your photo'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse your files
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-scale-in">
            <div className="relative max-w-sm mx-auto">
              <img
                src={preview}
                alt="Uploaded preview"
                className="w-full h-48 object-cover rounded-lg shadow-card"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center text-primary-foreground">
                    <Sparkles className="w-8 h-8 mx-auto animate-spin mb-2" />
                    <p className="font-medium">Extracting details...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={resetUpload}
                disabled={isProcessing}
                className="hover:bg-secondary"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};