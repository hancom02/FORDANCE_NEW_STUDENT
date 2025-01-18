import React from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import MyColor from '../constants/color';
import {appFontSize, iconSize, myPadding} from '../constants/common';

const Search = ({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  setShowFilter,
  hidden = false,
}) => {
  return (
    <View style={styles.searchContainer}>
      {/* search input */}
      <View style={styles.inputWrapper}>
        <Image
          source={require('../assests/img/icon.png')}
          style={styles.logo}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          onSubmitEditing={handleSearchSubmit}
        />
      </View>
      {hidden && (
        <TouchableHighlight
          onPress={() => {
            setShowFilter(true);
          }}>
          <View>
            <Image
              source={require('../assests/img/Filter_alt.png')}
              style={styles.btnIcon}
            />
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
};

export default Search;
const styles = StyleSheet.create({
  container: {position: 'relative', width: '100%', height: '100%'},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 7,
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
    marginVertical: myPadding.vertical,
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
    gap: 24,
    // height: 'auto',
    paddingHorizontal: myPadding.horizontal,
    // paddingVertical: myPadding.vertical,
  },
  flatList: {
    marginBottom: 100,
    // paddingBottom: 500,
  },
});
