import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api';
import { DocumentDTO } from '@/types/api';
import { toast } from '@/hooks/use-toast';

// Query keys
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters?: string) => [...documentKeys.lists(), { filters }] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
};

// List documents hook
export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.list(),
    queryFn: async () => {
      const { data } = await documentsApi.list();
      return data;
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get document by ID hook
export function useDocument(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: async () => {
      const { data } = await documentsApi.getById(id);
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Upload document mutation
export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => documentsApi.upload(file),
    onSuccess: (response) => {
      // Invalidate and refetch documents list
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      
      toast({
        title: "Upload Successful",
        description: `File "${response.data.fileName}" has been processed successfully.`,
      });
      
      return response.data;
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Update document mutation
export function useUpdateDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, document }: { id: string; document: DocumentDTO }) =>
      documentsApi.update(id, document),
    onSuccess: (response, variables) => {
      // Update the specific document in cache
      queryClient.setQueryData(
        documentKeys.detail(variables.id),
        response.data
      );
      
      // Invalidate list to show updated data
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      
      toast({
        title: "Document Updated",
        description: "Your changes have been saved successfully.",
      });
      
      return response.data;
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update document. Please try again.",
        variant: "destructive",
      });
    },
  });
}