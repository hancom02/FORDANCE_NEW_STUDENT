import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text } from 'react-native';
import HomeScreen from '../screens/home/views/home_screen';
import ClassScreen from '../screens/class/views/class_screen';
import LessionScreen from '../screens/lession/views/lession_screen';
import MyColor from '../constants/color';
import LoginScreen from '../screens/login/views/login_screen';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
      <Tab.Navigator id={undefined} screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
        <Tab.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={({ route }) => ({
                tabBarIcon: ({ focused }) => (
                    <Ionicons name="home-outline" size={24} color={focused ? MyColor.primary : 'black'} />
                ),
            })}
        />
      </Tab.Navigator>
  );
}


export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
        />
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
        />
        <Stack.Screen
          name="ClassScreen"
          component={ClassScreen}
        />
        <Stack.Screen 
          name='LessionScreen'
          component={LessionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
