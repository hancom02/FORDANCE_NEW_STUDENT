import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../supabase_config/supabase';

export const useAuth = create(
  persist(
    immer((set) => ({
      isLogin: undefined, 
      uuid: '',
      username: '',
      email: '',
      error: undefined,
      signIn: async (email, password) => {
        try {
          const { data: getUserData, error: getUserError } = await supabase
            .from('users')
            .select('*')
            .match({ email: email, role: 'student' });      
          if (getUserError) {
            console.error('Error:', getUserError.message);
            set((state) => {
              state.isLogin = false;
              state.error = getUserError.message;
            });            
            return;
          }
          if (getUserData.length === 0) {
            console.log('No user found with the provided email and role.');
            // Alert.alert('Error', 'No user found with the provided email and role.');
            set((state) => {
              state.isLogin = false;
              state.error = 'No user found with the provided email and role';
            }); 
            return;
          }
          if (getUserData.length === 1) {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
              email,
              password
            });      
            if (authError) {
              set((state) => {
                state.isLogin = false;
                state.error = authError.message;
              }); 
              // throw new Error(authError.message);
              return;
            }      
            set((state) => {
              state.isLogin = true;
              state.uuid = authData.user.id;
              state.username = getUserData[0].username;
              state.email = authData.user.email;
            });      
          } else {
            console.log('Multiple users found with the same email and role.');
            set((state) => {
              state.isLogin = false;
              state.error = 'Multiple users found with the same email and role.';
            });           }      
        } catch (err) {
          console.error('Sign in error:', err.message);
          Alert.alert('Error', err.message);
        }
      },      
      signUp: async (email, password) => {
        try {
          if (typeof password !== 'string' || password.trim() === '') {
            throw new Error('Password must be a non-empty string');
          }
          // const saltRounds = 10;
          // if (!Number.isInteger(saltRounds)) {
          //   throw new Error('Invalid salt rounds');
          // }
          // const hashedPassword = await bcrypt.hash('hancom02', saltRounds);
          // console.log("hashedPassword: " + hashedPassword);

          // const {data, error } = await supabase.auth.signUp({ email, password});
         

          const { data, error } = await supabase.auth.signUp(
            {
              email: email,
              password: password,
              options: {
                data: {
                  role:'student',
                }
              }
            }
          )
          if (error) throw new Error(error.message);
          console.log('User signed up successfully:', data.user.email);

          // const { error: insertError } = await supabase.from('users').insert([
          //   {
          //     id: data.user.id, 
          //     created_at: data.user.created_at || new Date(), 
          //     email: data.user.email,
          //     password: '', 
          //     username: username, 
          //     role: 'student', 
          //   },
          // ]);
      
          // if (insertError) throw new Error(insertError.message);
      
          console.log('User profile created in users table successfully');

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
