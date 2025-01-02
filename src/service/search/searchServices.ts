import {Alert} from 'react-native';
import {supabase} from '../../supabase_config/supabase';
import {ITEMS_PER_PAGE} from '../../constants/common';

async function searchSessionName(value, pageNumber) {
  try {
    const response = await supabase
      .from('sessions')
      .select('*')
      .textSearch('session_name', value)
      .range((pageNumber - 1) * ITEMS_PER_PAGE, pageNumber * ITEMS_PER_PAGE - 1)
      .order('id', {ascending: true});

    console.log({data: response.data});
    return {data: response.data, error: response.error};
  } catch (error) {
    Alert.alert('Error searching data:', error.message);
    return {data: null, error: error.message};
  }
}

// Calculate total pages based on the total number of items
async function totalPages(query) {
  const {count} = await supabase
    .from('sessions')
    .select('id', {count: 'exact'})
    .textSearch('session_name', query);
  return count;
}

export const searchServices = {searchSessionName, totalPages};
