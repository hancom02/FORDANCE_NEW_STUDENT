import React from 'react';
import {FlatList} from 'react-native';
import SessionCard from './SessionCard';
import {StyleSheet} from 'react-native';

const ListSessions = ({searchResults, listIns}) => {
  const getNameById = (id, list) => {
    const foundItem = list.find(item => item.id === id);
    return foundItem ? foundItem.name : null;
  };
  return (
    <FlatList
      style={styles.flatList}
      data={searchResults}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <SessionCard
          linkImg={{uri: item.thumbnail_url}}
          name={item.session_name}
          level={item.level}
          genre={item.genre}
          nameIns={getNameById(item.instructor_id, listIns)}
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
