import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native";
import MyColor from "../../../constants/color";
import React, { useState } from "react";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../../store/auth_slice";
import MyAppBar from "../../../components/appbar";
import Session2Card from "../../../components/session/session2_card";
import SizedBox from "../../../components/size_box";
import { useJoinListSession } from "../store/list_join_session_slice";

const ListJoinSessionScreen = () => {
    // const route = useRoute<RouteProp<{ params: {  } }, 'params'>>();
    // const { } = route.params;

    const navigation = useNavigation();
    
    const {uuid} = useAuth();
    const {getJoinedSession} = useJoinListSession();

    const [joinedSessions, setJoinedsessions] = useState<ISession[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFavSessions = async () => {
    await getJoinedSession(uuid).then((data) => {
        setJoinedsessions(data);
    }).catch((err) => {
        console.error(error);
    });
    }
    useFocusEffect(
        React.useCallback(() => {
        fetchFavSessions();
        }, [])
    );
    const handleNavSession = (session_id : string) => {
        navigation.navigate('LessionScreen', {session_id});
    }
    console.log('joinedSessions: ', joinedSessions);

    return(
        <SafeAreaView style={styles.container}>
            <MyAppBar headerTitle='Favourite sessions' />
            {loading ?
             <View style={{justifyContent: 'center', alignContent: 'center'}}>
                <ActivityIndicator size={36} color={MyColor.primary}/> 
             </View>:
             <View style={styles.contentContainer}>
                <FlatList 
                    data={joinedSessions}
                    renderItem={({ item }) => (
                        <View>
                            <Session2Card 
                                lessons={item} 
                                handleNav={() => handleNavSession(item.id)} 
                            />
                            <SizedBox/>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>}

        </SafeAreaView>
    )
}
export default ListJoinSessionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyColor.white
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 40
    },
})