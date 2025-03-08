export interface Video {
    id: string;
    title: string;
    uploader: string;
    views: number;
    thumbnail: string;
    status?: string;
    embeddable?: boolean;
  }