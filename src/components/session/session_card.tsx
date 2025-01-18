import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
import React from 'react';
import MyColor from '../../constants/color';
  
interface SessionCardProps {
  session: ISession;
  handleNav: () => void;
}

  const SessionCard: React.FC<SessionCardProps> = (props) => {
    const {
      session,
      handleNav,
    } = props;

    console.log('SessionCard: session: ', session);

    return (
      <TouchableOpacity style={styles.container} onPress={handleNav}>
        <ImageBackground
          source={{uri: session.thumbnail_url}}
          style={styles.background}>
          {/* <LinearGradient
                      colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0.5, y: 0 }}
                      style={styles.gradient}
                  /> */}
  
          <View style={styles.contentContainer}>
            <View style={{width: '100%', height: '50%', paddingVertical: 16}}>
              <View style={styles.level_seeDetailContainer}>
                <View style={[
                    styles.levelContainer, 
                    {backgroundColor: session.level === 'beginner' ? 'orange' : session.level === 'intermediate' ? 'blue' : 'purple'}]}>
                  <Text style={styles.textLevel}>{session.level}</Text>
                </View>
                {/* <TouchableOpacity
                  style={styles.seeDetailContainer}
                  onPress={handleNav}>
                  <Text style={styles.textSeeDetail}>See detail</Text>
                </TouchableOpacity> */}
              </View>
              <Text style={styles.textName}>{session.session_name}</Text>
            </View>
  
            <View
              style={{width: 'auto', height: '50%', justifyContent: 'center'}}>
              <Text style={styles.textChoreo}>{session.genre}</Text>
              {/* <Text style={styles.textInstructor}>
                {session.instructor_id}
              </Text> */}
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  
  export default SessionCard;
  
  const styles = StyleSheet.create({
    container: {
      width: 340,
      height: 190,
      marginRight: 8,
      borderRadius: 10,
      borderWidth: 0,
      overflow: 'hidden',
      backgroundColor: 'pink',
    },
    background: {
      flex: 1,
      resizeMode: 'contain', // 'cover', 'contain', 'stretch', 'repeat', 'center'
      justifyContent: 'center', // 'center', 'flex-start', 'flex-end', 'space-between', 'space-around'
      width: '100%',
      height: '100%',
  
      borderRadius: 20,
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
    },
    contentContainer: {
      width: '100%',
      justifyContent: 'center',
      paddingHorizontal: 16,
      flex: 1,

      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    level_seeDetailContainer: {
      flexDirection: 'row',
      height: 30,
      justifyContent: 'space-between',
      alignItems: 'baseline',
  
      // backgroundColor: 'pink'
    },
    levelContainer: {
      width: 100,
      height: 20,
      paddingHorizontal: 4,
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      marginBottom: 8,
    },
    seeDetailContainer: {
      width: '26%',
      height: '50%',
      alignItems: 'flex-end',
  
      // backgroundColor: 'white'
    },
    textLevel: {
      width: 'auto',
      color: 'white',
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'capitalize'
    },
    textSeeDetail: {
      color: MyColor.primary,
      fontSize: 12,
      fontWeight: '700',
    },
    textName: {
      fontSize: 22,
      fontWeight: '800',
      color: 'white',
    },
    textChoreo: {
      color: 'white',
      fontWeight: '700',
      textTransform: 'capitalize',
      // backgroundColor: MyColor.black
    },
    textInstructor: {
      color: 'white',
      fontWeight: '700',
    },
  });
  