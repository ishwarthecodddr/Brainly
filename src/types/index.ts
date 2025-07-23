export interface SavedLink {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  platform: 'youtube' | 'twitter' | 'linkedin' | 'other';
  tags: string[];
  createdAt: Date;
  metadata?: {
    duration?: string;
    likes?: string;
    reactions?: string;
    views?: string;
  };
}

export interface LinkPreview {
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  platform: 'youtube' | 'twitter' | 'linkedin' | 'other';
  metadata?: {
    duration?: string;
    likes?: string;
    reactions?: string;
    views?: string;
  };
}