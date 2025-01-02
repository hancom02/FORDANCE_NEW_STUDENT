import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type StyleProp,
  ViewStyle,
} from 'react-native';
import MyColor from '../../../constants/color';

type Props = {
  text?: string;
  textColor?: string;
  bgColor?: string;
  weight?: any;
  size?: number;
  style?: StyleProp<ViewStyle>;
  children?: any;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};
const Tag = ({
  text = null,
  textColor = 'black',
  bgColor = 'white',
  weight = null,
  size = 15,
  style = {},
  children = null,
  selected = false,
  disabled = false,
  onClick,
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.tag,
        {backgroundColor: selected ? MyColor.primary : bgColor},
        style,
      ]}
      onPress={() => {
        if (onClick) {
          onClick();
        }
      }}>
      {children}
      <Text
        style={{
          color: selected ? 'white' : textColor,
          fontWeight: weight ?? 600,
          fontSize: size,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
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
