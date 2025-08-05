export interface ProvinceResponse {
    total_count: number;
    results:     Province[];
}

export interface Province {
    acom_code:       string;
    acom_name:       string;
    prov_code:       string;
    prov_name:       string;
    geo_point_2d: GeoPoint2DProvince;
  }

  export interface GeoPoint2DProvince {
      lon: number;
      lat: number;
  }


