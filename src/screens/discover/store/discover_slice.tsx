import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';
import { EStatus } from '../../../types/status_enum';

export const useDiscover = create(
  persist(
    immer((set) => ({
    //   isLogin: undefined, 
    //   email: '',
      error: undefined,
      getAllSession: async (instructorId: string): Promise<ISession[] | null> => {
        try {
            const { data: sessionData, error: sessionError } = await supabase
            .from('sessions')
            .select('*')
            .neq('status', EStatus.Waiting)
            .neq('status', EStatus.Deleted)
            .neq('status', EStatus.Rejected);

            if (sessionError) {
                console.error('Error:', sessionError.message);
                set((state) => {
                  state.error = sessionError.message;
                });
                throw new Error(sessionError.message);
              }
              return sessionData as ISession[];

        } catch (err) {
            throw new Error(err.message);
        }
      },
      getAllClass: async (instructorId: string): Promise<IClass[] | null> => {
        try {  
            const { data: classData, error: classError } = await supabase
              .from('classes')
              .select('*')
            if (classError) {
              console.error('Error:', classError.message);
              set((state) => {
                state.error = classError.message;
              });            
              throw new Error(classError.message);
            }
            return classData as IClass[];
          } catch (err) {
            throw new Error(err.message);
          }
      },  
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
      getJoinedSessions: async (uuid: string): Promise<ISession[] | null> => {
        try {  
          const { data: joinData, error: joinError } = await supabase
            .from('users_sessions_joined')
            .select('*')
            .eq('user_id', uuid)

          if (joinError) {
            console.error('Error:', joinError.message);
            set((state) => {
              state.error = joinError.message;
            });            
            throw new Error(joinError.message);
          }

          if (!joinData || joinData.length === 0) {
            return null; 
          }

          const sessionIds = joinData.map((session) => session.session_id);

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
      name: 'discover',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
