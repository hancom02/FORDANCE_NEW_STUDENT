import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../supabase_config/supabase';

export const useAuth = create(
  persist(
    immer((set) => ({
      isLogin: undefined, 
      gEmail: '',
      signIn: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw new Error(error.message);

          set((state) => {
            state.isLogin = true;
            state.gEmail = data.user.email;
          });
        } catch (err) {
          throw new Error(err.message);
        }
      },
      signUp: async (email, password) => {
        try {
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw new Error(error.message);

          set((state) => {
            state.isLogin = false; 
          });
        } catch (err) {
          throw new Error(err.message);
        }
      },
      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw new Error(error.message);

          set((state) => {
            state.isLogin = false;
            state.gEmail = '';
          });
        } catch (err) {
          throw new Error(err.message);
        }
      },
    })),
    {
      name: 'auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
