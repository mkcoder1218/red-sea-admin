import { apiMethods, handleApiError } from '@/lib/api'

// File upload types
export interface FileUploadResponse {
  status: number
  message: string
  data: {
    id: string
    path: string
    originalName: string
    size: number
    mimeType: string
    createdAt: string
  }
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// File service class
export class FileService {
  // Upload single file to /files/single endpoint
  static async uploadSingleFile(
    files: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResponse> {
    try {
      const formData = new FormData()
      formData.append('files', files)

      const response = await apiMethods.post<FileUploadResponse>('/files/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
            }
            onProgress(progress)
          }
        }
      })

      return response
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Upload multiple files sequentially
  static async uploadMultipleFiles(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void,
    onFileComplete?: (fileIndex: number, fileId: string) => void
  ): Promise<string[]> {
    const fileIds: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        const response = await this.uploadSingleFile(file, (progress) => {
          onProgress?.(i, progress)
        })
        
        fileIds.push(response.data.id)
        onFileComplete?.(i, response.data.id)
      } catch (error) {
        throw new Error(`Failed to upload file ${file.name}: ${error}`)
      }
    }

    return fileIds
  }

  // Delete file by ID
  static async deleteFile(fileId: string): Promise<{ message: string }> {
    try {
      return await apiMethods.delete(`/files/${fileId}`)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Get file info by ID
  static async getFileInfo(fileId: string): Promise<FileUploadResponse['data']> {
    try {
      return await apiMethods.get(`/files/${fileId}`)
    } catch (error) {
      throw handleApiError(error)
    }
  }
}

export default FileService
