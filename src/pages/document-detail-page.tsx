import { useParams } from 'react-router-dom';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { DocumentEditor } from '@/components/documents/document-editor';
import { useDocument } from '@/hooks/useDocuments';

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: document, isLoading, error, refetch } = useDocument(id!);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {error ? (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The document you're looking for doesn't exist or has been deleted.
              </p>
              <button 
                onClick={() => window.history.back()}
                className="text-primary hover:underline"
              >
                Go back
              </button>
            </div>
          ) : document ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  {document.fileName}
                </h1>
                <p className="text-muted-foreground">
                  Edit document details and extracted data
                </p>
              </div>
              
              <DocumentEditor 
                document={document} 
                isLoading={isLoading}
                onRefresh={() => refetch()}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse max-w-4xl mx-auto" />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}