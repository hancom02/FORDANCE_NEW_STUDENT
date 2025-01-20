import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, TouchableOpacity, SafeAreaView, Modal, StyleSheet, Image, ScrollView, Alert, Button, } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSession } from "../store/lession_slice";
import { useAuth } from "../../../store/auth_slice";
import React, { useEffect, useRef, useState } from "react";
import MyColor from "../../../constants/color";
import CommentCard from "../component/comment_card";
import VideoPlayer from "./video_player";
import StarRating from "./star_rating";
import { pickVideoWithPermission } from "../../../utils/pick_video_util";
import UploadVideoToSupabase from "../../../utils/upload_video_util";
import Video from "react-native-video";
import SizedBox from "../../../components/size_box";
import throttle from 'lodash.throttle';

const SessionScreen = () => {
    const route = useRoute<RouteProp<{ params: { session_id: string } }, 'params'>>();
    const { session_id } = route.params;
    const navigation = useNavigation();
    const ref = useRef();
    console.log('session_id: ', session_id);

    const {uuid, username} = useAuth();
    const {
      getSession, 
      checkIfRowFavExists,
      getIsFavSession,
      getFavSessionQuantity,
      insertFavourite,
      updateFavourite,
      getRatingSession,
      fetchComments, 
      getInstructor,
      getJoinedData,
      insertJoinSession,
      insertVideoResult,
      updateProgressSession,
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
    const [favQuantity, setFavQuantity] = useState(0);
    const [isJoined, setIsJoined] = useState(false);
    const [joinedData, setJoinedData] = useState<IJoin>();

    const [currentTime, setCurrentTime] = useState<number>(0); 
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const fetchLesson = async () => { 
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
    const fetchFavQuantittyLesson = async () => { 
      await getFavSessionQuantity(session_id).then((res) => {
        console.log('fetchfavLesson: ', res);
          setFavQuantity(res);
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
          setIsJoined(false);
          setJoinedData(null); 
        } else {
          setIsJoined(true);
          setJoinedData(res); 
        }
      } catch (err) {
        console.error('Error in fetchIsJoinSession:', err.message);
      }
    };
        
    useFocusEffect(
      React.useCallback(() => {
        fetchLesson();
        fetchfavLesson();
        fetchFavQuantittyLesson();
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

    useEffect(() => {
      fetchFavQuantittyLesson();
    }, [isSaved]);

    useEffect(() => {
      // if (isShowVideo) {
          fetchIsJoinSession();
      // }
  }, [isShowVideo]);

    // console.log('joinedData.last_watch_time: ', joinedData?.last_watch_time);
    
    const handleSave = async () => {
      try {
        setIsSaved(!isSaved);

        const { exists, is_favourite } = await checkIfRowFavExists(session_id, uuid);
    
        if (exists) {
          if (is_favourite) {
            await updateFavourite(session_id, uuid, false);
            setFavQuantity(favQuantity - 1);
          } else {
            await updateFavourite(session_id, uuid, true);
            setFavQuantity(favQuantity + 1);

          }
        } else {
          await insertFavourite(session_id, uuid);
        }
    
      } catch (err) {
        console.error('Error in handleSave:', err.message);
      }
    };    
    const handleUpdateProgress = async (
      // newProgress: number, 
      lastWatchTime: number, 
      longestWatchTime: number
    ) => {
      if (!joinedData) return;  

      await updateProgressSession(session_id, uuid, lastWatchTime, longestWatchTime).then((res) => {
        console.log('Progress updated successfully!');
      }).catch((err) => {
          console.error('Error updateProgressSession: ', err);
      });
    };

    // const onVideoProgress = (currentTime: number) => {
    //   // const newProgress = (currentTime / lesson.duration) * 100;
    //   const lastWatchTime = currentTime;
    //   const longestWatchTime = Math.max(currentTime, joinedData?.longest_watch_time || 0);
  
    //   handleUpdateProgress(lastWatchTime, longestWatchTime);
    // };    

    const handleVideoProgress = throttle((e: any) => {
      // console.log('LESSON SCREEN - call handleVideoProgress');

      if (!isPlaying) return;

      const currentTime = e.currentTime;
      setCurrentTime(currentTime);

      console.log('Current Time:', currentTime);
    
      const longestWatchTime = Math.max(currentTime, joinedData?.longest_watch_time || 0);
      handleUpdateProgress(currentTime, longestWatchTime);
    }, 500);
  
    const handleVideoEnd = () => {
      setIsPaused(true);
      console.log('Video ended');
    };
  
    const handleVideoPause = () => {
      setIsPaused(true);
      console.log('Video paused');
    };
  
    const handleVideoResume = () => {
      setIsPaused(false);
      console.log('Video resumed');
      // Cập nhật khi video tiếp tục phát
    };


    const handleNavVideoPlayer = () => {
      setIsShowVideo(true);
    };
    const handleNavigateCommunityDetail = () => {
      navigation.navigate('CommunityScreen', {session_id: session_id})
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
          teacher_feedback: "",
          last_watch_time: 0,
          longest_watch_time: 0
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
                timeStart={joinedData?.last_watch_time || 0}
                onProgress={handleVideoProgress} 
                onPlaying={() => setIsPlaying(true)}
                onEnd={handleVideoEnd} 
              />
              {/* {isShowVideo && <Button title="Play" onPress={() => setIsPlaying(true)} />} */}

            </TouchableOpacity>
          </View>
    
            <View style={styles.iconContainer}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={[styles.icon]}
                  onPress={handleSave}>
                  <Icon
                    name={isSaved ? 'heart' : 'heart-o'}
                    size={24}
                    color={MyColor.primary}
                  />
                </TouchableOpacity>
                {favQuantity !== 0 && 
                  <Text style={{color: MyColor.primary, fontWeight: '600', fontSize: 16}}>{favQuantity}</Text>
                }
              </View>

              <StarRating 
              rating={rating} 
              handlePress={isJoined ? handleRating : () => Alert.alert("You must join the session first!")}
              />
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
              <View style={[styles.info,]}>
                  <Text style={styles.textInfo2}>LEVEL</Text>
                  <Text style={styles.textInfo}>{lesson?.level}</Text>
              </View>
              <View style={[styles.info, {alignItems: 'center'}]}>
                  <Text style={styles.textInfo2}>STYLE </Text>
                  <Text style={styles.textInfo}>{lesson?.genre} </Text>
              </View>
              <View style={[styles.info, {alignItems: 'flex-end'}]}>
                  <Text style={styles.textInfo2}>DURATION </Text>
                  <Text style={styles.textInfo}>{lesson?.duration} </Text>
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
                        // ref={ref}
                        source={{ uri: joinedData.result_video_url }} 
                        style={styles.videoThumbnail} 
                        resizeMode="cover" 
                        // controls={true}
                        paused={true}
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
                {joinedData?.teacher_feedback && (
                  <View>
                    <Text style={styles.headerText}>Teacher evaluation</Text>
                    <SizedBox height={4}/>
                    <Text style={{fontSize: 16, color: MyColor.black}}>{joinedData.teacher_feedback}</Text>
                  </View>    
                )}                  
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
                <CommentCard comments={comments.slice(0, 3) || []} />
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
      // justifyContent: 'space-around',
      height: 80,
      marginHorizontal: 16,
      borderColor: 'grey',
      borderBottomWidth: 0.5,
  
      // backgroundColor: 'pink'
    },
    info: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
    },
    textInfo: {
      marginBottom: 5,
      fontSize: 16,
      fontWeight: '300',
      color: 'black',
      textTransform: 'capitalize'
    },
    textInfo2: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'black',
      textTransform: 'uppercase'
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
      marginHorizontal: 16,
      paddingVertical: 16,
      borderColor: 'grey',
      borderBottomWidth: 0.5,
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
      backgroundColor: MyColor.blue,
      borderRadius: 8,
    },
    pickButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });