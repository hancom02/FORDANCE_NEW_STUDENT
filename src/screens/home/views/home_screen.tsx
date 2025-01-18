// src/screens/HomeScreen.tsx
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import ListClasses from '../../../components/ListClasses';
import ListSessions from '../../../components/ListSessions';
import Search from '../../../components/Search';
import Title from '../../../components/Title';
import {commonStyle} from '../../../constants/common';
import {type Filter} from '../../../constants/filter';
import {searchServices} from '../../../service/search/searchServices';
import Tag from '../../search/components/Tag';
import FilterScreen from '../../search/views/filter_screen';
import ListInstructor from '../../../components/ListInstructor';

const HomeScreen = ({navigation}) => {
  const LIST_TAB = ['SESSIONS', 'CLASSES', 'INSTRUCTORS'];
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
    let data = [];
    let error = '';
    switch (selectedTab) {
      case 'SESSIONS':
        try {
          const result = await searchServices.searchSessionName({
            filter: filter,
            textSearch: query,
          });
          data = result.data;
          error = result.error;
        } catch (error) {
          console.error('Error searching data:', error.message);
          return;
        }

        break;
      case 'CLASSES':
        try {
          const result = await searchServices.searchClassName({
            filter: filter,
            textSearch: query,
          });
          data = result.data;
          error = result.error;
        } catch (error) {
          console.error('Error searching data:', error.message);
          return;
        }
        break;
      case 'INSTRUCTORS':
        try {
          const result = await searchServices.searchInstructorName({
            textSearch: query,
          });
          data = result.data;
          error = result.error;
        } catch (error) {
          console.error('Error searching data:', error.message);
          return;
        }
        break;
    }

    if (error) {
      console.error('Error searching data:', error);
      return;
    }
    console.log({searcData: data});
    setSearchResults(data);
    // console.log({searchResults: searchResults});
  };

  useEffect(() => {
    fetchData();
  }, [filter, selectedTab]);

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
      <ScrollView
        style={styles.scrollView}
        horizontal
        showsHorizontalScrollIndicator={false}>
        <View style={styles.tabs}>
          {LIST_TAB.map((tab, index) => {
            return (
              <Tag
                selected={selectedTab === tab}
                onClick={() => {
                  setSelectedTab(tab);
                  setSearchQuery('');
                  setFilter(null);
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
        hidden={!(selectedTab === 'INSTRUCTORS')}
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
      {selectedTab === LIST_TAB[0] ? (
        <ListSessions searchResults={searchResults} listIns={listIns} />
      ) : selectedTab === LIST_TAB[1] ? (
        <ListClasses searchResults={searchResults} />
      ) : (
        <ListInstructor listIns={searchResults} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'column',
    gap: 24,
    marginBottom: 100
  },
  scrollView: {height: '10%'},
  tabs: {
    // height: '100%',
    // marginTop: 12,
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