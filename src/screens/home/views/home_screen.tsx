// src/screens/HomeScreen.tsx
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
// import ClassCard from '../../../components/ClassCard';
// import SessionCard from '../../../components/SessionCard';
import ListSessions from '../../../components/ListSessions';
import Search from '../../../components/Search';
import Title from '../../../components/Title';
import {commonStyle} from '../../../constants/common';
import {type Filter} from '../../../constants/filter';
import {searchServices} from '../../../service/search/searchServices';
import Tag from '../../search/components/Tag';
import FilterScreen from '../../search/views/filter_screen';

const HomeScreen = ({navigation}) => {
  const LIST_TAB = ['SESSIONS', 'CLASSES', 'CATEGORIES', 'INSTRUCTORS'];
  const [selectedTab, setSelectedTab] = useState('SESSIONS');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter | null>(null);
  const [listIns, setListIns] = useState<{id: string; name: string}[]>([]);

  const handleSearchSubmit = () => {
    fetchData(searchQuery);
  };

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
    // console.log({searchResults: searchResults});
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  useEffect(() => {
    const getListInsData = async () => {
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
    getListInsData();
  }, []);

  return (
    <View>
      {/* title */}
      <Title iconBtn={false} navigation={navigation} title={'HOME'} />
      {/* TABS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabs}>
          {LIST_TAB.map((tab, index) => {
            return (
              <Tag
                selected={selectedTab === tab}
                onClick={() => {
                  setSelectedTab(tab);
                }}
                key={index}
                text={tab}
                style={[commonStyle.borderStyle, styles.tabStyle]}
              />
            );
          })}
        </View>
      </ScrollView>
      {/* SEARCH INPUT */}
      <Search
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchSubmit={handleSearchSubmit}
        setShowFilter={setShowFilter}
      />
      <FilterScreen
        show={showFilter}
        onClose={() => {
          setShowFilter(false);
        }}
        onSelect={value => {
          setFilter(value);
        }}
      />
      {/* LIST CARD RESULT */}
      <ListSessions searchResults={searchResults} listIns={listIns} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'column',
    gap: 24,
  },
  tabs: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 13,
  },
  tabStyle: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});

export default HomeScreen;
