import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Article {
  id: string;
  title: string;
  body: string;
  playlist_id: string | null;
  user_id: string;
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

export const useArticle = (id?: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Article;
    },
    enabled: !!id,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ title, body, playlist_id }: { title: string; body: string; playlist_id: string | null }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('articles')
        .insert({ title, body, playlist_id, user_id: user.id })
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

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, title, body, playlist_id }: { id: string; title: string; body: string; playlist_id: string | null }) => {
      const { data, error } = await supabase
        .from('articles')
        .update({ title, body, playlist_id })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', variables.id] });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};
