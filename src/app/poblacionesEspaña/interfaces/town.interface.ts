export interface TownResponse {
  total_count: number;
  results:     Town[];
}

export interface Town {
  geo_point_2d:   GeoPoint2DTown;
  year:           string;
  acom_code:      string;
  acom_name:      string;
  prov_code:      string;
  prov_name:      string;
  mun_code:       string;
  mun_name:       string;
  mun_area_code:  string;
  mun_type:       string;
  mun_name_local: null;
}

export interface GeoPoint2DTown {
  lon: number;
  lat: number;
}




