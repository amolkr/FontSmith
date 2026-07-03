export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  plan: string;
};

export type FontAsset = {
  id: string;
  name: string;
  status: "ready" | "generating" | "failed";
  preview_text: string;
  download_count: number;
  favorite: boolean;
  created_at: string;
  ttf_url?: string | null;
  otf_url?: string | null;
};

export type HistoryEvent = {
  id: string;
  fontId?: string;
  action: string;
  createdAt: string;
};

export type UploadResponse = {
  uploadId: string;
  filename: string;
  status: string;
};

export type ProcessingResponse = {
  uploadId: string;
  status: string;
  stages: string[];
  character_count: number;
  characters: string[];
};

