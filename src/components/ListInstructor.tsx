import React from 'react';
import {FlatList, Image, StyleSheet, View, Text} from 'react-native';

const ListInstructor = ({listIns}) => {
  return (
    <FlatList
      style={styles.flatList}
      data={listIns}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <View key={item.id} style={styles.card}>
          <Image style={styles.img} source={{uri: item.avatar_url}} />
          <Text style={styles.text}>{item.name}</Text>
        </View>
      )}
      // onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
    />
  );
};

export default ListInstructor;
const styles = StyleSheet.create({
  flatList: {
    marginBottom: 200,
    // paddingBottom: 500,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingVertical: 20,
    marginHorizontal: 16,
  },
  img: {borderRadius: 32, width: 64, height: 64, aspectRatio: 1 / 1},
  text: {fontWeight: 600, fontFamily: 'Poppins', fontSize: 15},
});
