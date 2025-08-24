const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// generic request handler
async function doRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const raw = await res.text();
  let data: any = raw;
  try {
    data = raw ? JSON.parse(raw) : undefined;
  } catch {}

  if (!res.ok) {
    const msg = (data && data.message) || `Error ${res.status}`;
    const error = new Error(msg) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }

  return data as T;
}

// for public routes
export async function publicFetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  return doRequest<T>(path, options);
}

// for protected routes with refresh logic
export async function protectedFetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    return await doRequest<T>(path, options);
  } catch (err: any) {
    if (err.status === 401) {
      try {
        await doRequest('/auth/refresh', { method: 'POST' });
        return await doRequest<T>(path, options);
      } catch (refreshErr) {
        throw refreshErr;
      }
    }
    throw err;
  }
}