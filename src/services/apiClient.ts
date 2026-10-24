/**
 * Core API Client for Triphaven / Heaven Connect Frontend
 * Configured with base URL from environment variables and typed HTTP methods.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options;

  let url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const defaultHeaders: HeadersInit = {
    'Accept': 'application/json',
  };

  if (!(restOptions.body instanceof FormData)) {
    (defaultHeaders as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  });

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    const message =
      (errorData && typeof errorData === 'object' && (errorData.detail || errorData.message)) ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new ApiError(message, response.status, errorData);
  }

  // If status is 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, {
      method: 'POST',
      body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
      ...options,
    }),

  put: <T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, {
      method: 'PUT',
      body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
      ...options,
    }),

  patch: <T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};

export default apiClient;
