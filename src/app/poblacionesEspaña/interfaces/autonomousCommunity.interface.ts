export interface AutonomousCommunityResponse {
    total_count: number;
    results:     AutonomousCommunity[];
}
export interface AutonomousCommunity {
    acom_name:         string;
    geo_point_2d: GeoPoint2DCommunity;
  }

  export interface GeoPoint2DCommunity {
      lon: number;
      lat: number;
  }



