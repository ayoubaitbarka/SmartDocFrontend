import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { DocumentsTable } from '@/components/documents/documents-table';
import { useDocuments } from '@/hooks/useDocuments';

export default function DocumentsListPage() {
  const { data: documents = [], isLoading, error } = useDocuments();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Document Library
            </h1>
            <p className="text-muted-foreground">
              Manage and view all your processed documents
            </p>
          </div>
          
          {error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">
                Failed to load documents: {(error as any)?.message || 'Unknown error'}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <DocumentsTable documents={documents} isLoading={isLoading} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}