import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  // import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import MyColor from '../../constants/color';
  
interface Session2CardProps {
  lessons: ISession;
  handleNav: () => void;
}

  const Session2Card: React.FC<Session2CardProps> = (props) => {
    const {
      lessons,
      handleNav,
    } = props;
  
    return (
      <View>
        <TouchableOpacity style={styles.container1} onPress={handleNav}>
          <ImageBackground
            source={{uri: lessons.thumbnail_url}}
            style={styles.background}>
            {/* <LinearGradient
                          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0.5, y: 0 }}
                          style={styles.gradient}
                      /> */}
            <View style={styles.contentContainer}>
              <Text style={styles.textName}>{lessons.session_name}</Text>
              {/* <TouchableOpacity onPress={handleNav}>
                <Text style={styles.textSeeDetail}>See Detail</Text>
              </TouchableOpacity> */}
            </View>
          </ImageBackground>
        </TouchableOpacity>
  
        <View style={styles.container2}>
          <View style={[
            styles.levelContainer, 
            {backgroundColor: lessons.level === 'beginner' ? 'orange' : lessons.level === 'intermediate' ? 'blue' : 'purple'}]}>
            <Text style={styles.textLevel}>{lessons.level}</Text>
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.textCategory}>{lessons.genre}</Text>
          </View>
          {/* <View style={styles.instrucContainer}>
            <Text style={styles.textInstructor}>{lessons.instructor?.name}</Text>
          </View> */}
        </View>
  
        {/* <View style={styles.container3}>
          <Text style={styles.textTime}>{lessons.total_time} minutes</Text>
        </View> */}
      </View>
    );
  };
  
  export default Session2Card;
  
  const styles = StyleSheet.create({
    container: {
      width: 340,
      // height: 210,
      marginRight: 8,
      overflow: 'hidden',
      // backgroundColor: 'pink'
    },
    background: {
      flex: 1,
      resizeMode: 'contain', // 'cover', 'contain', 'stretch', 'repeat', 'center'
      justifyContent: 'flex-start', // 'center', 'flex-start', 'flex-end', 'space-between', 'space-around'
      width: '100%',
      height: '100%',
  
      borderRadius: 20,
    },
    container1: {
      width: '100%',
      height: 190,
      borderRadius: 10,
      overflow: 'hidden',
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      width: '100%',
      paddingHorizontal: 16,
      paddingBottom: 24,

      // backgroundColor: MyColor.black
  
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    container2: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 8,
      alignContent: 'flex-start',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
  
      // backgroundColor: 'green',
    },
    container3: {
      paddingHorizontal: 8,
    },
    levelContainer: {
      width: 100,
      height: 20,
      paddingHorizontal: 4,
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      marginRight: 8,
      // backgroundColor: 'orange',
    },
    categoryContainer: {
      width: 80,
      height: 20,
      paddingHorizontal: 4,
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      marginRight: 8,
      backgroundColor: 'black',
    },
    instrucContainer: {
      width: 80,
      height: 20,
      paddingHorizontal: 8,
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      marginRight: 8,
      backgroundColor: 'black',
    },
    textSeeDetail: {
      fontSize: 12,
      fontWeight: '700',
      color: MyColor.primary,
    },
    textLevel: {
      width: 'auto',
      color: 'white',
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'capitalize'
    },
    textName: {
      fontSize: 22,
      fontWeight: '800',
      color: 'white',

      // backgroundColor: MyColor.black
    },
    textCategory: {
      color: 'white',
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'capitalize'

    },
    textInstructor: {
      color: 'white',
      fontSize: 11,
      fontWeight: '700',
    },
    textTime: {
      color: 'black',
      fontSize: 11,
    },
  });
  