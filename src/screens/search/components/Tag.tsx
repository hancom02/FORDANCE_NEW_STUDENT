import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Tag = ({
  text = null,
  textColor = 'black',
  bgColor = 'white',
  weight = null,
  size = 15,
  style = {},
  children = null,
}) => {
  return (
    <View style={[styles.tag, {backgroundColor: bgColor}, style]}>
      {children}
      <Text
        style={{color: textColor, fontWeight: weight ?? 600, fontSize: size}}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'center',
  },
});

export default Tag;
