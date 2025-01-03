import React from 'react';
import {FlatList} from 'react-native';
import SessionCard from './SessionCard';
import {StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ListSessions = ({searchResults, listIns}) => {
  const navigation = useNavigation();
  const getNameById = (id, list) => {
    const foundItem = list.find(item => item.id === id);
    return foundItem ? foundItem.name : null;
  };
  const handleNavSession = (session_id: string) => {
    navigation.navigate('LessionScreen', {session_id});
  }
  return (
    <FlatList
      style={styles.flatList}
      data={searchResults}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <SessionCard
        session_id={item.id}
          linkImg={{uri: item.thumbnail_url}}
          price={item.price}
          name={item.session_name}
          level={item.level}
          genre={item.genre}
          nameIns={getNameById(item.instructor_id, listIns)}
          onPress={() => handleNavSession(item.id)}
        />
      )}
      // onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
    />
  );
};

export default ListSessions;

const styles = StyleSheet.create({
  flatList: {
    marginBottom: 200,
    // paddingBottom: 500,
  },
});
