export interface UploadProgress {
    fileName: string, 
    uploadedParts: number, 
    totalParts: number, 
    percentage: number;
}
