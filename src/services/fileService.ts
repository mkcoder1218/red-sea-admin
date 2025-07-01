import { apiMethods, handleApiError } from '@/lib/api'

// File upload types
export interface FileUploadResponse {
  status: number
  message: string
  data: FileData[]
}

export interface FileData {
  id: string
  name: string
  type: string
  size: number
  path: string
  updatedAt: string
  createdAt: string
  deletedAt: null | string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// File service class
export class FileService {
  // Upload multiple files
  static async uploadFiles(
    files: File[],
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResponse> {
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })

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

  // Delete file by ID
  static async deleteFile(fileId: string): Promise<{ message: string }> {
    try {
      return await apiMethods.delete(`/files/${fileId}`)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Get file info by ID
  static async getFileInfo(fileId: string): Promise<FileData> {
    try {
      return await apiMethods.get(`/files/${fileId}`)
    } catch (error) {
      throw handleApiError(error)
    }
  }
}

export default FileService
