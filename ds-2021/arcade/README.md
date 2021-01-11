# ArcGIS API for JavaScript: Using Arcade with Your Apps

length: 60 min

presenters: Kristian Ekenes, Anne Fitz

On demand streaming

## Summary

This session will demonstrate how you can transform your data from one or more field values to computed data values for use in data visualizations, popup content, and labels. This session will start by providing a beginner's overview to the Arcade language. Then we'll show how you can use Arcade in advanced workflows to create immersive web apps for data exploration. We'll also demonstrate some tips and tricks for debugging Arcade expressions and point out how you can avoid common pitfalls. The session will close with a peek into the latest features introduced in Arcade and provide some hints of what you can expect in the future.

## Presentation

[Watch](---YouTube link---) the video presentation.

[![watch video presentation](---YouTube preview image---)](---YouTube link---)

## Slides

[Click here to download slides](https://github.com/ekenes/conferences/raw/master/ds-2021/arcade/slides.pptx)

## Outline

I. Intro to the session (Kristian) <5>
II. Language Overview (Anne) <10>
   A. Basic overview
   B. Feature sets
   C. New syntax (template literals)
III. Profiles and demos <25>
   A. Overview
   B. Viz (Kristian) <8>
      - field normalization
      - predominance (election 2020)
   C. Popup (Anne) <8>
      - basic
      - featureset
   D. Labels (Anne) <8>
      - Labeling with multiple label classes
      - simple expressions, implicit casting, multi-line expressions (in script)
IV. Generating Arcade (Kristian) <10>
  - Examples
    - Simple case (matches with simple viz sample)
    - Popup template generator (new)
    - Smart mapping (predominance/relationship/age)
V. Conclusion (Anne) <2>
  - Resources
  - Future

## Demos

### Playground

[Playground](https://developers.arcgis.com/arcade/playground/)

The playground allows you to choose an Arcade profile and experiment with any expression with test data.

### ArcGIS Online

[ArcGIS Online web map](https://jsapi.maps.arcgis.com/home/webmap/viewer.html?webmap=f3f83b97f9c14c1abe79ed49810ba023)

1. Normalization/Rounding (% population that didn't go to school)
2. Calculating new values (% population that went to college)
3. Predominant value (color) + strength of win (opacity)

### Labels

[Unit Conversion](https://ekenes.github.io/conferences/ds-2021/arcade/demos/unit-conversion/)

Converts temperature values from Fahrenheit to Celsius and displays the result as nicely formated labels for weather stations.

[![unit-conversion](images/unit-conversion.png)](https://ekenes.github.io/conferences/ds-2021/arcade/demos/unit-conversion/)

[Weather stations](https://developers.arcgis.com/javascript/latest/sample-code/labels-multiple-classes/index.html)

This app demonstrates how to use Arcade in simple and complex labeling expressions. As of the time of this presentation, the labeling profile is supported only in the 3.x versions of the ArcGIS API for JavaScript.

The calculation for determining wind direction (N/S/E/W) is done using a field that contains the compass direction of the wind (0-360).

[![label-classes](images/label-classes.png)](https://developers.arcgis.com/javascript/latest/sample-code/labels-multiple-classes/index.html)

[Labeling (multi-line sample)]((https://developers.arcgis.com/javascript/latest/sample-code/labels-multiline/index.html))

[See a 3D version of this app](https://developers.arcgis.com/javascript/latest/sample-code/layers-featurelayer-labeling-3d/live/index.html)

Other Labeling examples in the web map above:

- % population that didn't report education
- Predominant gap (label)

### Visualization

[Predominance in JS app](https://ekenes.github.io/conferences/ds-2021/arcade/demos/political-parties/)

This app visualizes the predominant political party among registered voters in the county level across the United States. The `Decode()` function of Arcade matches the maximum count of all relevant fields to a string value representing the respective party. This prevents the user or GIS analyst from unnecessarily preforming a series of field calculations in new fields. If the expression is incorrect in any way, it is relatively simple to fix the script as opposed to recalculating fields. Also note that an Arcade expression is used to drive opacity. More opaque features represent counties where the predominant political party is relatively strong. Transparent counties indicate the predominant party barely edges the rival parties based on total count.

[![predominance](images/predominance.png)](https://ekenes.github.io/conferences/ds-2021/arcade/demos/political-parties/)

[Wind Chill](https://ekenes.github.io/conferences/ds-2021/arcade/demos/wind-chill/)

This sample shows how to use Arcade for performing larger calculations and logicial tests. In this case, wind chill and heat index are calculated based on other field values that are potentially updated very frequently. The math operations aren't very complex, but you can use Arcade to automatically create pseudo-fields such as "Apparent temperature" to display calculated data based on fields that are frequently updated, such as weather data.

[![wind-chill](images/wind-chill.png)](https://ekenes.github.io/conferences/ds-2021/arcade/demos/wind-chill/)

[Earthquake dates](https://ekenes.github.io/esri-js-samples/4/visualization/arcade-time-day/)

This sample demonstrates how to use the date functions and time offsets to render data based on the local time in the time zone in which the event occurred. In this case we render earthquakes from the last month based on whether or not they occurred in the morning or evening in the local time of the event.

### Popups

[Reference Arcade expressions in PopupTemplate](https://ekenes.github.io/conferences/ds-2021/arcade/demos/popup-template/)

This sample demonstrates how to display values returned from an Arcade expression in a PopupTemplate defined on a FeatureLayer. Arcade is useful for creating visualizations in a FeatureLayer based on a value calculated from an expression executed on the client. PopupTemplates can reference the same expressions used in renderers to effectively communicate the data-driven visualization.

[Closest restaurant](https://ekenes.github.io/conferences/ds-2021/arcade/demos/popup-featuresets/closest-restaurant.html)

When a hotel point is clicked, the popup displays information about the closest restaurant to the hotel. The Arcade expression in the popup queries and finds the closest restaurant from another layer.

[![restaurants](images/restaurants.png)](https://ekenes.github.io/conferences/ds-2021/arcade/demos/popup-featuresets/closest-restaurant.html)

[Compare neighbors](https://ekenes.github.io/conferences/ds-2021/arcade/demos/popup-featuresets/compare-neighbors.html)

The popup uses an Arcade expression to compare an attribute value for the clicked/highlighted feature to the same value of all of its neighbors (the polygons that share a boundary with it). This is possible using Arcade feature sets in conjunction with the geometry engine.

[![nearest-neighbor](images/nearest-neighbor.png)](https://ekenes.github.io/conferences/ds-2021/arcade/demos/popup-featuresets/compare-neighbors.html)

[Floor Area Ratio](https://ekenes.github.io/conferences/ds-2021/arcade/demos/popup-featuresets/floor-area-ratio.html)

The popup in this sample calculates the ratio of the floor area of buildings within a parcel to the area of the parcel. It demonstrates how to calculate geometric intersections for cases where buildings may overlap multiple parcels.

[![far](images/far.png)](https://ekenes.github.io/conferences/ds-2021/arcade/demos/popup-featuresets/floor-area-ratio.html)

[Top 3 Crimes](https://ekenes.github.io/conferences/ds-2021/arcade/demos/popup-featuresets/top-3-crimes.html)

Presents a polygon layer that queries a point layer of crimes and lists the top 3 types of crimes in the popup.

[![crimes](images/crimes.png)](https://ekenes.github.io/conferences/ds-2021/arcade/demos/popup-featuresets/top-3-crimes.html)

### Z Values

[GeoJSONLayer with z](https://ycabon.github.io/2019-devsummit-plenary/2_geojson.html)

Renders earthquakes at their real-world depth based on an attribute value.

[Elevation options sample](https://developers.arcgis.com/javascript/latest/sample-code/scene-elevationinfo/live/index.html)

This sample shows how to change the elevation information of a 2D FeatureLayer for 3D visualization. Various options are available to customize the elevation of features in a 3D scene by modifying the elevationInfo property of a FeatureLayer.

An Arcade expression can be used to offset the elevation of features from the surface in a 3D app.

### Dynamic Arcade - Examples of generated scripts

[Generate Arcade Expressions for Smart Mapping](https://ekenes.github.io/conferences/ds-2021/arcade/demos/generate-arcade/)

Demonstrates how to generate arcade expressions based on user input and handle field aggregation and normalization for them without constructing complicated UIs.

[![generate](images/generate.png)](https://ekenes.github.io/conferences/ds-2021/arcade/demos/generate-arcade/)

[Explore data from a dynamic workspace](https://developers.arcgis.com/javascript/latest/sample-code/visualization-sm-sublayer/index.html)

This sample demonstrates how to use the Smart Mapping renderer creators to generate a renderer for a Sublayer created from a dynamic data layer. The dynamic layer joins ancestry data from a table in a dynamic workspace to a map service layer. Select elements are provided to the user, allowing him/her to dynamically change the renderer based on different ancestry variables and classification methods.

[Predominance explorer](https://ekenes.github.io/esri-ts-samples/visualization/smart-mapping/predominance/popup-template/)

This app demonstrates the predominance style in smart mapping, which generates Arcade in behalf of developers and users for visualization purposes. It also demonstrates how you can create your own functions for generating expressions dynamically in behalf of users.

## Resources

* [Community](https://developers.arcgis.com/en/javascript/jshelp/community.html)
* [ArcGIS for JavaScript API Resource Center](http://help.arcgis.com/en/webapi/javascript/arcgis/index.html)
* [ArcGIS Blog](https://www.esri.com/arcgis-blog/author/kekenes/)
* [Twitter @kekenes](http://twitter.com/kekenes)

## Licensing

Copyright 2021 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt](license.txt) file.