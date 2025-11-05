import { apiClient } from './api-client'

interface UploadResponse {
  url: string
  filename: string
  originalName: string
  size: number
  mimetype: string
}

export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await apiClient.post<UploadResponse>('/uploads/image', formData)

    // Convert relative URL to absolute URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    const baseUrl = apiUrl.replace('/api', '')
    const absoluteUrl = `${baseUrl}${response.url}`

    return {
      url: absoluteUrl,
      filename: response.filename,
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    // Throw the original error with more context
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image'
    throw new Error(`Upload failed: ${errorMessage}`)
  }
}

export async function uploadVideo(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await apiClient.post<UploadResponse>('/uploads/video', formData)

    // Convert relative URL to absolute URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    const baseUrl = apiUrl.replace('/api', '')
    const absoluteUrl = `${baseUrl}${response.url}`

    return {
      url: absoluteUrl,
      filename: response.filename,
    }
  } catch (error) {
    console.error('Error uploading video:', error)
    // Throw the original error with more context
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload video'
    throw new Error(`Upload failed: ${errorMessage}`)
  }
}
