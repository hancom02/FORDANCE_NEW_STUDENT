export const LIST_LEVELS: string[] = ['beginner', 'intermediate', 'advanced'];
export const LIST_GENRES: string[] = [
  'mutigenre',
  'ballet',
  'hiphop',
  'folk',
  'sexy',
  'wacking',
  'locking',
  'vogue',
  'contemporary dance',
  'choreography',
];
export const LIST_LENGTH: {value: number; name: string}[] = [
  {value: 1200, name: '20 min or less'},
  {value: 3000, name: '20 - 50 min'},
];
export type Filter = {
  levels?: string[];
  genres?: string[];
  listIns?: {id: string; name: string}[];
  listLengths?: {value: number; name: string}[];
};
