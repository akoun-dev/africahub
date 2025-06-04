
import { WEST_AFRICA_COUNTRIES } from './westAfrica';
import { EAST_AFRICA_COUNTRIES } from './eastAfrica';
import { SOUTHERN_AFRICA_COUNTRIES } from './southernAfrica';
import { NORTH_AFRICA_COUNTRIES } from './northAfrica';
import { CENTRAL_AFRICA_COUNTRIES } from './centralAfrica';
import { AfricaCountryInfo } from '../types';

export const AFRICA_COUNTRIES: Record<string, AfricaCountryInfo> = {
  ...WEST_AFRICA_COUNTRIES,
  ...EAST_AFRICA_COUNTRIES,
  ...SOUTHERN_AFRICA_COUNTRIES,
  ...NORTH_AFRICA_COUNTRIES,
  ...CENTRAL_AFRICA_COUNTRIES
};

export { 
  WEST_AFRICA_COUNTRIES, 
  EAST_AFRICA_COUNTRIES, 
  SOUTHERN_AFRICA_COUNTRIES,
  NORTH_AFRICA_COUNTRIES,
  CENTRAL_AFRICA_COUNTRIES
};
