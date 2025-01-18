import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/home/views/home_screen';
import LessionScreen from '../screens/lession/views/lession_screen';
import MyColor from '../constants/color';
import LoginScreen from '../screens/login/views/login_screen';
import SearchScreen from '../screens/search/views/search_screen';
import FilterScreen from '../screens/search/views/filter_screen';
import DiscoverScreen from '../screens/discover/view/discover_screen';
import RatingScreen from '../screens/rating_session/view/rating_session_screen';
import ClassNewScreen from '../screens/class_new/view/class_new_screen';
import CommunityScreen from '../screens/community/view/community_screen';
import ProfileScreen from '../screens/profile/view/profile_screen';
import SettingScreen from '../screens/account/view/account_screen';
import InstructorProfileScreen from '../screens/instructor_profile/instructor_profile_screen';
import ListFavSessionScreen from '../screens/list_fav_session/view/list_fav_session_screen';
import ListJoinSessionScreen from '../screens/list_join_session/view/list_join_session_screen';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{headerShown: false, tabBarShowLabel: false}}>
      <Tab.Screen
        name="DiscoverScreen"
        component={DiscoverScreen}
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
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({}) => ({
          tabBarIcon: ({focused}) => (
            <Icon
              name='book'
              size={24}
              color={focused ? MyColor.primary : 'black'}
            />
          ),
        })}
      />
      <Tab.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={({}) => ({
          tabBarIcon: ({focused}) => (
            <Icon
              name='user'
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
        <Stack.Screen name="ClassNewScreen" component={ClassNewScreen} />
        <Stack.Screen name="LessionScreen" component={LessionScreen} />
        <Stack.Screen name="RatingScreen" component={RatingScreen} />
        <Stack.Screen name="CommunityScreen" component={CommunityScreen}/>
        <Stack.Screen name="FilterScreen" component={FilterScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="InstructorProfileScreen" component={InstructorProfileScreen} />
        <Stack.Screen name="ListFavSessionScreen" component={ListFavSessionScreen} />
        <Stack.Screen name="ListJoinSessionScreen" component={ListJoinSessionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
