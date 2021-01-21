import esri = __esri;

import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");

import colorRendererCreator = require("esri/renderers/smartMapping/creators/color");
import histogram = require("esri/renderers/smartMapping/statistics/histogram");
import ColorSlider = require("esri/widgets/smartMapping/ColorSlider");
import Legend = require("esri/widgets/Legend");
import lang = require("esri/core/lang");
import { ClassBreaksRenderer } from "esri/rasterRenderers";

(async () => {

  //
  // Create map with a single FeatureLayer
  //

  const layer = new FeatureLayer({
    portalItem: {
      id: "b975d17543fb4ab2a106415dca478684"
    }
  });

  const map = new EsriMap({
    basemap: {
      portalItem: {
        id: "4f2e99ba65e34bb8af49733d9778fb8e"
      }
    },
    layers: [ layer ]
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [ -99.5789795341516, 19.04471398160347],
    zoom: 7
  });

  view.ui.add(new Legend({ view: view }), "bottom-right");

  await view.when();

  // You can pass an Arcade expression to the renderer creator function
  // to normalize values and round them. Or you can write more complex
  // multi-line expressions that may be referenced from a separate
  // script tag as text or from another file

  const rendererParams = {
    layer: layer,
    valueExpression: "Round( ( $feature.EDUC01_CY / $feature.EDUCA_BASE ) * 100 )",
    valueExpressionTitle: "% population with no formal education",
    basemap: view.map.basemap,
    view: view
  };

  const rendererResponse = await colorRendererCreator.createContinuousRenderer(rendererParams);

  // apply renderer to layer after the promise resolves

  layer.renderer = rendererResponse.renderer;

  // generate a histogram for the given arcade expression

  const rendererHistogram = await histogram({
    layer,
    view,
    valueExpression: "Round( ( $feature.EDUC01_CY / $feature.EDUCA_BASE ) * 100 )",
    numBins: 30
  });

  const sliderContainer = document.createElement("div");
  const panelDiv = document.getElementById("panel");
  panelDiv.appendChild(sliderContainer);
  view.ui.add(panelDiv, "bottom-left");

  const colorSlider = ColorSlider.fromRendererResult(rendererResponse, rendererHistogram);
  colorSlider.container = sliderContainer;

  colorSlider.on("thumb-drag", () => {
    const renderer = layer.renderer as ClassBreaksRenderer;
    const rendererClone = renderer.clone();
    const colorVariable = rendererClone.visualVariables[0] as esri.ColorVariable;
    colorVariable.stops = colorSlider.stops;
    rendererClone.visualVariables = [ colorVariable ];
    layer.renderer = rendererClone;
  });

})();