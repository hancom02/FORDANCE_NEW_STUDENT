import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import MyColor from '../../../constants/color';
import {appFontSize, iconSize, myPadding} from '../../../constants/common';
import {searchServices} from '../../../service/search/searchServices';
// import ClassCard from '../components/ClassCard';
import SessionCard from '../../../components/SessionCard';
import {type Filter} from '../../../constants/filter';
import FilterScreen from './filter_screen';
export default function SearchScreen({}) {
  const [btnSelected, setBtnSelected] = useState('sessions');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter | null>(null);

  const fetchData = async (query?: string) => {
    const {data, error} = await searchServices.searchSessionName({
      filter: filter,
      textSearch: query,
    });
    if (error) {
      console.error('Error searching data:', error.message);
      return;
    }

    setSearchResults(data);

    // const count = await searchServices.totalPages;

    // const totalItems = count ?? 0;
    // const totalPage = Math.ceil((totalItems as number) / ITEMS_PER_PAGE);
    // setTotalPages(totalPage);
  };

  const handleSearch = () => {
    fetchData(searchQuery);
  };
  const handleSearchSubmit = () => {
    handleSearch();
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  // const handleLoadMore = () => {
  //   if (page < totalPages) {
  //     setPage(page + 1);
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {/* icon button */}
        <TouchableHighlight>
          <View>
            <Image
              source={require('../../../assests/img/Arrow_left.png')}
              style={styles.btnIcon}
            />
          </View>
        </TouchableHighlight>
        {/* search input */}
        <View style={styles.inputWrapper}>
          <Image
            source={require('../../../assests/img/icon.png')}
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

        {/* icon button */}
        <TouchableHighlight
          onPress={() => {
            setShowFilter(true);
          }}>
          <View>
            <Image
              source={require('../../../assests/img/Filter_alt.png')}
              style={styles.btnIcon}
            />
          </View>
        </TouchableHighlight>
      </View>
      <View style={styles.btnGroup}>
        {/* sessions btn */}
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
        {/* classes */}
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
      <FlatList
        style={styles.flatList}
        data={searchResults}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <SessionCard
            linkImg={{uri: item.thumbnail_url}}
            name={item.session_name}
            level={item.level}
            genre={item.genre}
          />
        )}
        // onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      />
      {/* <SessionCard /> */}
      {/* <ClassCard /> */}
      <FilterScreen
        show={showFilter}
        onClose={() => {
          setShowFilter(false);
        }}
        onSelect={value => {
          setFilter(value);
        }}
      />
    </View>
  );
}

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
