import { env } from '@shared/config/env';

const API_URL = env.apiUrl;

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async patch<T>(path: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async delete(path: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}

export const apiClient = new ApiClient();
