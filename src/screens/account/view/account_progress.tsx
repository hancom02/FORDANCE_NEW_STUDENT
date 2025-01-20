import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useCallback, useEffect, useState } from "react";
import MyColor from "../../../constants/color";
import SizedBox from "../../../components/size_box";
import { useAccount } from "../store/account_slice";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../store/auth_slice";
import { formatTime } from "../../../utils/format_time_util";

const AccountProgressView = () => {
    const navigation = useNavigation();

    const {uuid, logout} = useAuth();
    const {getQuantitySessionJoin, getTotalTimeLearn} = useAccount();

    const [sessionJoinedQuantity, setSessionJoinedQuantity] = useState(0);
    const [totalTimeLern, setTotalTimeLearn] = useState(0);
    const [formatTotalTime, setFormatTotalTime] = useState('');
    const [loading, setLoading] = useState(false);


    //DATA
    const classJoined = 8;
    const lessonCompleted = 10;

    const fetchQuantitySessionJoin = async () => {
    await getQuantitySessionJoin(uuid).then((data) => {
        setSessionJoinedQuantity(data);
    }).catch((err) => {
        console.log('Error:', err);
    });
    };

    const fetchTotalTimeLearn = async () => {
        await getTotalTimeLearn(uuid).then((data) => {
            setTotalTimeLearn(data);
            setFormatTotalTime(formatTime(data))
        }).catch((err) => {
            console.log('Error:', err);
        });
    };
    

    useFocusEffect(
        useCallback(() => {
          setLoading(true);
    
          fetchQuantitySessionJoin();
          fetchTotalTimeLearn();
    
          setLoading(false);
        }, []) 
      );


    const handleNavJoined = () => {
        navigation.navigate('ListJoinSessionScreen');
    }

    const handleNavFavourites = () => {
        navigation.navigate('ListFavSessionScreen')
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.classInfoContainer}>
                <View style={styles.classInfoItem}>
                    <Text style={styles.boldText}>{sessionJoinedQuantity}</Text>
                    <Text style={styles.normalText}>Sessions joined</Text>
                </View>
                <View style={styles.classInfoItem}>
                    <Text style={styles.boldText}>{formatTotalTime}</Text>
                    <Text style={styles.normalText}>Total time learning</Text>
                </View>
            </View>
            <View style={styles.touchContainer}>
                <View style={styles.innerContainer}>
                    <TouchableOpacity style={styles.touchItem} onPress={handleNavFavourites}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Icon name="heart-o" size={18} color={MyColor.black} />
                            <SizedBox width={8} backgroundColor="#D9D9D9"/>
                        <Text style={styles.bottomText}>Favourites</Text>
                        </View>
                            <Icon name="chevron-right" size={18} color={MyColor.black} />
                        </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.touchItem} onPress={handleNavJoined}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Icon name="clock-o" size={22} color="#000"/>
                            <SizedBox width={8} backgroundColor="#D9D9D9"/>
                        <Text style={styles.bottomText}>Joined sessions</Text>
                        </View>
                            <Icon name="chevron-right" size={18} color={MyColor.black} />
                        </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
    },
    classInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 20,
    },
    classInfoItem: {
        flex: 1,
        alignItems: 'center',
    },
    boldText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
    },
    normalText: {
        fontSize: 15,
        color: 'black',
    },
    touchContainer: {
        flexDirection: 'column',
        paddingHorizontal: 16,
        marginTop: 50,
        borderRadius: 20,
    },
    innerContainer: {
        marginHorizontal: 16,
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
    },
    touchItem: {
        marginHorizontal: 16,
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomText: {
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
    },
    divider: {
        height: 0.5,
        backgroundColor: 'grey',
    },
});

export default AccountProgressView;
