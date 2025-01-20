import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyColor from "../constants/color";

const MyHeader = (props) => {
    const navigation = useNavigation();

    const handleOpenNotifications = () => {
        // navigation.navigate('Notifications');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>FORDANCE</Text>
            <TouchableOpacity onPress={handleOpenNotifications}>
                <Icon name="bell-o" size={28} color={MyColor.black}/>
            </TouchableOpacity>
        </View>
    )
}

export default MyHeader;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 70,
        backgroundColor: MyColor.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderColor: 'grey',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,

    },
    text: {
        fontSize: 20,
        fontWeight: '700',
        color: 'black'
    },
});
