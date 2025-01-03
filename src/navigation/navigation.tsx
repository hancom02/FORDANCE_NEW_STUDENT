import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/home/views/home_screen';
import ClassScreen from '../screens/class/views/class_screen';
import LessionScreen from '../screens/lession/views/lession_screen';
import MyColor from '../constants/color';
import LoginScreen from '../screens/login/views/login_screen';
import SearchScreen from '../screens/search/views/search_screen';
import FilterScreen from '../screens/search/views/filter_screen';
import FavouriteScreen from '../screens/profile/views/FavouriteScreen';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{headerShown: false, tabBarShowLabel: false}}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({}) => ({
          tabBarIcon: ({focused}) => (
            <Icon
              name='home'
              size={24}
              color={focused ? MyColor.primary : 'black'}
            />
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
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="BottomTab" component={BottomTab} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="FavouriteScreen" component={FavouriteScreen} />
        <Stack.Screen name="ClassScreen" component={ClassScreen} />
        <Stack.Screen name="LessionScreen" component={LessionScreen} />
        <Stack.Screen name="FilterScreen" component={FilterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
