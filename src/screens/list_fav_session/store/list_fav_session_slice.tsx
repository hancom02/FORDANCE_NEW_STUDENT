import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';
import { EStatus } from '../../../types/status_enum';

export const useFavListSession = create(
  persist(
    immer((set) => ({
    //   isLogin: undefined, 
    //   email: '',
      error: undefined,
      getFavSession: async (uuid: string): Promise<ISession[] | null> => {
        try {  
          const { data: favData, error: favError } = await supabase
            .from('users_sessions_favourite')
            .select('*')
            .eq('user_id', uuid)

          if (favError) {
            console.error('Error:', favError.message);
            set((state) => {
              state.error = favError.message;
            });            
            throw new Error(favError.message);
          }

          if (!favData || favData.length === 0) {
            return null; 
          }

          const sessionIds = favData.map((session) => session.session_id);

          const { data: sessions, error: sessionsError } = await supabase
            .from('sessions')
            .select('*')
            .in('id', sessionIds);
      
          if (sessionsError) {
            console.error('Error:', sessionsError.message);
            set((state) => {
              state.error = sessionsError.message;
            });
            throw new Error(sessionsError.message);
          }
      
          return sessions as ISession[];
        } catch (err) {
          throw new Error(err.message);
        }
      },
    })),
    {
      name: 'fav-list-session',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
