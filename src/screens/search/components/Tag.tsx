import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Tag = ({name, textColor, bgColor, weight}) => {
  return (
    <View style={[styles.tag, {backgroundColor: bgColor}]}>
      <Text style={{color: textColor, fontWeight: weight}}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    borderRadius: 4,
    marginHorizontal: 6,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'center',
  },
});

export default Tag;
