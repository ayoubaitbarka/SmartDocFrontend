import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { UploadDropzone } from '@/components/upload/upload-dropzone';

export default function UploadPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-hero bg-clip-text text-transparent">
              AI-Powered Document Processing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your documents and let our AI extract key information automatically. 
              Support for PDFs and images with instant processing.
            </p>
          </div>
          
          <UploadDropzone />
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-gradient-card border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold mb-2">Instant Processing</h3>
              <p className="text-sm text-muted-foreground">
                AI extracts data from your documents in seconds
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-card border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Smart Recognition</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI recognizes text, tables, and key fields
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-card border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold mb-2">Structured Output</h3>
              <p className="text-sm text-muted-foreground">
                Get clean, structured JSON data ready for your workflow
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}