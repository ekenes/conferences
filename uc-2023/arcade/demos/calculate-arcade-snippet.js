var crimes = FeatureSetByPortalItem(
  Portal("https://www.arcgis.com"),
  "bc1959d9b378482091445ab89865bc42", 0,
  ["id"], true
);

Count(Intersects(crimes, $feature));