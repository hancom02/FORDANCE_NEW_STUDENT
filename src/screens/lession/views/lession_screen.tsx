import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, TouchableOpacity, SafeAreaView, Modal, StyleSheet, Image } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSession } from "../store/lession_slice";
import { useAuth } from "../../../store/auth_slice";
import React, { useEffect, useState } from "react";
import MyColor from "../../../constants/color";
import CommentCard from "../component/comment_card";
import VideoPlayer from "./video_player";

const SessionScreen = () => {
    const route = useRoute<RouteProp<{ params: { session_id: ISession } }, 'params'>>();
    const { session_id } = route.params;
    const navigation = useNavigation();

    const {uuid} = useAuth();
    const {getSession, fetchClass, fetchComments, getInstructor} = useSession();

    const [lesson, setLesson] = useState<ISession | null>(null);
    const [instructor, setInstructor] = useState<IInstructor | null>(null);
    const [comments, setComments] = useState<IComment[]>([]);

    const [content, setContent] = useState('Community');
    const [isShowVideo, setIsShowVideo] = useState(false);
    const [isModalOfflineVisible, setModalOfflineVisible] = useState(false);
    const [isModalOfflineStudentVisible, setModalOfflineStudentVisible] = useState(false);
    const [isModalScheduleVisible, setIsModalScheduleVisible] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isJoined, setIsJoined] = useState(false);

    const fetchLesson = async () => { 
        console.log('fetch session:', session_id);
        await getSession(session_id).then((res) => {
            setLesson(res);
        }).catch((err) => {
            console.error('Error:', err);
        });
    };
    const fetchInstructor = async () => {
        const res = await getInstructor(lesson.instructor_id);
        setInstructor(res);
    };
    const fetchCommentsData = async () => {
        const res = await fetchComments(session_id);
        setComments(res);
    };
    // 

    useEffect(() => {
      console.log('use effect');
        fetchLesson();
        fetchInstructor();
        fetchCommentsData();
    }, [lesson]);

    const handleSave = () => {
      setIsSaved(!isSaved);
    };
    const handleNavVideoPlayer = () => {
      setIsShowVideo(true);
    };
    const handleNavigateCommunityDetail = () => {
      // navigation.navigate('Community', {
      //   comments: lesson?.comments || [],
      //   lesson,
      // });
    };
    const handleJoin = () => {
      setIsJoined(!isJoined);

    };

    return (
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
    
          <View style={styles.videoContainer}>
            <Image style={styles.video} source={{uri: lesson?.thumbnail_url}} />
            <TouchableOpacity onPress={handleNavVideoPlayer}>
              <VideoPlayer
                uri={lesson?.videoUrl}
                visible={isShowVideo}
                setVisible={setIsShowVideo}
              />
            </TouchableOpacity>
          </View>
    
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={[styles.icon, {marginLeft: 16}]}
                onPress={handleSave}>
                <Icon
                  name={isSaved ? 'heart' : 'heart-outline'}
                  size={30}
                  color={MyColor.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon}>
                <Icon
                  name="cloud-download-outline"
                  size={30}
                  color={MyColor.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => setIsModalScheduleVisible(true)}>
                <Icon
                  name="calendar-clear-outline"
                  size={30}
                  color={MyColor.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => setModalOfflineStudentVisible(true)}>
                {/* <FontAwesomeIcon
                  icon={faAddressBook}
                  size={25}
                  color={MyColor.primary}
                /> */}
                <Icon name="home" size={30} color={MyColor.primary} />
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.icon}>
                            <Ionicons name="arrow-redo-outline" size={30} color={Colors.primaryPupple} />
                        </TouchableOpacity> */}
            </View>
    
          <View style={styles.container2}>
            <Text style={styles.textName}>{lesson?.session_name}</Text>
    
              <View style={styles.instructorContainer}>
                <Image
                  source={{uri: instructor?.avatar_url}}
                  style={styles.circle}></Image>
                <View style={styles.instructorInfo}>
                  <Text style={styles.textName}>{instructor?.username}</Text>
                  {/* <Text style={styles.instructorSubtitle}>{DancerName}</Text> */}
                </View>
              </View>
          </View>
    
          <View style={styles.infoContainer}>
            <View style={[styles.info, {alignItems: 'flex-start'}]}>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.textInfo}>LEVEL</Text>
                <Text style={styles.textInfo2}>{lesson?.level}</Text>
              </View>
            </View>
            <View style={[styles.info, {alignItems: 'center'}]}>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.textInfo}>STYLE</Text>
                <Text style={styles.textInfo2}>{lesson?.genre}</Text>
              </View>
            </View>
            <View style={[styles.info, {alignItems: 'flex-end'}]}>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.textInfo}>TIME</Text>
                <Text style={styles.textInfo2}>{lesson?.total_time} min</Text>
              </View>
            </View>
          </View>
    
          {/*THANH COMMUNITY VA PARTICIPNAT (STUDENT KO DC XEM PARTICIPANT)  */}
            <View style={styles.communityContainer}>
              <View style={styles.container}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>Community</Text>
                  <TouchableOpacity onPress={handleNavigateCommunityDetail}>
                    <Text style={styles.joinHere}>Join Here</Text>
                  </TouchableOpacity>
                </View>
                <CommentCard comments={comments || []} />
              </View>
            </View>
    
          <TouchableOpacity
            style={styles.joinClassContainer}
            onPress={() => {
              if (isJoined) handleNavVideoPlayer();
              else handleJoin();
            }}>
            {lesson?.isJoined ? (
              <Text style={styles.textJoinLesson}>WATCH VIDEO LESSON</Text>
            ) : (
              <Text style={styles.textJoinLesson}>
                {!isJoined ? 'JOIN LESSON' : 'WATCH VIDEO'}
              </Text>
            )}
          </TouchableOpacity>
    
          {/* <Modal
            visible={isModalOfflineStudentVisible}
            animationType="fade"
            transparent={true}>
            <PopUpFormComponent
              handleSubmit={handleSubmit}
              offlinelessons={offlinelessons}
              handleCloseModal={() => {
                setModalOfflineStudentVisible(false);
              }}
            />
          </Modal> */}
    
          {/* <Modal
            visible={isModalOfflineVisible}
            animationType="fade"
            transparent={true}>
            <ScheduleLessonComponent
              handleSubmit={handleSubmitOffline}
              offlinelessons={offlinelessons}
              handleCloseModal={() => {
                setModalOfflineVisible(false);
              }}
            />
          </Modal> */}
    
          {/* <Modal visible={isModalScheduleVisible}>
            <DateTimePicker
              testID="selectDatePicker"
              value={selectedDate}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => onChangeDate2(event, selectedDate)}
            />
          </Modal> */}
        </SafeAreaView>
      );
}

