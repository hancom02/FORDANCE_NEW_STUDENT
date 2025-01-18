import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MyColor from '../../../constants/color';
import {appFontSize, commonStyle, iconSize} from '../../../constants/common';
import {
  LIST_GENRES,
  LIST_LEVELS,
  type Filter,
} from '../../../constants/filter';
import Tag from '../components/Tag';
import {searchServices} from '../../../service/search/searchServices';

type Props = {
  show: boolean;
  onClose: () => void;
  onSelect: (value: Filter) => void;
};
const FilterScreen = (props: Props) => {
  const [listIns, setListIns] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const {data, error} = await searchServices.getListIns();
        if (error) {
          throw new Error(error.message);
        }
        setListIns(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchItems();
  }, []);

  const [filter, setFilter] = useState<Filter>({
    levels: [],
    genres: [],
    listIns: [],
    listLengths: [],
  });
  const selectedIndex = (value: string, nameList: string) => {
    if (filter[nameList]) {
      return filter[nameList].indexOf(value);
    } else {
      return -1;
    }
  };
  function listChange(value: string, nameList: string) {
    // const newFilter = [...filter[nameList]];
    const newFilter = [...(filter[nameList] ?? [])];
    const index = selectedIndex(value, nameList);
    if (index > -1) {
      newFilter.splice(index, 1);
    } else {
      newFilter.push(value);
    }
    setFilter({...filter, [nameList]: [...newFilter]});
  }

  // const genreSelectedIndex = (value: string) => filter.genres.indexOf(value);
  // function genreChange(value: string) {
  //   const newFilter = [...filter.genres];
  //   const index = genreSelectedIndex(value);
  //   if (index > -1) {
  //     newFilter.splice(index, 1);
  //   } else {
  //     newFilter.push(value);
  //   }
  //   setFilter({...filter, genres: [...newFilter]});
  // }

  const insSelectedIndex = (value: string) => {
    if (filter.listIns) {
      const index = filter.listIns.findIndex(item => item.id === value);
      return index;
    }
    return -1;
  };
  function insChange(ins: {id: string; name: string}) {
    const newFilter = [...filter.listIns];
    const index = insSelectedIndex(ins.id);
    if (index > -1) {
      newFilter.splice(index, 1);
    } else {
      newFilter.push(ins);
    }
    setFilter({...filter, listIns: [...newFilter]});
  }

  return (
    <>
      {props.show && (
        <ScrollView style={styles.scrollView}>
          <View>
            <View style={styles.title}>
              <Text style={styles.text}>Filter</Text>
            </View>
            <View style={styles.mainContainer}>
              <Text style={styles.text}>Level</Text>
              <View style={styles.flexRow}>
                {LIST_LEVELS.map((level, index) => {
                  return (
                    <Tag
                      selected={selectedIndex(level, 'levels') > -1}
                      onClick={() => {
                        listChange(level, 'levels');
                      }}
                      key={index}
                      text={level.toUpperCase()}
                      style={commonStyle.borderStyle}
                    />
                  );
                })}
              </View>
              <Text style={styles.text}>Styles</Text>
              <View style={styles.flexRow}>
                {LIST_GENRES.map((genre, index) => {
                  return (
                    <Tag
                      selected={selectedIndex(genre, 'genres') > -1}
                      onClick={() => {
                        listChange(genre, 'genres');
                      }}
                      key={index}
                      text={genre.toUpperCase()}
                      style={commonStyle.borderStyle}
                    />
                  );
                })}
              </View>
              <Text style={styles.text}>Instructors</Text>
              <View style={styles.flexRow}>
                {listIns.map(ins => {
                  return (
                    <Tag
                      selected={insSelectedIndex(ins.id) > -1}
                      onClick={() => {
                        insChange(ins);
                      }}
                      key={ins.id}
                      text={ins.name.toUpperCase()}
                      style={commonStyle.borderStyle}
                    />
                  );
                })}
              </View>
              <TouchableOpacity
                key={'sessions'}
                style={styles.btn}
                onPress={() => {
                  console.log({filter: filter.levels});
                  props.onSelect(filter);
                  props.onClose();
                  Alert.alert('Left button pressed');
                }}>
                <Text style={styles.buttonText}>SHOW RESULTS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.onClose();
                }}>
                <View>
                  <Text style={styles.btnClear}>Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default FilterScreen;

const myPadding = {
  horizontal: 16,
  vertical: 13,
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 99,
    backgroundColor: '#FFFFFF',
  },
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
    fontSize: 15,
    fontWeight: 900,
    lineHeight: 15,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
});
