import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../../../supabase_config/supabase';
import { Alert } from 'react-native';

export const useSession = create(
  persist(
    immer((set) => ({
    //   isLogin: undefined, 
    //   email: '',
      error: undefined,    
      getSession: async (session_id: string): Promise<ISession | null> => {
        try {
          console.log('Fetching sessions for instructor:', session_id);

          const { data: sessionData, error: sessionError } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', session_id)
            .single()
            
          if (sessionError) {
            console.error('Error:', sessionError.message);
            set((state) => {
              state.error = sessionError.message;
            });
            throw new Error(sessionError.message);
          }
          return sessionData as ISession;
        } catch (err) {
          throw new Error(err.message);
        }
      },
      checkIfRowFavExists: async (session_id: string, user_id: string): Promise<{ exists: boolean; is_favourite?: boolean }> => {
        try {
          const { data, error }: { data: { result_video_url: string }[]; error: any } = await supabase
            .from('users_sessions_favourite')
            .select('is_favourite')
            .eq('user_id', user_id)
            .eq('session_id', session_id)
            .single();
      
          if (error && error.code === 'PGRST116') {
            // Nếu không tìm thấy row
            return { exists: false };
          } else if (error) {
            throw new Error(error.message);
          }
      
          // Nếu row tồn tại, trả về trạng thái is_favourite
          return { exists: true, is_favourite: data?.is_favourite };
        } catch (err) {
          console.error('Error in checkIfRowExists:', err.message);
          throw new Error('Failed to check row existence');
        }
      },      
      getIsFavSession: async (session_id: string, user_id: string): Promise<boolean> => {
        try {
          const { data, error } = await supabase
            .from('users_sessions_favourite')
            .select('is_favourite')
            .eq('user_id', user_id)
            .eq('session_id', session_id)
            .single();
      
          if (error) {
            if (error.code === 'PGRST116') {
              // Không có row tương ứng
              return false;
            }
            throw new Error(error.message);
          }
      
          return data?.is_favourite || false;
        } catch (err) {
          console.error('Error in getIsFavSession:', err.message);
          throw new Error('Failed to get favourite status');
        }
      },
      getFavSessionQuantity: async (session_id: string): Promise<number> => {
        try {
          const { data, count, error } = await supabase
          .from('users_sessions_favourite')
          .select('*', { count: 'exact' })
          .eq('session_id', session_id)
          .eq('is_favourite', true);

          if (error) {
            throw new Error(error.message);
          }

          return count || 0;
        } catch (error) {
          console.error('Error in insertFavourite:', err.message);
          throw new Error('Failed to insert favourite');
        }
      },
      insertFavourite: async (session_id: string, user_id: string): Promise<void> => {
        try {
          const {data, error } = await supabase
            .from('users_sessions_favourite')
            .insert([
              {
                user_id: user_id,
                session_id: session_id,
                is_favourite: true,
              },
            ]);
      
          if (error) {
            throw new Error(error.message);
          }
      
          console.log('Favourite added successfully');
        } catch (err) {
          console.error('Error in insertFavourite:', err.message);
          throw new Error('Failed to insert favourite');
        }
      },
      updateFavourite: async (session_id: string, user_id: string, is_favourite: boolean): Promise<void> => {
        try {
          const {data, error } = await supabase
            .from('users_sessions_favourite')
            .update({ is_favourite: is_favourite })
            .eq('user_id', user_id)
            .eq('session_id', session_id);
      
          if (error) {
            throw new Error(error.message);
          }
      
          console.log('Favourite updated successfully');
        } catch (err) {
          console.error('Error in updateFavourite:', err.message);
          throw new Error('Failed to update favourite');
        }
      },      
      getRatingSession: async (session_id: string): Promise<number> => {
        try {
          const { data, error } = await supabase
            .from('users_sessions_joined')
            .select('rating')
            .eq('session_id', session_id);
      
          if (error) {
            console.error('Error fetching ratings:', error.message);
            throw new Error(error.message);
          }
      
          if (!data || data.length === 0) {
            return 0; // Trả về 0 nếu không có dữ liệu
          }
      
          // Lọc ra những rating khác 0
          const validRatings = data.filter(row => row.rating > 0);
          
          if (validRatings.length === 0) {
            return 0; // Nếu không còn rating hợp lệ thì trả về 0
          }
      
          const totalRating = validRatings.reduce((sum, row) => sum + (row.rating || 0), 0);
          const averageRating = totalRating / validRatings.length;
      
          return parseFloat(averageRating.toFixed(1)); // Làm tròn về 1 chữ số thập phân
        } catch (err) {
          console.error('Catch Error:', err.message);
          throw new Error('Failed to calculate rating');
        }
      },
      insertVideoResult: async (
        user_id: string,
        result_video_url: string,
        session_id: string
      ): Promise<string> => {
        try {
          const { data, error } = await supabase
            .from('users_sessions_joined')
            .update({ result_video_url })
            .match({ user_id, session_id })
            .select(); 
      
          if (error) {
            console.error('Error inserting video result:', error.message);
            throw new Error(`Error inserting video result: ${error.message}`);
          }
      
          if (!data || data.length === 0) {
            throw new Error('No matching row found to update');
          }
      
          console.log('Video result inserted successfully:', data);
      
          return data[0]?.result_video_url || ''; // Trả về video URL nếu có
        } catch (err) {
          console.error('Catch Error:', err.message || err);
          throw new Error(err.message || 'Failed to insert video result');
        }
      }, 
      // getInstructorFeedback: async (sessionId: string, userId: string): Promise<string | null> => {
      //   try {
      //     const { data, error } = await supabase
      //     .from('users_sessions_joined')
      //     .select('teacher_feedback')
      //     .eq('user_id', userId)
      //     .eq('session_id', sessionId)
      //     .single();

      //     if (error) {
      //       console.error('Error:', error.message);
      //       set((state) => {
      //         state.error = error.message;
      //       });
      //       throw new Error(error.message);
      //     }
      //     return data;

      //   } catch (err) {

      //   }
      // },
      getInstructor: async (instructorId: string): Promise<IInstructor | null> => {
        try {
            const { data: instructorData, error: classError } = await supabase
            .from('users')
            .select('id, username, avatar_url')
            .eq('id', instructorId)
            .single(); 

            // console.log('getInstructor, instructorId: ', instructorId);

            if (classError) {
              console.error('Error:', classError.message);
              set((state) => {
                state.error = classError.message;
              });
              throw new Error(classError.message);
            }
            return instructorData as IInstructor;
        }catch(err) {
          throw new Error(err.message);
        };
      },
      getAllClass: async (instructorId: string): Promise<IClass[] | null> => {
        try {
          console.log('Fetching sessions for instructor:', instructorId);

          const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('id, class_name, level, genre')
            .match({ instructor_id: instructorId });    

          if (classError) {
            console.error('Error:', classError.message);
            set((state) => {
              state.error = classError.message;
            });            
            throw new Error(classError.message);
          }
        //   console.log('getClass:', classData);
          return classData as IClass[];
        } catch (err) {
          throw new Error(err.message);
        }
      },
      getJoinedData: async (session_id: string, student_id: string): Promise<IJoin | false> => {
        try {
          const { data, error } = await supabase
            .from('users_sessions_joined')
            .select('*')
            .eq('session_id', session_id)
            .eq('user_id', student_id)
            .single();
      
          if (error && error.code === 'PGRST116') {
            // Lỗi không tìm thấy row, trả về false
            return false;
          } else if (error) {
            // Xử lý các lỗi khác
            throw new Error(error.message);
          }
      
          console.log('Student joined: ', data);
          return data as IJoin; // Trả về dữ liệu nếu tìm thấy
        } catch (err) {
          console.error('Error in fetchJoinedData:', err.message);
          throw new Error('Failed to fetch joined data');
        }
      },  
      insertJoinSession: async (joinedData: IJoin): Promise<IJoin | false> => {
        try {
          const { data, error } = await supabase
            .from('users_sessions_joined')
            .insert(joinedData)
            .single(); 
      
          if (error) {
            console.error('Error inserting joined session:', error.message);
            return false; // Trả về false nếu có lỗi
          }
      
          console.log('Successfully inserted joined session:', data);
          return data as IJoin;
        } catch (err) {
          console.error('Error in insertJoinSession:', err.message);
          throw new Error('Failed to insert joined session');
        }
      },
      updateProgressSession: async (
        session_id: string, 
        user_id: string, 
        last_watch_time: number, 
        longest_watch_time: number,
        // progress: number,
      ): Promise<IJoin | false> => {
        try {
          if (!session_id || !user_id) {
            console.error('Invalid session data');
            return false;
          }
      
          const { data, error } = await supabase
            .from('users_sessions_joined')
            .update({
              last_watch_time: last_watch_time,
              longest_watch_time: longest_watch_time,
            })
            .eq('user_id', user_id)
            .eq('session_id', session_id)
            .single();
      
          if (error) {
            console.error('Error updating session progress:', error);
            return false;
          }
      
          console.log('Session progress updated successfully:', data);
          return data as IJoin;
        } catch (err) {
          console.error('Error in updateJoinedSession:', err);
          return false;
        }
      },         
      fetchComments: async (session_id: string): Promise<IComment[] | null> => {
        try {
          const {data: cmtDta, error: cmtError} = await supabase
          .from('comments')
          .select('*')
          .eq('session_id', session_id)

          if (cmtError) {
              throw new Error(cmtError.message);
          }
          // console.log('comments from table comments: ', cmtDta);

          const commentsWithUserInfo: IComment[] = [];
          for (const comment of cmtDta) {
              const { data: userData, error: userError } = await supabase
                  .from('users')
                  .select('username, avatar_url')
                  .eq('id', comment.user_id)
                  .single();

              if (userError) {
                  throw new Error(userError.message);
              }
              const commentWithUser: IComment = {
                  ...comment, 
                  username: userData?.username || '', 
                  avatar_url: userData?.avatar_url || '', 
              };
              commentsWithUserInfo.push(commentWithUser);
          }
          // console.log('comments with user infor: ', commentsWithUserInfo);

          return commentsWithUserInfo;
        } catch (err) {
            throw new Error(err.message);
        }   
      },
    })),
    {
      name: 'session',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
