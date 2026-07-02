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
  plain_text_length: number;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type ColumnWithAuthor = Column & {
  profiles: Pick<Profile, "user_id" | "display_name" | "avatar_url" | "bio">;
};

export type ColumnListItem = Pick<
  Column,
  "id" | "title" | "created_at" | "plain_text_length" | "status"
>;

export type ColumnListItemWithAuthor = ColumnListItem & {
  profiles: Pick<Profile, "user_id" | "display_name">;
};

export type ColumnLike = {
  id: string;
  user_id: string;
  column_id: string;
  created_at: string;
};

export type ColumnViewSession = {
  column_id: string;
  viewer_key: string;
  created_at: string;
};

export type UserFollow = {
  id: string;
  follower_id: string;
  following_id: string;
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
          plain_text_length?: number;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          char_limit?: number;
          status?: "draft" | "published";
          plain_text_length?: number;
          view_count?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "columns_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
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
      column_view_sessions: {
        Row: ColumnViewSession;
        Insert: {
          column_id: string;
          viewer_key: string;
          created_at?: string;
        };
        Update: {
          column_id?: string;
          viewer_key?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_follows: {
        Row: UserFollow;
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      record_column_view: {
        Args: {
          p_column_id: string;
          p_viewer_key: string;
        };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
