import React, {useState} from 'react';
import {
  View,
  Image,
  TextInput,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {appFontSize, iconSize} from '../../../constants/dimensions';
import {StyleSheet} from 'react-native';
import MyColor from '../../../constants/color';
import SessionCard from '../components/SessionCard';

export default function SearchScreen() {
  const [btnSelected, setBtnSelected] = useState('sessions');
  return (
    <View>
      {/* search input */}
      <View style={styles.mainInputContainer}>
        <TouchableHighlight>
          <View>
            <Image
              source={require('../../../assests/img/Arrow_left.png')}
              style={styles.btnIcon}
            />
          </View>
        </TouchableHighlight>
        <View style={styles.inputWrapper}>
          <Image
            source={require('../../../assests/img/icon.png')}
            style={styles.logo}></Image>
          <TextInput style={styles.textInput} placeholder="Search" />
        </View>
      </View>
      <View style={styles.btnGroup}>
        <TouchableOpacity
          key={'sessions'}
          style={[
            styles.btn,
            btnSelected === 'sessions'
              ? styles.selectedBtn
              : styles.notSelectedBtn,
          ]}
          onPress={() => {
            Alert.alert('Left button pressed');
            setBtnSelected('sessions');
          }}>
          <Text
            style={[
              styles.buttonText,
              btnSelected === 'sessions'
                ? styles.btnTextSelected
                : styles.btnTextNotSelected,
            ]}>
            SESSIONS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={'classes'}
          style={[
            styles.btn,
            btnSelected === 'classes'
              ? styles.selectedBtn
              : styles.notSelectedBtn,
          ]}
          onPress={() => {
            Alert.alert('Right button pressed');
            setBtnSelected('classes');
          }}>
          <Text
            style={[
              styles.buttonText,
              btnSelected === 'classes'
                ? styles.btnTextSelected
                : styles.btnTextNotSelected,
            ]}>
            CLASSES
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bodyContainer}>
        {/* <Text>Please enter query to search</Text> */}
        <SessionCard></SessionCard>
      </View>
    </View>
  );
}

const myPadding = {
  horizontal: 13,
  vertical: 16,
};

const styles = StyleSheet.create({
  mainInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingHorizontal: myPadding.horizontal,
    paddingVertical: myPadding.vertical,
    borderBottomColor: MyColor.stroke,
    borderBottomWidth: 0.5,
    borderStyle: 'solid',
  },
  inputWrapper: {
    flex: 1,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 10,
    borderColor: MyColor.stroke,
  },
  logo: {
    height: iconSize.sm,
    width: iconSize.sm,
  },
  btnIcon: {
    height: iconSize.md,
    width: iconSize.md,
  },

  textInput: {
    flex: 1,
    fontSize: appFontSize,
  },
  btnGroup: {
    paddingHorizontal: 25,
    paddingVertical: myPadding.vertical,
    flexDirection: 'row',
    gap: 15,
  },
  btn: {
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  selectedBtn: {backgroundColor: MyColor.primary},
  notSelectedBtn: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#C4C4C4C2',
    borderStyle: 'solid',
  },
  btnTextSelected: {color: 'white'},
  btnTextNotSelected: {color: 'black'},
  buttonText: {
    fontWeight: 700,
    fontFamily: 'Poppins',
    fontSize: appFontSize,
  },

  bodyContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    height: 'auto',
    paddingHorizontal: myPadding.horizontal,
    paddingVertical: myPadding.vertical,
  },
});
