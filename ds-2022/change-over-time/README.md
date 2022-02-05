# ArcGIS API for JavaScript: Visualizing Change Over Time

length: 60 min

presenters: Kristian Ekenes, Anne Fitz

March 9, 2022 4:00 p.m. - 5:00 p.m. PST

Mesquite G-H | Palm Springs Convention Center

## Summary

In this session, you will learn several ways you can visualize change over time in web apps. This includes an overview of various widgets you can leverage that allow users to explore data. You will also learn about the rendering styles available in the API that are best suited for visualizing change in the same variable over time. Finally, we'll take a deep dive into learning how to create multi-dimensional animations of your data to view how data change at multiple intervals of time.

## Presentation

[Watch](---YouTube link---) the video presentation.

[![watch video presentation](---YouTube preview image---)](---YouTube link---)

## Slides

[Click here to download slides](https://github.com/ekenes/conferences/raw/master/ds-2022/change-over-time/slides.pptx)

## Outline

<https://www.esri.com/arcgis-blog/products/js-api-arcgis/mapping/six-ways-to-visualize-change-over-time-in-web-maps/>
<https://www.esri.com/about/newsroom/arcuser/animations/>

I. Techniques
   A. Swipe widget - demo (Anne)
   B. Above and below theme - demo (kristian)
   C. Side-by-side views - demo (anne)
II. Animations
   A. Geometry (Anne)
   B. Attribute (Kristian)
III. Conclusion
   A. Gotchas
   B. When to use which technique
   C. modified matrix

## Demos

### Viral

#### Explore COVID-19 data in the United States

The [following app](https://ekenes.github.io/covid19viz/) demonstrates how you can visualize COVID-19 data in a variety of ways using the same dataset. Use the time slider to explore this data through time. Each time the slider moves, the layer's renderer and popups update based on newly generated [Arcade expressions](https://developers.arcgis.com/arcade/).

##### Total Cases

[![viral](images/total-cases.png)](https://ekenes.github.io/covid19viz/)

##### Doubling Time

[![viral](images/doubling-time.png)](https://ekenes.github.io/covid19viz/)

##### Active Cases

[![viral](images/active-cases.png)](https://ekenes.github.io/covid19viz/)

##### Active Rate

[![viral](images/active-rate.png)](https://ekenes.github.io/covid19viz/)

##### Infection rate

[![viral](images/infection-rate.png)](https://ekenes.github.io/covid19viz/)

##### Total deaths

[![viral](images/total-deaths.png)](https://ekenes.github.io/covid19viz/)

##### Death rate

[![viral](images/death-rate.png)](https://ekenes.github.io/covid19viz/)

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

   <http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt](license.txt) file.
