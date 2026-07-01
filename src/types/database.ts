export type Profile = {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Column = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  char_limit: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type ColumnWithAuthor = Column & {
  profiles: Pick<Profile, "user_id" | "display_name" | "avatar_url">;
};

export type ColumnListItem = Pick<
  Column,
  "id" | "title" | "created_at" | "content" | "status"
>;

export type ColumnLike = {
  id: string;
  user_id: string;
  column_id: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          user_id: string;
          display_name: string;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          display_name?: string;
          bio?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      columns: {
        Row: Column;
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          content: string;
          char_limit: number;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          char_limit?: number;
          status?: "draft" | "published";
          updated_at?: string;
        };
        Relationships: [];
      };
      column_likes: {
        Row: ColumnLike;
        Insert: {
          id?: string;
          user_id: string;
          column_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          column_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
