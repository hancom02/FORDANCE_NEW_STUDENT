import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../../store/auth_slice';
import AccountTopTabs from '../navigation/account_nav';
import { useAccount } from '../store/account_slice';
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';


const AccountNewScreen = () => {
    const {uuid, logout} = useAuth();
    const {getAvatarUrlAndUsername} = useAccount();

    const [avaUrl, setAvaUrl] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchAvaUrl = async () => {
        await getAvatarUrlAndUsername(uuid).then((data: { avatar_url: string, username: string }) => {
            setAvaUrl(data.avatar_url);
            setUsername(data.username);
        }).catch((err) => {
            console.log('Error:', err);
        });
        };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);

            fetchAvaUrl();

            setLoading(false);
        }, []) 
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userContainer}>
        <View style={styles.userInfoContainer}>
          {/* <View style={styles.circle}>
          </View> */}
          <Image source={{uri: avaUrl}} style={styles.avatar} /> 
          <Text style={styles.userName}>{username}</Text> 
        </View>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="settings-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        <AccountTopTabs />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingBottom: 16,
    borderColor: 'grey',
    borderBottomWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'grey',
    marginRight: 20,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'black',
  },
  icon: {
    marginRight: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  normalText: {
    fontSize: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    marginLeft: 20,
    borderRadius: 60,
    marginRight: 12,
  },
});

export default AccountNewScreen;
