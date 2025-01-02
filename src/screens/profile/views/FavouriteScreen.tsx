import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Title from '../../../components/Title';
import ClassCard from '../../../components/ClassCard';
import SessionCard from '../../../components/SessionCard';

const FavouriteScreen = ({navigation}) => {
  return (
    <ScrollView>
      <View>
        <Title navigation={navigation} title={'Favourite'} />
        <View style={styles.container}>
          <SessionCard />
          <ClassCard />
        </View>
      </View>
    </ScrollView>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'column',
    gap: 24,
  },
});
