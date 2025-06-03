export type Notebook = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  visibility?: "public" | "private";
  author?: string;
  aspectRatio?: "6:9" | "13:20" | "3:5" | "7:9" | "1:1";
  createdAt: string;
  updatedAt: string;
  styles?: { [key: string]: string | number };
  pages: Page[];
};

export interface Page {
  id: string;
  idx: number; // 0-based index
  notebookId: string;
  isNumberedPage?: boolean;
  pageNumber?: number; // 1-based index
  backgroundImageURL?: string;
  styles?: { [key: string]: string | number };
  contents: ContentBlock[];
}

export interface ContentBlock {
  value: string;
  type: "heading" | "paragraph" | "image";
  styles?: { [key: string]: string | number }; // e.g. { textAlign: "center" }
}
