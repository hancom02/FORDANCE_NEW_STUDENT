// App.tsx

import React from 'react';
import { SafeAreaView } from 'react-native';
import HomeScreen from './src/screens/home/views/home_screen';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HomeScreen />
    </SafeAreaView>
  );
};

export default App;
