import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native";
import MyColor from "../../../constants/color";
import React, { useState } from "react";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useFavListSession } from "../store/list_fav_session_slice";
import { useAuth } from "../../../store/auth_slice";
import MyAppBar from "../../../components/appbar";
import SessionCard from "../../../components/SessionCard";
import Session2Card from "../../../components/session/session2_card";
import SizedBox from "../../../components/size_box";

const ListFavSessionScreen = () => {
    // const route = useRoute<RouteProp<{ params: {  } }, 'params'>>();
    // const { } = route.params;

    const navigation = useNavigation();
    
    const {uuid} = useAuth();
    const {getFavSession} = useFavListSession();

    const [favSessions, setFavsessions] = useState<ISession[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFavSessions = async () => {
    await getFavSession(uuid).then((data) => {
        setFavsessions(data);
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
    console.log('favSessions: ', favSessions);

    return(
        <SafeAreaView style={styles.container}>
            <MyAppBar headerTitle='Favourite sessions' />
            <View style={styles.contentContainer}>
                <FlatList 
                    data={favSessions}
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
            </View>

        </SafeAreaView>
    )
}
export default ListFavSessionScreen;

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