// Generado manualmente. Para regenerar: npx supabase gen types typescript --local
export type StickerType = 'logo' | 'player' | 'team_photo' | 'special'
export type Rarity      = 'common' | 'foil'
export type Section     = 'teams' | 'intro' | 'museum'

export interface Database {
  public: {
    Tables: {
      albums: {
        Row: {
          id:             string
          slug:           string
          name:           string
          description:    string | null
          total_stickers: number
          cover_url:      string | null
          is_active:      boolean
          created_at:     string
        }
        Insert: Omit<Database['public']['Tables']['albums']['Row'], 'id' | 'created_at'>
          & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['albums']['Insert']>
        Relationships: []
      }
      sections: {
        Row: {
          id:            string
          album_id:      string
          key:           string
          label:         string
          icon:          string | null
          display_order: number
        }
        Insert: Omit<Database['public']['Tables']['sections']['Row'], 'id'>
          & { id?: string }
        Update: Partial<Database['public']['Tables']['sections']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'sections_album_id_fkey'
            columns: ['album_id']
            isOneToOne: false
            referencedRelation: 'albums'
            referencedColumns: ['id']
          }
        ]
      }
      stickers: {
        Row: {
          id:               string
          album_id:         string
          code:             string
          number:           number
          team:             string
          team_code:        string | null
          player_name:      string | null
          player_image_url: string | null
          sticker_type:     StickerType
          rarity:           Rarity
          section:          Section
          flag_code:        string | null
        }
        Insert: Omit<Database['public']['Tables']['stickers']['Row'], 'id'>
          & { id?: string }
        Update: Partial<Database['public']['Tables']['stickers']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'stickers_album_id_fkey'
            columns: ['album_id']
            isOneToOne: false
            referencedRelation: 'albums'
            referencedColumns: ['id']
          }
        ]
      }
      profiles: {
        Row: {
          id:         string
          username:   string
          avatar_url: string | null
          is_public:  boolean
          created_at: string
        }
        Insert: {
          id:          string
          username:    string
          avatar_url?: string | null
          is_public?:  boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      user_stickers: {
        Row: {
          user_id:    string
          sticker_id: string
          quantity:   number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_stickers']['Row'], 'updated_at'>
          & { updated_at?: string }
        Update: Partial<Database['public']['Tables']['user_stickers']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'user_stickers_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_stickers_sticker_id_fkey'
            columns: ['sticker_id']
            isOneToOne: false
            referencedRelation: 'stickers'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views:          Record<never, never>
    Functions:      Record<never, never>
    Enums:          Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
