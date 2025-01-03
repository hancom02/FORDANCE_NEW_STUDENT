import {Alert} from 'react-native';
import {supabase} from '../../supabase_config/supabase';
import {type Filter} from '../../constants/filter';

async function searchSessionName(input: {
  filter?: Filter;
  textSearch?: string;
}) {
  try {
    let query = supabase.from('sessions').select('*');
    if (input.textSearch) {
      query = query.textSearch('session_name', input.textSearch);
    }
    if (input.filter) {
      console.log({input: input.filter.levels});
      if (input.filter.levels?.length > 0) {
        const string = `level.in.(${input.filter.levels
          .map(value => `"${value}"`)
          .join(',')})`;
        query = query.or(string);
      }
      if (input.filter.listIns?.length > 0) {
        const string = `instructor_id.in.(${input.filter.listIns
          .map(value => `"${value.id}"`)
          .join(',')})`;
        query = query.or(string);
      }
      if (input.filter.genres?.length > 0) {
        const string = `genre.in.(${input.filter.genres
          .map(value => `"${value}"`)
          .join(',')})`;
        console.log({genre: string});
        query = query.or(string);
      }
    }
    query = query.order('id', {ascending: true});
    const response = await query;
    // console.log({data: response.data});
    return {data: response.data, error: response.error};
  } catch (error) {
    Alert.alert('Error searching data:', error.message);
    return {data: null, error: error.message};
  }
}
async function searchClassName(input: {filter?: Filter; textSearch?: string}) {
  try {
    let query = supabase.from('classes').select('*');
    if (input.textSearch) {
      query = query.textSearch('class_name', input.textSearch);
    }
    if (input.filter) {
      console.log({input: input.filter.levels});
      if (input.filter.levels?.length > 0) {
        const string = `level.in.(${input.filter.levels
          .map(value => `"${value}"`)
          .join(',')})`;
        query = query.or(string);
      }
      if (input.filter.listIns?.length > 0) {
        const string = `instructor_id.in.(${input.filter.listIns
          .map(value => `"${value.id}"`)
          .join(',')})`;
        query = query.or(string);
      }
      if (input.filter.genres?.length > 0) {
        const string = `genre.in.(${input.filter.genres
          .map(value => `"${value}"`)
          .join(',')})`;
        console.log({genre: string});
        query = query.or(string);
      }
    }
    query = query.order('id', {ascending: true});
    const response = await query;
    console.log({class: response.data});
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

async function getListIns() {
  try {
    const response = await supabase
      .from('users')
      .select('id, name, avatar_url')
      .eq('role', 'instructor');
    console.log({data: response.data});
    return {data: response.data, error: response.error};
  } catch (error) {
    Alert.alert('Error searching data:', error.message);
    return {data: null, error: error.message};
  }
}

export const searchServices = {
  searchSessionName,
  searchClassName,
  totalPages,
  getListIns,
};
