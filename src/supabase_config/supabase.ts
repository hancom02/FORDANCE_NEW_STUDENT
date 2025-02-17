import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dkasnzwgahkgoczktpfe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYXNuendnYWhrZ29jemt0cGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNjEzMDMsImV4cCI6MjA0NjczNzMwM30.qzoF0VafeuIavRmpTsxzAzZvY7C-vZccexQ4b1MUIKI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})