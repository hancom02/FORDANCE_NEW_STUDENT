import React from 'react';
import {Image, View, TouchableHighlight, Alert, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {iconSize} from '../../../constants/common';
import Tag from './Tag';

const ClassCard = () => {
  return (
    <View>
      <View style={styles.card}>
        <Image
          style={styles.img}
          source={require('../../../assests/img/imgExample.png')}
        />

        <TouchableHighlight
          style={[styles.iconBtn, styles.rightIconBtn]}
          onPress={() => {
            Alert.alert('Hi right');
          }}>
          <Image source={require('../../../assests/img/calendar_icon.png')} />
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.iconBtn, styles.leftIconBtn]}
          onPress={() => {
            Alert.alert('Hi left');
          }}>
          <Image source={require('../../../assests/img/lock_bgblack.png')} />
        </TouchableHighlight>
        <Text style={styles.text}>Name Dance</Text>
      </View>
      <View style={styles.flexRow}>
        <Tag text={'BEGINNER'} textColor={'white'} bgColor={'pink'} size={11} />
        <Tag text={'Dancer'} textColor={'white'} bgColor={'black'} size={11} />
      </View>
    </View>
  );
};

export default ClassCard;

const styles = StyleSheet.create({
  card: {
    position: 'relative',
  },
  img: {
    borderRadius: 10,
    width: '100%',
    height: 'auto',
    opacity: 0.75,
    aspectRatio: 10 / 16,
  },
  iconBtn: {
    height: iconSize.md,
    width: iconSize.md,
    position: 'absolute',
  },
  rightIconBtn: {
    top: 12,
    right: 12,
  },
  leftIconBtn: {
    top: 12,
    left: 12,
  },
  text: {
    position: 'absolute',
    bottom: 16,
    left: 10,
    color: 'white',
    fontWeight: 'semibold',
    fontSize: 15,
  },
  flexRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
});
