import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
  } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../../store/auth_slice';

  
  const AccountSettingView = props => {
    const {navigation, categories} = props;
  
    const {logout} = useAuth();
  
    const handleNavAccountSetting = () => {
      navigation.navigate('ProfileScreen');
    };
  
    const handleNavDancePreference = () => {
    //   navigation.navigate('DancePreference');
    //   -----------------------------------------------------------------------
    };
  
    const handleNavFeedback = () => {
    //   navigation.navigate('Feedback');
    };
  
    const handleNavIntroduce = () => {
      navigation.navigate('IntroduceScreen'); 
    //   -----------------------------------------------------
    };
  
    const handleLogOut = async () => {
        await logout().then(() => {
            navigation.navigate('LoginScreen');
        });
    };
  
    const classJoined = 8;
    const lessonCompleted = 10;
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.touchContainer}>
          <Text style={styles.textHeader}>Account Setting</Text>
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={styles.touchItem}
              onPress={handleNavDancePreference}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.bottomText}>Dance Preference</Text>
              </View>
              <Icon name="chevron-right" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchItem}
              onPress={handleNavAccountSetting}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.bottomText}>Account Setting</Text>
              </View>
              <Icon name="chevron-right" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.touchContainer}>
          <Text style={styles.textHeader}>About Application</Text>
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={styles.touchItem}
              onPress={handleNavIntroduce}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.bottomText}>Introduce</Text>
              </View>
              <Icon name="chevron-right" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchItem}
              onPress={handleNavFeedback}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.bottomText}>Feedback</Text>
              </View>
              <Icon name="chevron-right" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchItem} onPress={handleLogOut}>
              <View>
                <Text style={styles.bottomText}>Log out</Text>
              </View>
            </TouchableOpacity>
          </View>
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
      marginTop: 40,
    },
    innerContainer: {
      marginHorizontal: 16,
      borderRadius: 20,
    },
    touchItem: {
      marginVertical: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bottomText: {
      fontSize: 16,
      color: 'black',
      fontWeight: '400',
    },
    textHeader: {
      marginLeft: 16,
      marginBottom: 10,
      fontSize: 25,
      fontWeight: 'bold',
      color: 'black',
    },
  });
  
  export default AccountSettingView;
  