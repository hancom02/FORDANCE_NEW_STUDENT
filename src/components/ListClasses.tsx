import React from 'react';
import ClassCard from './ClassCard';
import {FlatList, StyleSheet} from 'react-native';

const ListClasses = ({searchResults}) => {
  return (
    <FlatList
      style={styles.flatList}
      data={searchResults}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <ClassCard
          linkImg={{uri: item.thumbnail_url}}
          name={item.class_name}
          level={item.level}
          genre={item.genre}
          nameIns={item.instructor_username}
          count={item.session_count}
        />
      )}
      // onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
    />
  );
};

export default ListClasses;

const styles = StyleSheet.create({
  flatList: {
    marginBottom: 200,
    // paddingBottom: 500,
  },
});
