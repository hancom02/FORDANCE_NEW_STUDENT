import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';
import { EStatus } from '../../../types/status_enum';

export const useAccount = create(
  persist(
    immer((set) => ({
      error: undefined,
      getAvatarUrlAndUsername: async (uuid: string): Promise<{ avatar_url: string; username: string }> => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('avatar_url, username')
                .eq('id', uuid)
                .single();
    
            if (error) {
                throw new Error(error.message);
            }
    
            if (!data || !data.avatar_url) {
                console.warn('Avatar URL not found for user:', uuid);
                return { avatar_url: '', username: '' };
            }
    
            return { avatar_url: data.avatar_url, username: data.username };
        } catch (error) {
            console.error('Error in getAvatarUrl:', error.message);
            throw new Error('Failed to get avatar');
        }
        },    
      getQuantitySessionJoin: async (uuid: string): Promise<number> => {
        try {
            const { data, count, error } = await supabase
            .from('users_sessions_joined')
            .select('*', { count: 'exact' })
            .eq('user_id', uuid)
  
            if (error) {
              throw new Error(error.message);
            }
  
            return count || 0;
          } catch (error) {
            console.error('Error in insertFavourite:', error.message);
            throw new Error('Failed to insert favourite');
          }
      },
      getTotalTimeLearn: async (userId: string): Promise<number> => {
        try {
            const { data, error } = await supabase
              .from('users_sessions_joined')  
              .select('longest_watch_time')  
              .eq('user_id', userId);       
        
            if (error) {
              throw error;
            }
        
            // Tính tổng longest_watch_time
            const totalLongestWatchTime = data.reduce((acc, row) => acc + row.longest_watch_time, 0);
            console.log('Total Longest Watch Time for user:', totalLongestWatchTime);
            return totalLongestWatchTime;
        
          } catch (error) {
            console.error('Error fetching data:', error);
            return 0;  // Trả về 0 nếu có lỗi
          }
      },
    })),
    {
      name: 'account',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
