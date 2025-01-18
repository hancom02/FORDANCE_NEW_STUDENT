import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../store/auth_slice';
import { checkStoragePermission, pickImage } from '../../utils/pick_image_util';
import UploadImageToSupabase from '../../utils/upload_image_util';
import MyColor from '../../constants/color';
import MyAppBar from '../../components/appbar';
import { useInstructorProfile } from './store/instructor_profile_slice';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import SizedBox from '../../components/size_box';
import SmallerSessionCard from '../class/components/smaller_session_card';
import LessonCard from '../../components/lesson_smaller_card';

const InstructorProfileScreen = () => {
    const route = useRoute<RouteProp<{ params: { instructor_id: string } }, 'params'>>();
    const { instructor_id } = route.params;
    const navigation = useNavigation();

  const [isEditing, setIsEditing] = useState(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

//   const {uuid} = useAuth();
  const {getProfile, getSessionByInstructor} = useInstructorProfile();

  const [profile, setProfile] = useState<IInstructorProfile>();
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [name, setName] = useState('');
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [prizes, setPrizes] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const fetchProfile = async () => {
    try {
        setLoading(true);

        const profileData = await getProfile(instructor_id);
        setProfile(profileData);

        setName(profileData.name );
        setEmail(profileData.email);
        setPhoneNumber(profileData.phone);
        setPrizes(profileData.prize);
        setAvatarUrl(profileData.avatar_url);

        setLoading(false);
    } catch (err) {
        console.error("Error fetching data outside useEffect: ", err);
    }
  }
  const fetchSessionInstructor = async () => {
    getSessionByInstructor(instructor_id).then((data : ISession[]) => {
        setSessions(data);
    })
  }


  console.log('insstructor id: ', instructor_id);
  console.log({profile});
  console.log('session instructor: ', sessions);
  useEffect(() => {
    if (isProfileUpdated) {
        fetchProfile();
        fetchSessionInstructor();
    }
  }, [isProfileUpdated]);

  useEffect(() => {
    fetchProfile();
    fetchSessionInstructor();    
  }, []);

  const handleNavDetailLesson = (session_id: string) => {
    navigation.navigate('LessionScreen', {session_id});
  }

  return (
    <SafeAreaView style={styles.container}>
        <MyAppBar headerTitle="Profile"/>
        {loading ? 
            <View>
                <ActivityIndicator size={36} color={MyColor.primary}/>
            </View> : 
            <View style={styles.contentConatainer}>
                <ImageBackground
                source={{uri: isEditing ? (selectedImageUri || avatarUrl) : avatarUrl}}
                style={styles.coverPhoto}>
                </ImageBackground>
                <View style={styles.avatarContainer}>
                    <Image source={{uri: avatarUrl}} style={styles.avatar}></Image>
                    <SizedBox height={16} width={0} backgroundColor={MyColor.white} />
                </View>
                <View style={{marginTop: 60, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.textName}>{name}</Text>
                </View>
                    
                <View style={{flex: 1, width: '100%', marginTop: 24}}>
                    {profile?.introduce &&
                    <View>
                      <Text style={styles.label}>Introduce</Text>
                      <Text style={styles.text}>{profile?.introduce}</Text>
                      {/* <SizedBox /> */}
                    </View>
                    }

                    {profile?.introduce &&
                      <View>
                        <Text style={styles.label}>Prizes</Text>
                        <Text style={styles.text}>{profile?.prize}</Text>
                      </View>
                    }

                    <Text style={styles.label}>Recent sessions</Text>
                    {sessions.length === 0 ? 
                      <Text style={styles.text}>This instructor has no session</Text>
                    : <FlatList 
                      data={sessions}
                      renderItem={({item, index}) => (
                        <View style={{marginBottom: 16}}>
                          <LessonCard 
                            session={item} 
                            handleNav={() => handleNavDetailLesson(item.id)}      
                          />
                        </View>
                      )}
                      keyExtractor={(item) => item.id}
                      showsVerticalScrollIndicator={false}
                    />}
                </View>
            </View>
        }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColor.white,
    // alignItems: 'center',
    // justifyContent: 'flex-start'

  },
  contentConatainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignContent: 'center',

    // backgroundColor: MyColor.primary

  },
  profileImgContainer: {
    width: '100%',
    height: 220,

    justifyContent: 'center',  // Căn giữa các phần tử trong container
    alignItems: 'center',      // Căn giữa các phần tử trong container
    backgroundColor: MyColor.primary,
    // position: 'relative',
    // justifyContent: 'center',
    // alignContent: 'center',
    // alignItems: 'center',

  },
  coverPhoto: {
    width: '100%',
    height: 150,
  },
  avatarContainer: {
    position: 'absolute',
    top: 100,
    bottom: 20,
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    alignContent: 'center',
    alignItems: 'center',
    // justifyContent: 'center'
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 50,
  },
  nameContainer: {
    position: 'absolute',
    top: 100,
    bottom: 20,
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: MyColor.primary,
    borderRadius: 20,
    padding: 5,
  },
  changeAvatarBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: MyColor.primary,
    borderRadius: 20,
    padding: 5,
  },
  textNameContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textName: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'black',
    alignSelf: 'center'
  },
  editCoverPhotoBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: MyColor.primary,
    borderRadius: 20,
    padding: 5,
  },
  editBtn: {
    marginTop: 10,
    backgroundColor: MyColor.primary,
    borderRadius: 20,
    padding: 10,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  profileBody: {
    width: '100%',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 5,
    width: '100%',
  },
  textArea: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    width: '100%',
  },
  text: {
    // marginVertical: 5,
    // padding: 10,
    marginBottom: 16,
    color: 'black',
    width: '100%',
    fontSize: 16
    
  },
  profileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    width: '70%',
    marginTop: 10,
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: MyColor.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 80,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    backgroundColor: '#bbb',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 70,
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InstructorProfileScreen;
