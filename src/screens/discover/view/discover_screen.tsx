import React, { useEffect, useState } from "react"
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View, Text, Dimensions } from "react-native";
import { SafeAreaView } from "react-native"
import MyHeader from "../../../components/header";
import MyColor from "../../../constants/color";
import SessionCard from "../../../components/session/session_card";
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from "@rneui/themed/dist/config";
import Session2Card from "../../../components/session/session2_card";
import ClassWiderCard from "../../../components/session/class/class_wider_card";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDiscover } from "../store/discover_slice";
import { useAuth } from "../../../store/auth_slice";


const todayLesson = 'Today Sessions';
const seeAll = 'See All';
const danceprogram = 'Classes';
const saveLesson = 'Favourite Sessions';
const danceLesson = 'Sessions';
const joinedSession = 'Joined Sessions'
const {width, height} = Dimensions.get('window');
const imgWidth = width * 0.8;

const DiscoverScreen = () => {
  const navigation = useNavigation();

    const {uuid} = useAuth();
    const {getAllSession, getAllClass, getFavSession, getJoinedSessions} = useDiscover();

    const [allSessions, setAllSessions] = useState<ISession[]>([]);
    const [favSessions, setFavSessions] = useState<ISession[]>([]);
    const [joinedSessions, setJoinedSesion] = useState<ISession[]>([]);
    const [allClasses, setAllClasses] = useState<IClass[]>([]);

    const [displaySessions, setDisplaySesion] = useState<ISession[]>([]);
    const [displayClasses, setDisplayClasses] = useState<IClass[]>([]);



    const fetchAllSessions = async () => {
      await getAllSession().then((data) => {
        setAllSessions(data);
        setDisplaySesion(data.slice(0, 3));
      }).catch((err) => {
        console.error(error);
      });
    }
    const fetchFavSessions = async () => {
      await getFavSession(uuid).then((data) => {
        setFavSessions(data);
      }).catch((err) => {
        console.error(error);
      });
    }
    const fetchJoinedSessions = async () => {
      await getJoinedSessions(uuid).then((data) => {
        setJoinedSesion(data);
      }).catch((err) => {
        console.error(error);
      });
    }
    const fetchAllClasses = async () => {
      await getAllClass().then((data) => {
        setAllClasses(data);
        setDisplayClasses(data.slice(0, 4));

      }).catch((err) => {
        console.error(error);
      });
    }

    useFocusEffect(
      React.useCallback(() => {
        fetchAllSessions();  
        fetchAllClasses();
        fetchFavSessions();
        fetchJoinedSessions();       
      }, [])
    );

    const handleOpenSearch = () => {

    };
    const handleNavDetailLesson = (lesionId : string) => {
      navigation.navigate('LessionScreen', {session_id:lesionId});
    }
    const handleNavDetailProgram = (classId : string) => {
      navigation.navigate('ClassNewScreen', {class_id: classId});
    }

    console.log('uuid: ', uuid);
    console.log('displaySessions', displaySessions);


    return (
        <SafeAreaView>
            <MyHeader />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleOpenSearch}>
            <Icon name="search" size={25} color={MyColor.black}/>
          </TouchableOpacity>
        </View>

        {/* LESSON CỤM ĐẦU */}
        <View style={styles.contentContainer}>
          <View style={styles.lessons1Container}>
            <FlatList
              data={displaySessions}
              renderItem={({item, index}) => (
                <SessionCard
                  session={item}
                  handleNav={() => handleNavDetailLesson(item.id)}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>

        {/* LESSON CỤM 2 */}
        {/* <View style={styles.todayLessonsContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 16, paddingRight: 16 }}>
                        <Text style={styles.textTitle}>{todayLesson}</Text>
                        <TouchableOpacity>
                            <Text style={styles.textSeeAll}>{seeAll}</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <FlatList
                            data={todayLessons}
                            renderItem={({ item, index }) =>
                                <View style={{ width: imgWidth, marginRight: 8 }}>
                                    <Lesson2Component
                                        lessons={item}
                                        handleNav={() => handleNavDetailLesson(item)}
                                    />
                                </View>}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                </View> */}

        {/* LESSON CỤM 3 */}
        <View style={styles.todayLessonsContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingBottom: 16,
              paddingRight: 16,
            }}>
            <Text style={styles.textTitle}>{joinedSession}</Text>
            <TouchableOpacity>
              <Text style={styles.textSeeAll}>{seeAll}</Text>
            </TouchableOpacity>
          </View>

          <View>
            <FlatList
              data={joinedSessions}
              renderItem={({item, index}) => (
                <View style={{width: imgWidth, marginRight: 8}}>
                  <Session2Card
                    lessons={item}
                    handleNav={() => handleNavDetailLesson(item.id)}
                  />
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>

        {/* PROGRAM LIST */}
        <View style={styles.todayLessonsContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingBottom: 16,
              paddingRight: 16,
            }}>
            <Text style={styles.textTitle}>{danceprogram}</Text>
            <TouchableOpacity>
              <Text style={styles.textSeeAll}>{seeAll}</Text>
            </TouchableOpacity>
          </View>

          <View>
            <FlatList
              data={displayClasses}
              renderItem={({item, index}) => (
                <ClassWiderCard
                    classData={item}
                    handleNav={() => handleNavDetailProgram(item.id)}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>

        {/* FAV LESSONS */}
        <View style={styles.todayLessonsContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingBottom: 16,
              paddingRight: 16,
            }}>
            <Text style={styles.textTitle}>{saveLesson}</Text>
            <TouchableOpacity>
              <Text style={styles.textSeeAll}>{seeAll}</Text>
            </TouchableOpacity>
          </View>

          <View>
            <FlatList
              data={favSessions}
              renderItem={({item, index}) => (
                <View
                  style={{width: imgWidth, marginRight: 8, marginBottom: 24}}>
                  <Session2Card
                    lessons={item}
                    handleNav={() => handleNavDetailLesson(item.id)}
                  />
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </ScrollView>
        </SafeAreaView>
    )
}

export default DiscoverScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: MyColor.white
    },
    scrollContainer: {
        paddingBottom: 60,
        paddingLeft: 16,
        // backgroundColor: MyColor.stroke
      },
      searchContainer: {
        width: '100%',
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
      },
      contentContainer: {
        width: '100%',
      },
      lessons1Container: {
        width: '100%',
        paddingBottom: 40,
      },
      todayLessonsContainer: {
        width: '100%',
        paddingBottom: 40,
    
        // backgroundColor: 'pink'
      },
      textTitle: {
        color: 'black',
        fontSize: 20,
        fontWeight: '800',
      },
      textSeeAll: {
        color: MyColor.primary,
        fontSize: 14,
        fontWeight: '800',
      },
})