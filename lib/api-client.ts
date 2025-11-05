"use client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`
    const token = this.getToken()

    // Build headers - don't set Content-Type for FormData (browser will set it with boundary)
    const headers: Record<string, string> = {}
    
    // Add existing headers from options (except Content-Type if FormData)
    if (options.headers) {
      const optionHeaders = options.headers as Record<string, string>
      Object.keys(optionHeaders).forEach(key => {
        if (!(options.body instanceof FormData && key === 'Content-Type')) {
          headers[key] = optionHeaders[key]
        }
      })
    }

    // Add Content-Type for non-FormData
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    // Add Authorization token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        // Check various possible error message fields
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = typeof errorData.error === 'string' 
            ? errorData.error 
            : JSON.stringify(errorData.error);
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      } catch (e) {
        // If JSON parsing fails, keep the HTTP status message
        console.error('Failed to parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    return response.json()
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    // Check if data is FormData, if so don't stringify
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined)
    
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body,
    })
  }

  async put<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()