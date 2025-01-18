import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';
import { EStatus } from '../../../types/status_enum';

export const useInstructorProfile = create(
  persist(
    immer((set) => ({
    //   isLogin: undefined, 
    //   email: '',
      error: undefined,    
      getProfile: async (uuid: string): Promise<IInstructorProfile | null> => {
        try {
            const {data, error} = await supabase
            .from('users')
            .select('*')
            .eq('id', uuid)
            .single()

            if (error) {
                throw new Error(error.message);
            }
            console.log('Profile infor: ', data);  
            return data;
        } catch (err) {
            throw new Error(err.message);
        }
      },
      getSessionByInstructor: async (instrutorId: string): Promise<ISession[] | null> => {
        try {
          console.log('Fetching sessions for instructor:', instrutorId);

          const { data: sessionData, error: sessionError } = await supabase
            .from('sessions')
            .select('*')
            .eq('instructor_id', instrutorId)
            .neq('status', EStatus.Deleted)
            .neq('status', EStatus.Waiting)
            .neq('status', EStatus.Rejected);
            
          if (sessionError) {
            console.error('Error:', sessionError.message);
            set((state) => {
              state.error = sessionError.message;
            });
            throw new Error(sessionError.message);
          }
          console.log('session list instructor data: ', sessionData)
          return sessionData as ISession[];
        } catch (err) {
          throw new Error(err.message);
        }
      },
    })),
    {
      name: 'instructor-profile',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