export default SessionScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    container2: {
      marginTop: 12,
      flexDirection: 'column',
      paddingHorizontal: 16,
    },
    videoContainer: {
      paddingHorizontal: 0,
    },
    video: {
      width: '100%',
      height: 200,
      // backgroundColor: 'blue',
    },
    iconContainer: {
      width: '100%',
      height: 50,
      alignItems: 'center',
      backgroundColor: 'white',
      flexDirection: 'row',
      borderColor: 'grey',
      borderWidth: 0.5,
      // marginBottom: 15
    },
    instructorContainer: {
      flexDirection: 'row',
      marginTop: 20,
      paddingBottom: 16,
      borderColor: 'grey',
      borderBottomWidth: 0.5,
      alignItems: 'center',
  
      // backgroundColor: 'green'
    },
    circle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'grey',
      marginRight: 20,
      // marginBottom: 10
    },
  
    instructorSubtitle: {
      fontSize: 16,
    },
    icon: {
      marginRight: 10,
    },
    backButton: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 999,
      padding: 10,
      borderRadius: 30,
      backgroundColor: 'white',
    },
    textName: {
      color: 'black',
      fontWeight: '700',
      fontSize: 20,
      textTransform: 'uppercase',
    },
    instructorInfo: {
      flexDirection: 'column',
      justifyContent: 'center',
  
      // backgroundColor: 'pink'
    },
  
    infoContainer: {
      // marginTop: 10,
      flexDirection: 'row',
      height: 80,
      marginHorizontal: 16,
      borderColor: 'grey',
      borderBottomWidth: 0.5,
  
      // backgroundColor: 'pink'
    },
    info: {
      flex: 1,
      justifyContent: 'center',
    },
    textInfo: {
      marginBottom: 5,
      fontSize: 16,
      fontWeight: '300',
      color: 'black',
    },
    textInfo2: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'black',
    },
    communityContainer: {
      flex: 1,
      marginHorizontal: 16,
    },
    containerJoin: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    participantContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      // backgroundColor: 'pink'
    },
    participantContent: {
      width: '100%',
      height: 260,
      paddingTop: 16,
      // backgroundColor: 'green'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 15,
      marginBottom: 15,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
    },
    joinHere: {
      color: MyColor.primary,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    joinClassContainer: {
      height: 50,
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: MyColor.primary,
      borderRadius: 3,
  
      justifyContent: 'center',
      alignItems: 'center',
    },
    textJoinLesson: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
      letterSpacing: 2,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      height: 500,
    },
  });