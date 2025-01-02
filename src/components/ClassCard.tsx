import React from 'react';
import {Image, View, TouchableHighlight, Alert, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {iconSize} from '../constants/common';
import Tag from '../screens/search/components/Tag';

const ClassCard = () => {
  return (
    <View style={styles.card}>
      <Image
        style={styles.img}
        source={require('../assests/img/classImgEx.jpg')}
      />
      {/* right icon btn */}
      <TouchableHighlight
        style={[styles.iconBtn, styles.rightIconBtn]}
        onPress={() => {
          Alert.alert('Hi right');
        }}>
        <Image source={require('../assests/img/calendar_icon.png')} />
      </TouchableHighlight>
      {/* left icon btn */}
      <TouchableHighlight
        style={[styles.iconBtn, styles.leftIconBtn]}
        onPress={() => {
          Alert.alert('Hi left');
        }}>
        <Image source={require('../assests/img/lock_bgblack.png')} />
      </TouchableHighlight>
      <View style={styles.infoCard}>
        <View style={styles.flexRow}>
          <Tag
            text={'BEGINNER'}
            textColor={'white'}
            bgColor={'pink'}
            size={11}
          />
          <Tag
            text={'7 videos'}
            textColor={'white'}
            bgColor={'#B0B0B0'}
            size={11}
            style={styles.flexRow}>
            <Image source={require('../assests/img/Video_light.png')} />
          </Tag>
        </View>
        <Text style={styles.text}>Name Dance</Text>
        <View style={styles.flexRow}>
          <Tag text={'Type'} textColor={'white'} bgColor={'black'} size={11} />
          <Tag
            text={'Dancer'}
            textColor={'white'}
            bgColor={'black'}
            size={11}
            style={styles.flexRow}
          />
        </View>
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
    aspectRatio: 3 / 4,
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
    color: 'white',
    fontWeight: 'semibold',
    fontSize: 15,
  },
  infoCard: {
    flexDirection: 'column',
    gap: 8,
    position: 'absolute',
    bottom: 16,
    left: 12,
  },
  flexRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
