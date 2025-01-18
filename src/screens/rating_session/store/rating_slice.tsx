import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';

export const useRating = create(
  persist(
    immer((set) => ({
      error: undefined,
      getRating: async (user_id: string, session_id: string): Promise<IReview | null> => {
        try {
          const { data, error } = await supabase
            .from('users_sessions_reviews')
            .select('*')
            .eq('user_id', user_id)
            .eq('session_id', session_id)
            .single();
      
          if (error) {
            if (error.code === 'PGRST116') {
              // Không có đánh giá nào trong DB
              return null;
            }
            throw error;
          }
      
          return data as IReview;
        } catch (err) {
          console.error('Error fetching rating:', err);
          return null;
        }
      },      
      updateRating: async (user_id: string, session_id: string, rating: number, review: string): Promise<IReview | null> => {
        try {
          const updatedReview: Partial<IReview> = {
            rating,
            review,
          };
      
          const { data, error } = await supabase
            .from('users_sessions_reviews')
            .update(updatedReview)
            .eq('user_id', user_id)
            .eq('session_id', session_id)
            .single();
      
          if (error) {
            throw error;
          }
      
          console.log('Updated rating data: ', data);
          return data as IReview;
        } catch (err) {
          console.error('Error updating rating:', err);
          return null;
        }
      },      
      insertRating: async (user_id: string, session_id: string, rating: number, review: string): Promise<IReview | null> => {
        try {
            const newReview: IReview = {
                user_id: user_id,
                session_id: session_id,
                review: review,
                rating: rating,
            };

            const {data, error} = await supabase
            .from('users_sessions_reviews')
            .insert(newReview)
            .single()

            if (error) {
                throw error;
            }
            console.log('inssert rating data: ', data);
            return data as IReview;
        } catch(err) {
            return null;
        }
      },
    })),
    {
      name: 'rating',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
