import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  Search, 
  FileText, 
  Calendar, 
  Copy, 
  ChevronUp, 
  ChevronDown,
  Upload as UploadIcon 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DocumentDTO } from '@/types/api';
import { toast } from '@/hooks/use-toast';

interface DocumentsTableProps {
  documents: DocumentDTO[];
  isLoading?: boolean;
}

type SortField = 'fileName' | 'docType' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export function DocumentsTable({ documents, isLoading }: DocumentsTableProps) {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedDocuments = useMemo(() => {
    // ✅ De-duplicate by id to ensure unique React keys
    const uniqueDocs = Array.from(
      new Map(documents.map(d => [d.id, d])).values()
    );

    // Filter by search query
    let filtered = uniqueDocs;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = uniqueDocs.filter(
        (doc) =>
          doc.fileName.toLowerCase().includes(query) ||
          doc.docType.toLowerCase().includes(query) ||
          doc.status.toLowerCase().includes(query) ||
          doc.id.toLowerCase().includes(query)
      );
    }
    
    // Sort documents
    return [...filtered].sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;
      
      if (sortField === 'createdAt') {
        aValue = new Date(a[sortField]);
        bValue = new Date(b[sortField]);
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [documents, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('complete') || statusLower.includes('success')) {
      return 'bg-success text-success-foreground';
    }
    if (statusLower.includes('processing') || statusLower.includes('pending')) {
      return 'bg-warning text-warning-foreground';
    }
    if (statusLower.includes('error') || statusLower.includes('failed')) {
      return 'bg-destructive text-destructive-foreground';
    }
    return 'bg-secondary text-secondary-foreground';
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
            <p className="text-muted-foreground mb-6">
              Upload your first document to get started with AI processing.
            </p>
            <Button asChild>
              <Link to="/">
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload Document
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Documents ({filteredAndSortedDocuments.length})</CardTitle>
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('fileName')}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    File Name
                    <SortIcon field="fileName" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('docType')}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Type
                    <SortIcon field="docType" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('status')}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Status
                    <SortIcon field="status" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('createdAt')}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Created
                    <SortIcon field="createdAt" />
                  </Button>
                </TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedDocuments.map((document) => (
                <TableRow 
                  key={document.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>
                    <Link 
                      to={`/documents/${document.id}`}
                      className="flex items-center space-x-2 hover:text-primary transition-colors"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{document.fileName}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{document.docType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(document.status)}>
                      {document.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span className="text-sm">
                            {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {new Date(document.createdAt).toLocaleString()}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            copyToClipboard(document.id, 'Document ID');
                          }}
                          className="h-auto p-1 text-xs font-mono text-muted-foreground hover:text-foreground"
                        >
                          {document.id.slice(-8)}
                          <Copy className="ml-1 h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Click to copy full ID: {document.id}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
