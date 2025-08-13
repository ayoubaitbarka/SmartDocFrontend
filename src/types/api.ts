export interface DocumentDTO {
  id: string;
  fileName: string;
  docType: string;
  createdAt: string;
  status: string;
  extractedDataJson: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}