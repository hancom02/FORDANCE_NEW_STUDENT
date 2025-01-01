import React from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import MyColor from '../constants/color';
import {iconSize} from '../constants/common';

const Title = ({navigation, title}) => {
  return (
    <View style={styles.title}>
      {/* icon button */}
      <TouchableHighlight onPress={() => navigation.navigate('SearchScreen')}>
        <View>
          <Image
            source={require('../assests/img/Arrow_left.png')}
            style={styles.btnIcon}
          />
        </View>
      </TouchableHighlight>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default Title;

const myPadding = {
  horizontal: 16,
  vertical: 13,
};

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: myPadding.horizontal,
    paddingVertical: myPadding.vertical,
    borderBottomColor: MyColor.stroke,
    borderBottomWidth: 0.5,
    borderStyle: 'solid',
  },
  btnIcon: {
    height: iconSize.md,
    width: iconSize.md,
  },
  text: {
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 20,
    lineHeight: 30,
    margin: 'auto',
  },
});
