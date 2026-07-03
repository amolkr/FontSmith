import type { FontAsset, HistoryEvent, ProcessingResponse, UploadResponse, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(error.detail ?? "Something went wrong");
  }
  return response.json() as Promise<T>;
}

export const api = {
  me: () => request<User>("/users/me"),
  stats: () => request<{ fontsCreated: number; downloads: number; favorites: number; plan: string }>("/users/me/stats"),
  upload: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<UploadResponse>("/uploads", { method: "POST", body: form });
  },
  process: (uploadId: string) => request<ProcessingResponse>(`/uploads/${uploadId}/process`, { method: "POST" }),
  generate: (uploadId?: string, name = "My FontSmith") => {
    const params = new URLSearchParams({ name });
    if (uploadId) params.set("upload_id", uploadId);
    return request<FontAsset>(`/fonts/generate?${params.toString()}`, { method: "POST" });
  },
  fonts: () => request<FontAsset[]>("/fonts"),
  history: () => request<HistoryEvent[]>("/history"),
  renameFont: (fontId: string, name: string) =>
    request<FontAsset>(`/fonts/${fontId}/rename`, { method: "PATCH", body: JSON.stringify({ name }) }),
  favoriteFont: (fontId: string, favorite: boolean) =>
    request<FontAsset>(`/fonts/${fontId}/favorite`, { method: "PATCH", body: JSON.stringify({ favorite }) }),
  deleteFont: (fontId: string) => request<{ deleted: boolean }>(`/fonts/${fontId}`, { method: "DELETE" })
};

export function downloadUrl(path?: string | null) {
  if (!path) return "#";
  return `${API_URL.replace(/\/api$/, "")}${path}`;
}
