import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, TouchableOpacity, SafeAreaView, Modal, StyleSheet, Image, ScrollView, Alert, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSession } from "../store/lession_slice";
import { useAuth } from "../../../store/auth_slice";
import React, { useEffect, useState } from "react";
import MyColor from "../../../constants/color";
import CommentCard from "../component/comment_card";
import VideoPlayer from "./video_player";
import StarRating from "./star_rating";
import { pickVideoWithPermission } from "../../../utils/pick_video_util";
import UploadVideoToSupabase from "../../../utils/upload_video_util";
import Video from "react-native-video";

const SessionScreen = () => {
    const route = useRoute<RouteProp<{ params: { session_id: string } }, 'params'>>();
    const { session_id } = route.params;
    const navigation = useNavigation();

    console.log('session_id: ', session_id);

    const {uuid, username} = useAuth();
    const {
      getSession, 
      checkIfRowFavExists,
      getIsFavSession,
      insertFavourite,
      updateFavourite,
      getRatingSession,
      fetchComments, 
      getInstructor,
      getJoinedData,
      insertJoinSession,
      insertVideoResult,
    } = useSession();

    const [lesson, setLesson] = useState<ISession | null>(null);
    const [rating, setRating] = useState(5);
    const [instructor, setInstructor] = useState<IInstructor | null>(null);
    const [comments, setComments] = useState<IComment[]>([]);

    const [videoUri, setVideoUri] = useState<string | null>(null);

    const [content, setContent] = useState('Community');
    const [isShowVideo, setIsShowVideo] = useState(false);
    const [isModalOfflineVisible, setModalOfflineVisible] = useState(false);
    const [isModalOfflineStudentVisible, setModalOfflineStudentVisible] = useState(false);
    const [isModalScheduleVisible, setIsModalScheduleVisible] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [joinedData, setJoinedData] = useState<IJoin>();

    const fetchLesson = async () => { 
        // console.log('fetch session:', session_id);
        await getSession(session_id).then((res) => {
            setLesson(res);
        }).catch((err) => {
            console.error('Error:', err);
        });
    };
    const fetchfavLesson = async () => { 
      await getIsFavSession(session_id, uuid).then((res) => {
        console.log('fetchfavLesson: ', res);
          setIsSaved(res);
      }).catch((err) => {
          console.error('Error:', err);
      });
    };  
    const fetchRatingLesson = async () => { 
      await getRatingSession(session_id).then((res) => {
          setRating(res);
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
    const fetchIsJoinSession = async () => {
      try {
        const res = await getJoinedData(session_id, uuid);
    
        if (res === false) {
          // Nếu không có dữ liệu (student chưa tham gia session)
          setIsJoined(false);
          setJoinedData(null); // Đảm bảo xóa dữ liệu cũ (nếu có)
        } else {
          // Nếu có dữ liệu (student đã tham gia session)
          setIsJoined(true);
          setJoinedData(res); // Lưu dữ liệu của session
        }
      } catch (err) {
        console.error('Error in fetchIsJoinSession:', err.message);
        // Optional: xử lý lỗi bằng cách hiển thị thông báo hoặc hành động phù hợp
      }
    };
        
    useFocusEffect(
      React.useCallback(() => {
        fetchLesson();
        fetchfavLesson();
        fetchRatingLesson();
        fetchInstructor();
        fetchCommentsData();    
        fetchIsJoinSession();
      }, [])
    );

    useFocusEffect(
      React.useCallback(() => {
        const fetchAllData = async () => {
          await fetchLesson(); 
          if (lesson?.instructor_id) {
            await fetchInstructor(); 
          }
          fetchRatingLesson();
          fetchCommentsData();
        };
    
        fetchAllData();
      }, [lesson]) 
    );
    

    const handleSave = async () => {
      try {
        const { exists, is_favourite } = await checkIfRowFavExists(session_id, uuid);
    
        if (exists) {
          if (is_favourite) {
            await updateFavourite(session_id, uuid, false);
          } else {
            await updateFavourite(session_id, uuid, true);
          }
        } else {
          await insertFavourite(session_id, uuid);
        }
    
        setIsSaved(!isSaved);
      } catch (err) {
        console.error('Error in handleSave:', err.message);
      }
    };
    
    
    const handleNavVideoPlayer = () => {
      setIsShowVideo(true);
    };
    const handleNavigateCommunityDetail = () => {
      navigation.navigate('CommunityScreen', {session_id: session_id})
      // navigation.navigate('Community', {
      //   comments: lesson?.comments || [],
      //   lesson,
      // });
    };
    const handleJoin = async () => {
      try {
        setIsJoined(!isJoined);
    
        const joinedData: IJoin = {
          session_id: session_id, 
          user_id: uuid,
          created_at: new Date().toISOString(),
          progress: 0,
          result_video_url: "",
          review: "",
          rating: 0,
          username: username,
          teacher_feedback: ""
        };
    
        // Nếu chưa tham gia (isJoined là false), gọi insertJoinSession để thêm vào bảng
        if (!isJoined) {
          const result = await insertJoinSession(joinedData);
          
          if (result) {
            console.log('Successfully joined the session:', result);
          } else {
            console.log('Failed to join the session');
          }
        } else {
          console.log('User already joined');
        }
      } catch (error) {
        console.error('Error joining session:', error.message);
      }
    };
    const handlePickVideo = async () => {
      const uri = await pickVideoWithPermission();
      if (uri) {
        setVideoUri(uri);
      }
    };
  
    const handleDeleteVideo = () => {
      setVideoUri('');
    };
  
    const handleUploadVideo = async () => {
      if (!videoUri) {
        Alert.alert("No video selected", "Please select a video to upload.");
        return;
      }
    
      try {
        const videoUrl = await UploadVideoToSupabase(videoUri, uuid);
      
        const updatedVideoUrl = await insertVideoResult(uuid, videoUrl, session_id);
      
        Alert.alert("Successfully", "Video uploaded and saved successfully");
        console.log("Updated Video URL:", updatedVideoUrl);
      
      } catch (error) {
        console.error("Error:", error.message || error);
        Alert.alert("Failed to upload or save video", error.message || "Unknown error.");
      }      
    };
    const handleRating = () => {
      navigation.navigate('RatingScreen', {session_id});
    }
  
    

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
                uri={lesson?.video_url}
                visible={isShowVideo}
                setVisible={setIsShowVideo}
              />
            </TouchableOpacity>
          </View>
    
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={[styles.icon]}
                onPress={handleSave}>
                <Icon
                  name={isSaved ? 'heart' : 'heart-o'}
                  size={24}
                  color={MyColor.primary}
                />
              </TouchableOpacity>

              <StarRating 
              rating={rating} 
              handlePress={isJoined ? handleRating : () => Alert.alert("You must join the session first!")}
              />

              {/* <TouchableOpacity style={styles.icon}>
                <Icon
                  name="cloud-download-outline"
                  size={30}
                  color={MyColor.primary}
                />
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                style={styles.icon}
                onPress={() => setIsModalScheduleVisible(true)}>
                <Icon
                  name="calendar-clear-outline"
                  size={30}
                  color={MyColor.primary}
                />
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                style={styles.icon}
                onPress={() => setModalOfflineStudentVisible(true)}>
                <FontAwesomeIcon
                  icon={faAddressBook}
                  size={25}
                  color={MyColor.primary}
                />
                <Icon name="home" size={30} color={MyColor.primary} />
              </TouchableOpacity> */}

              {/* <TouchableOpacity style={styles.icon}>
                            <Ionicons name="arrow-redo-outline" size={30} color={Colors.primaryPupple} />
                        </TouchableOpacity> */}
            </View>
          
          <ScrollView>
            <View style={styles.container2}>
              <Text style={styles.textName}>{lesson?.session_name}</Text>
      
                <View style={styles.instructorContainer}>
                  <Image
                    source={{uri: instructor?.avatar_url}}
                    style={styles.circle}></Image>
                  <View style={styles.instructorInfo}>
                    <Text style={styles.textInstructor}>{instructor?.username}</Text>
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

            {/* UPLOAD VIDEO RESULT */}
            {isJoined && 
              <View style={styles.uploadvideo_container}>
                <Text style={styles.headerText}>Your practice video</Text>
                <View style={styles.videoPickerContainer}>
                  {joinedData?.result_video_url ? (
                    <View style={styles.videoPreviewContainer}>
                      <Video 
                        source={{ uri: joinedData.result_video_url }} 
                        style={styles.videoThumbnail} 
                        resizeMode="cover" 
                        controls 
                      />
                    </View>
                  ) : (
                    videoUri ? (
                      <View style={styles.videoPreviewContainer}>
                        <Image source={{ uri: videoUri }} style={styles.videoThumbnail} />
                        <View style={styles.videoActions}>
                          <TouchableOpacity onPress={handleDeleteVideo}>
                            <Icon name="times" size={24} color="red" style={styles.icon} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handleUploadVideo}>
                            <Icon name="check" size={24} color="green" style={styles.icon} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <TouchableOpacity onPress={handlePickVideo} style={styles.pickButton}>
                        <Text style={styles.pickButtonText}>Pick a video</Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            }

            

            {/*THANH COMMUNITY VA PARTICIPNAT (STUDENT KO DC XEM PARTICIPANT)  */}
            <View style={styles.communityContainer}>
              <View style={styles.container}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>Community</Text>
                  <TouchableOpacity onPress={isJoined ? handleNavigateCommunityDetail : () => Alert.alert("You must join the session first!")}>
                    <Text style={styles.joinHere}>Join Here</Text>
                  </TouchableOpacity>
                </View>
                <CommentCard comments={comments || []} />
              </View>
            </View>
          </ScrollView>
            
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
                {!isJoined ? 'JOIN SESSION' : 'WATCH VIDEO'}
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
      justifyContent: 'space-between',
      borderColor: 'grey',
      borderWidth: 0.5,
      paddingHorizontal: 16
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
      marginRight: 12,
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
    textInstructor: {
      color: 'black',
      fontWeight: '500',
      fontSize: 16,
      textTransform: 'uppercase',
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
    uploadvideo_container: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      // backgroundColor: MyColor.black
    },
    videoPickerContainer: {
      marginTop: 12,
      alignItems: 'center',
    },
    videoPreviewContainer: {
      alignItems: 'center',
      position: 'relative',
    },
    videoThumbnail: {
      width: 360,
      height: 188,
      borderRadius: 8,
      marginBottom: 16,
    },
    videoActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 60,
    },
    pickButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: MyColor.primary,
      borderRadius: 8,
    },
    pickButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });