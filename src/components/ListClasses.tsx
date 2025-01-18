import React from 'react';
import ClassCard from './ClassCard';
import {FlatList, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ListClasses = ({searchResults}) => {
  const navigation =useNavigation();
  return (
    <FlatList
      style={styles.flatList}
      data={searchResults}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <ClassCard
          linkImg={{uri: item.image_cover_url}}
          name={item.class_name}
          level={item.level}
          genre={item.genre}
          nameIns={item.instructor_username}
          count={item.session_count}
          handlePress={() => {
            navigation.navigate('ClassNewScreen', {class_id: item.id});
          }}
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
