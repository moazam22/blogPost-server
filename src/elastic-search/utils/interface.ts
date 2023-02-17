export interface PostSearchBody {
  id: string;
  title: string;
  description: string;
  readTime: string | null;
  attachmentUrl: string | null;
  createdAte: Date;
  updatedAt: Date;
  authorName: string;
}

export interface PostToIndexype {
  id: string;
  title: string;
  description: string;
  readTime: string | null;
  attachmentUrl: string | null;
  createdAte: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    passResetKeyExpiry: Date | null | undefined;
  };
}

export interface PostToUpdateType {
  id: string;
  title: string;
  description: string;
  readTime: string | null;
  attachmentUrl: string | null;
  createdAte: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    passResetKeyExpiry: Date | null | undefined;
  };
}

export interface PostSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}
