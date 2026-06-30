export type TopicStatus = "open" | "exploring" | "resolved";
export type CaptureType = "text" | "figma_link" | "voice";

export interface Topic {
  id: string;
  org_id: string;
  title: string;
  status: TopicStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Capture {
  id: string;
  org_id: string;
  topic_id: string | null;
  created_by: string | null;
  type: CaptureType;
  content: string;
  enriched: boolean;
  enrichment: string | null;
  created_at: string;
}

export interface FigmaRef {
  id: string;
  org_id: string;
  topic_id: string | null;
  figma_url: string;
  file_key: string | null;
  frame_id: string | null;
  snapshot_image_url: string | null;
  fetched_metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Decision {
  id: string;
  org_id: string;
  topic_id: string | null;
  title: string;
  body: string | null;
  pinned: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Audit {
  id: string;
  org_id: string;
  topic_id: string | null;
  kind: string;
  findings: unknown[];
  resolved: boolean;
  created_at: string;
}
