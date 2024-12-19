// // App.tsx

// import React from 'react';
// import { SafeAreaView } from 'react-native';
// import HomeScreen from './src/screens/home/views/home_screen';

// const App = () => {
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <HomeScreen />
//     </SafeAreaView>
//   );
// };

// export default App;

import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import LoginScreen from './src/screens/login/views/login_screen'
import { supabase } from './src/supabase_config/supabase'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View>
      <LoginScreen />
      {session && session.user && <Text>{session.user.id}</Text>}
    </View>
  )
}