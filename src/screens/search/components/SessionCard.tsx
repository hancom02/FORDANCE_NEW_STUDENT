import React from 'react';
import {Image, View, TouchableHighlight, Alert, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {iconSize} from '../../../constants/dimensions';
import Tag from './Tag';

const SessionCard = () => {
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
      <View style={{flexDirection: 'row'}}>
        <Tag
          name={'BEGINNER'}
          textColor={'white'}
          bgColor={'pink'}
          weight={600}
        />
        <Tag
          name={'Dancer'}
          textColor={'white'}
          bgColor={'black'}
          weight={400}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    // overflow: 'hidden',
  },
  img: {
    borderRadius: 10,
    width: '100%',
    height: 'auto',
    opacity: 0.75,
    aspectRatio: 16 / 9,
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
});

export default SessionCard;
