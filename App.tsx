import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/supabase_config/supabase'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyColor from './src/constants/color';

import LoginScreen from './src/screens/login/views/login_screen';
import { View } from 'react-native';
import HomeScreen from './src/screens/home/views/home_screen';
import ClassScreen from './src/screens/class/views/class_screen';
import LessionScreen from './src/screens/lession/views/lession_screen';
import Navigation from './src/navigation/navigation';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); 
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); 
    });
  }, []);
  
  return (
    <Navigation />
  );
}
