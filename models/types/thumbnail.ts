export interface LinkPreviewResponse {
  title: string;
  description: string;
  image: string;
  url: string;
}

export interface BannerObj {
  type: 'banner' | 'color';
  value: string;
}
