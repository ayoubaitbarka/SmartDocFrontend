import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  Save,
  RotateCcw,
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  FileText,
  Tag,
  Hash,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { DocumentDTO } from '@/types/api';
import { useUpdateDocument } from '@/hooks/useDocuments';
import { toast } from '@/hooks/use-toast';

interface DocumentEditorProps {
  document: DocumentDTO;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function DocumentEditor({ document, isLoading, onRefresh }: DocumentEditorProps) {
  const [editedDocument, setEditedDocument] = useState<DocumentDTO>(document);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const navigate = useNavigate();
  const updateMutation = useUpdateDocument();

  // Update local state when document prop changes
  useEffect(() => {
    setEditedDocument(document);
    setHasUnsavedChanges(false);
    setJsonError(null);
  }, [document]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = 
      editedDocument.status !== document.status ||
      editedDocument.extractedDataJson !== document.extractedDataJson;
    setHasUnsavedChanges(hasChanges);
  }, [editedDocument, document]);

  // Validate JSON
  const validateJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setJsonError(null);
      return true;
    }
    
    try {
      JSON.parse(jsonString);
      setJsonError(null);
      return true;
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON');
      return false;
    }
  };

  const handleStatusChange = (value: string) => {
    setEditedDocument(prev => ({ ...prev, status: value }));
  };

  const handleJsonChange = (value: string) => {
    setEditedDocument(prev => ({ ...prev, extractedDataJson: value }));
    validateJson(value);
  };

  const handleSave = () => {
    if (!validateJson(editedDocument.extractedDataJson)) {
      toast({
        title: "Invalid JSON",
        description: "Please fix the JSON format before saving.",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({
      id: document.id,
      document: editedDocument,
    });
  };

  const handleReset = () => {
    setEditedDocument(document);
    setJsonError(null);
    onRefresh?.();
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(editedDocument.extractedDataJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setEditedDocument(prev => ({ ...prev, extractedDataJson: formatted }));
      setJsonError(null);
    } catch (error) {
      toast({
        title: "Format Failed",
        description: "Cannot format invalid JSON",
        variant: "destructive",
      });
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(editedDocument.extractedDataJson);
      const minified = JSON.stringify(parsed);
      setEditedDocument(prev => ({ ...prev, extractedDataJson: minified }));
      setJsonError(null);
    } catch (error) {
      toast({
        title: "Minify Failed",
        description: "Cannot minify invalid JSON",
        variant: "destructive",
      });
    }
  };

  const renderJsonPreview = () => {
    try {
      const parsed = JSON.parse(editedDocument.extractedDataJson);
      return (
        <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96 font-mono">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return (
        <div className="text-sm text-destructive p-4 bg-destructive/10 rounded-lg">
          Invalid JSON format
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/documents')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-warning">
              <AlertCircle className="mr-1 h-3 w-3" />
              Unsaved changes
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={updateMutation.isPending}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending || !!jsonError || !hasUnsavedChanges}
          >
            <Save className="mr-2 h-4 w-4" />
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Document metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Document Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">File Name</Label>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-mono text-sm">{document.fileName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(document.fileName, 'File name')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Document Type</Label>
              <div className="mt-1">
                <Badge variant="outline">
                  <Tag className="mr-1 h-3 w-3" />
                  {document.docType}
                </Badge>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Created</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {new Date(document.createdAt).toLocaleString()}
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Document ID</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {document.id.slice(0, 8)}...
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(document.id, 'Document ID')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="status">Current Status</Label>
              <Input
                id="status"
                value={editedDocument.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                placeholder="Enter document status"
              />
            </div>
          </CardContent>
        </Card>

        {/* Extracted Data JSON */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Extracted Data</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowJsonPreview(!showJsonPreview)}
                >
                  {showJsonPreview ? (
                    <>
                      <EyeOff className="mr-1 h-3 w-3" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye className="mr-1 h-3 w-3" />
                      Preview
                    </>
                  )}
                </Button>
                {!showJsonPreview && (
                  <>
                    <Button variant="outline" size="sm" onClick={formatJson}>
                      Format
                    </Button>
                    <Button variant="outline" size="sm" onClick={minifyJson}>
                      Minify
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="extractedData">
                JSON Data
                {jsonError && (
                  <span className="text-destructive ml-2">
                    <AlertCircle className="inline h-3 w-3 mr-1" />
                    {jsonError}
                  </span>
                )}
                {!jsonError && editedDocument.extractedDataJson.trim() && (
                  <span className="text-success ml-2">
                    <CheckCircle className="inline h-3 w-3 mr-1" />
                    Valid JSON
                  </span>
                )}
              </Label>
              
              {showJsonPreview ? (
                renderJsonPreview()
              ) : (
                <Textarea
                  id="extractedData"
                  value={editedDocument.extractedDataJson}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  placeholder="Enter JSON data extracted from the document"
                  className="min-h-[300px] font-mono text-sm"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}