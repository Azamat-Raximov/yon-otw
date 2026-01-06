import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Article {
  id: string;
  title: string;
  body: string;
  playlist_id: string | null;
  created_at: string;
}

export const useArticles = (playlistId?: string) => {
  return useQuery({
    queryKey: ['articles', playlistId],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (playlistId) {
        query = query.eq('playlist_id', playlistId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Article[];
    },
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ title, body, playlist_id }: { title: string; body: string; playlist_id: string | null }) => {
      const { data, error } = await supabase
        .from('articles')
        .insert({ title, body, playlist_id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};
