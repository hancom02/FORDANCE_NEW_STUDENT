import React from 'react';
import {
  View,
  TouchableHighlight,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {appFontSize, commonStyle, iconSize} from '../../../constants/common';
import MyColor from '../../../constants/color';
import Tag from '../components/Tag';

const FilterScreen = ({navigation}) => {
  return (
    <ScrollView>
      <View>
        <View style={styles.title}>
          {/* icon button */}
          <TouchableHighlight
            onPress={() => navigation.navigate('SearchScreen')}>
            <View>
              <Image
                source={require('../../../assests/img/Arrow_left.png')}
                style={styles.btnIcon}
              />
            </View>
          </TouchableHighlight>
          <Text style={styles.text}>Filter</Text>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.flexRow}>
            <Tag text={'SESSIONS'} style={commonStyle.borderStyle} />
            <Tag text={'CLASSES'} style={commonStyle.borderStyle} />
          </View>
          <Text style={styles.text}>Level</Text>
          <View style={styles.flexRow}>
            <Tag text={'BEGINNER'} style={commonStyle.borderStyle} />
            <Tag text={'INTERMEDIATE'} style={commonStyle.borderStyle} />
            <Tag text={'ADVANCED'} style={commonStyle.borderStyle} />
          </View>
          <Text style={styles.text}>Styles</Text>
          <View style={styles.flexRow}>
            <Tag text={'BALLET'} style={commonStyle.borderStyle} />
            <Tag text={'BREAKING/B-BOYING'} style={commonStyle.borderStyle} />
            <Tag text={'CONTEMPORARY'} style={commonStyle.borderStyle} />
            <Tag text={'DANCE WORKOUT'} style={commonStyle.borderStyle} />
            <Tag text={'DANCEHALL'} style={commonStyle.borderStyle} />
            <Tag text={'HEELS'} style={commonStyle.borderStyle} />
            <Tag text={'HIPHOP'} style={commonStyle.borderStyle} />
            <Tag text={'HOUSE'} style={commonStyle.borderStyle} />
            <Tag text={'JAZZ'} style={commonStyle.borderStyle} />
            <Tag text={'JAZZ FUNK'} style={commonStyle.borderStyle} />
            <Tag text={'K-POP'} style={commonStyle.borderStyle} />
            <Tag text={'KRUMP'} style={commonStyle.borderStyle} />
            <Tag text={'LOCKING'} style={commonStyle.borderStyle} />
            <Tag text={'KRUMP'} style={commonStyle.borderStyle} />
            <Tag text={'OPEN STYLE'} style={commonStyle.borderStyle} />
          </View>
          <Text style={styles.text}>Type</Text>
          <View style={styles.flexRow}>
            <Tag text={'BARE'} style={commonStyle.borderStyle} />
            <Tag text={'CENTER'} style={commonStyle.borderStyle} />
          </View>
          <Text style={styles.text}>Length</Text>
          <View style={styles.flexRow}>
            <Tag text={'20 MIN OR LESS'} style={commonStyle.borderStyle} />
            <Tag text={'20 - 50 MIN'} style={commonStyle.borderStyle} />
          </View>
          <Text style={styles.text}>Instructors</Text>
          <View style={styles.flexRow}>
            <Tag text={'ABEY'} style={commonStyle.borderStyle} />
            <Tag text={'AUBREY ARES'} style={commonStyle.borderStyle} />
          </View>
          <TouchableOpacity
            key={'sessions'}
            style={styles.btn}
            onPress={() => {
              Alert.alert('Left button pressed');
            }}>
            <Text style={styles.buttonText}>SHOW RESULTS</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <View>
              <Text style={styles.btnClear}>CLEAR ALL</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default FilterScreen;

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
  mainContainer: {
    flexDirection: 'column',
    gap: 16,

    paddingHorizontal: myPadding.horizontal,
    paddingVertical: myPadding.vertical,
  },
  flexRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    flexWrap: 'wrap',
  },
  buttonText: {
    fontWeight: 700,
    fontFamily: 'Poppins',
    fontSize: appFontSize,
    color: 'white',
    alignItems: 'center',
  },
  btn: {
    borderRadius: 4,
    paddingVertical: myPadding.vertical,
    backgroundColor: MyColor.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnClear: {
    color: 'black',
    fontSize: 10,
    fontWeight: 900,
    lineHeight: 15,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
});
