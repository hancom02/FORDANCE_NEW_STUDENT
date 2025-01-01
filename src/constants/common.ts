import {StyleSheet} from 'react-native';
import MyColor from './color';

export const iconSize = {
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};
export const appFontSize = 13;

export const commonStyle = StyleSheet.create({
  borderStyle: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: MyColor.stroke,
    // border: 1px solid var(--Color-stroke, #C4C4C4BF)
  },
});
