import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUploadDocument } from '@/hooks/useDocuments';
import { useNavigate } from 'react-router-dom';

interface UploadDropzoneProps {
  onUploadComplete?: (documentId: string) => void;
}

export function UploadDropzone({ onUploadComplete }: UploadDropzoneProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  
  const uploadMutation = useUploadDocument();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      uploadMutation.mutate(file, {
        onSuccess: (response) => {
          clearInterval(progressInterval);
          setUploadProgress(100);
          
          setTimeout(() => {
            onUploadComplete?.(response.data.id);
            navigate(`/documents/${response.data.id}`);
          }, 500);
        },
        onError: () => {
          clearInterval(progressInterval);
          setUploadProgress(0);
          setSelectedFile(null);
        },
      });
    }
  }, [uploadMutation, navigate, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const isUploading = uploadMutation.isPending;
  const isComplete = uploadProgress === 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={`
            relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
            ${isDragActive 
              ? 'border-primary bg-primary/5 shadow-glow' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }
            ${isUploading ? 'pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            {isComplete ? (
              <CheckCircle className="h-16 w-16 text-success mb-4" />
            ) : isUploading ? (
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
            ) : (
              <div className="mb-4">
                {isDragActive ? (
                  <Upload className="h-16 w-16 text-primary animate-bounce" />
                ) : (
                  <div className="flex space-x-2">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            )}

            {isComplete ? (
              <div>
                <h3 className="text-lg font-semibold text-success mb-2">
                  Upload Complete!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Redirecting to document details...
                </p>
              </div>
            ) : isUploading ? (
              <div className="w-full max-w-xs">
                <h3 className="text-lg font-semibold mb-2">
                  Processing {selectedFile?.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Extracting data with AI...
                </p>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-muted-foreground mt-2">
                  {uploadProgress}% complete
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {isDragActive ? 'Drop your file here' : 'Upload Document'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag & drop a PDF or image file, or click to select
                </p>
                <Button variant="outline" className="mt-2">
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: PDF, PNG, JPG, JPEG, GIF, BMP, WebP
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}