import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AccountProgressView from '../view/account_progress';
import AccountSettingView from '../view/account_setting';

const AccountTopTab = createMaterialTopTabNavigator();

function AccountTopTabs() {

    return (
        <AccountTopTab.Navigator
            id={undefined}
            screenOptions={{
                tabBarStyle: styles.containerStyle,
                tabBarIndicatorStyle: { backgroundColor: 'black' },
                tabBarLabelStyle: styles.label,
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'grey',
                tabBarGap: 10,
            }}
        >
            <AccountTopTab.Screen
                name="AccountProgressView"
                component={AccountProgressView}
                options={{
                    tabBarLabel: 'My Progress',
                    tabBarAccessibilityLabel: 'true',
                }}
            />
            <AccountTopTab.Screen
                name="AccountSettingView"
                component={AccountSettingView}
                options={{
                    tabBarLabel: 'My Account',
                    tabBarAccessibilityLabel: 'true',
                }}
            />
        </AccountTopTab.Navigator>
        // <Text>aaa</Text>
    );
}
const styles = StyleSheet.create({
    containerStyle: {
        width: '100%'
    },
    label: {
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'none',
    },
});

export default AccountTopTabs;