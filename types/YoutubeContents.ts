export interface Video {
  id: string;
  title: string;
  uploader: string;
  views: number;
  thumbnail: string;
  duration: number;
  isShort: boolean;
  description: string;
  tags: string[]; // 태그 추가
}