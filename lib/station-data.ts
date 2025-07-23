import { StationData } from '@/types';

// This data is converted from public/images/station_data_with_aqi.csv
// In a real application, this would likely be fetched from an API.
export const stationData: StationData[] = [
  // ... (content of the CSV file will be converted and placed here)
  // For brevity, only a sample is shown. The agent will handle the full conversion.
  { station_name: "HONG KONG INTL", time: 1, TEMP2: 15.51, WSPD10: 7.29, WDIR10: 49.88, CO: 0.214, SO2: 0.0018, NO2: 0.0027, O3: 0.0359, PM10: 13.11, "PM2.5": 10.08, AQI: 14 },
  { station_name: "HONG KONG INTL", time: 2, TEMP2: 18.28, WSPD10: 5.58, WDIR10: 84.18, CO: 0.185, SO2: 0.0013, NO2: 0.0025, O3: 0.0327, PM10: 10.69, "PM2.5": 8.58, AQI: 12 },
  { station_name: "HONG KONG INTL", time: 3, TEMP2: 19.17, WSPD10: 4.19, WDIR10: 110.75, CO: 0.162, SO2: 0.0014, NO2: 0.0022, O3: 0.0325, PM10: 13.32, "PM2.5": 10.05, AQI: 14 },
  { station_name: "HONG KONG INTL", time: 4, TEMP2: 20.08, WSPD10: 4.13, WDIR10: 128.66, CO: 0.159, SO2: 0.0012, NO2: 0.0018, O3: 0.0320, PM10: 11.40, "PM2.5": 8.42, AQI: 12 },
  { station_name: "HONG KONG INTL", time: 5, TEMP2: 20.52, WSPD10: 3.90, WDIR10: 141.68, CO: 0.155, SO2: 0.0012, NO2: 0.0015, O3: 0.0288, PM10: 12.55, "PM2.5": 9.84, AQI: 14 },
  { station_name: "HONG KONG INTL", time: 6, TEMP2: 20.41, WSPD10: 3.61, WDIR10: 153.41, CO: 0.133, SO2: 0.0011, NO2: 0.0019, O3: 0.0145, PM10: 13.71, "PM2.5": 12.21, AQI: 17 },
  { station_name: "HONG KONG INTL", time: 7, TEMP2: 20.33, WSPD10: 4.03, WDIR10: 157.61, CO: 0.097, SO2: 0.0008, NO2: 0.0015, O3: 0.0128, PM10: 8.49, "PM2.5": 7.64, AQI: 11 },
  { station_name: "HONG KONG INTL", time: 8, TEMP2: 20.07, WSPD10: 3.92, WDIR10: 182.09, CO: 0.129, SO2: 0.0010, NO2: 0.0028, O3: 0.0135, PM10: 13.53, "PM2.5": 12.32, AQI: 18 },
  { station_name: "HONG KONG INTL", time: 9, TEMP2: 20.45, WSPD10: 3.78, WDIR10: 131.89, CO: 0.125, SO2: 0.0014, NO2: 0.0022, O3: 0.0201, PM10: 11.76, "PM2.5": 10.61, AQI: 15 },
  { station_name: "HONG KONG INTL", time: 10, TEMP2: 21.93, WSPD10: 4.83, WDIR10: 88.36, CO: 0.153, SO2: 0.0015, NO2: 0.0023, O3: 0.031, PM10: 12.9, "PM2.5": 10.1, AQI: 14 },
  { station_name: "HONG KONG INTL", time: 11, TEMP2: 23.5, WSPD10: 5.2, WDIR10: 75.0, CO: 0.18, SO2: 0.0018, NO2: 0.0028, O3: 0.038, PM10: 15.0, "PM2.5": 12.0, AQI: 17 },
  { station_name: "HONG KONG INTL", time: 12, TEMP2: 24.0, WSPD10: 6.0, WDIR10: 65.0, CO: 0.2, SO2: 0.002, NO2: 0.003, O3: 0.04, PM10: 18.0, "PM2.5": 15.0, AQI: 21 }
];
