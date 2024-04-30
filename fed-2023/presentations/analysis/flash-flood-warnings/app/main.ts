import esri = __esri;

import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import FeatureFilter = require("esri/views/layers/support/FeatureFilter");
import FeatureEffect = require("esri/views/layers/support/FeatureEffect");
import StatisticDefinition = require("esri/tasks/support/StatisticDefinition");
import { SimpleFillSymbol } from "esri/symbols";
import { SimpleRenderer } from "esri/renderers";
import { updateGrid } from "./heatmapChart";

import Expand = require("esri/widgets/Expand");
import { durations, seasons } from "./constants";

( async () => {

  const layer = new FeatureLayer({
    portalItem: {
      id: "f9e348953b3848ec8b69964d5bceae02"
    },
    outFields: [ "DurationClass", "SEASON" ]
  });

  const countiesLayer = new FeatureLayer({
    title: "counties",
    portalItem: {
      id: "7566e0221e5646f99ea249a197116605"
    },
    popupTemplate: null,
    opacity: 0,
    renderer: new SimpleRenderer({
      symbol: new SimpleFillSymbol({
        color: [ 0,0,0,1 ],
        outline: null
      })
    })
  });

  const map = new EsriMap({
    basemap: "gray-vector",
    layers: [ layer, countiesLayer ]
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [ -97.20977281984334, 40.29693762632632 ],
    zoom: 4,
    highlightOptions: {
      color: "#262626",
      haloOpacity: 1,
      fillOpacity: 0
    }
  });

  await view.when();
  const seasonsElement = document.getElementById("seasons-filter");
  seasonsElement.style.visibility = "visible";
  const chartExpand = new Expand({
    view,
    content: document.getElementById("chartDiv"),
    expandIconClass: "esri-icon-chart",
    group: "top-left"
  });
  const seasonsExpand = new Expand({
    view,
    content: seasonsElement,
    expandIconClass: "esri-icon-filter",
    group: "top-left"
  });
  view.ui.add(seasonsExpand, "top-left");
  view.ui.add(chartExpand, "top-left");
  view.ui.add("titleDiv", "top-right");

  const layerView = await view.whenLayerView(layer) as esri.FeatureLayerView;
  const countiesLayerView = await view.whenLayerView(countiesLayer) as esri.FeatureLayerView;

  const layerStats = await queryLayerStatistics(layer);
  updateGrid(layerStats, layerView);

  seasonsElement.addEventListener("click", filterBySeason);
  const seasonsNodes = document.querySelectorAll(`.season-item`);

  function filterBySeason (event: any) {
    const selectedSeason = event.target.getAttribute("data-season");
    seasonsNodes.forEach( (node:HTMLDivElement) => {
      const season = node.innerText;
      if(season !== selectedSeason){
        if(node.classList.contains("visible-season")) {
          node.classList.remove("visible-season");
        }
      } else {
        if(!node.classList.contains("visible-season")) {
          node.classList.add("visible-season");
        }
      }
    });

    layerView.filter = new FeatureFilter({
      where: `Season = '${selectedSeason}'`
    });
  }

  function resetOnCollapse (expanded:boolean) {
    if (!expanded){
      resetVisuals();
    }
  }

  seasonsExpand.watch("expanded", resetOnCollapse);
  chartExpand.watch("expanded", resetOnCollapse);

  let highlight:esri.Handle = null;
  view.on("drag", ["Control"], eventListener);
  view.on("click", ["Control"], eventListener);
  let previousId: number;
  async function eventListener (event:any) {
    event.stopPropagation();

    const hitResponse = await view.hitTest(event);
    const hitResults = hitResponse.results.filter( hit => hit.graphic.layer === countiesLayer );
    if(hitResults.length > 0){
      const graphic = hitResults[0].graphic;
      if(previousId !== graphic.attributes.FID){
        previousId = graphic.attributes.FID;
        if (highlight) {
          highlight.remove();
          highlight = null;
        }

        highlight = countiesLayerView.highlight([previousId]);
        const geometry = graphic && graphic.geometry;
        let queryOptions = {
          geometry,
          spatialRelationship: "intersects"
        };

        const filterOptions = new FeatureFilter(queryOptions);

        layerView.effect = new FeatureEffect({
          filter: filterOptions,
          excludedEffect: "grayscale(90%) opacity(15%)"
        });

        const stats = await queryTimeStatistics(layerView, queryOptions);
        updateGrid(stats);
      }
    }
  }

  interface QueryTimeStatsParams {
    geometry?: esri.Geometry,
    distance?: number,
    units?: string
  }

  async function queryTimeStatistics ( layerView: esri.FeatureLayerView, params: QueryTimeStatsParams): Promise<ChartData[]>{
    const { geometry, distance, units } = params;

    const query = layerView.layer.createQuery();

    query.outStatistics = [
      new StatisticDefinition({
        onStatisticField: "1",
        outStatisticFieldName: "value",
        statisticType: "count"
      })
    ];
    query.groupByFieldsForStatistics = [ "SEASON + '-' + DurationClass" ];
    query.geometry = geometry;
    query.distance = distance;
    query.units = units;
    query.returnQueryGeometry = true;

    const queryResponse = await layerView.queryFeatures(query);

    const responseChartData = queryResponse.features.map( feature => {
      const timeSpan = feature.attributes["EXPR_1"].split("-");
      const season = timeSpan[0];
      const duration = timeSpan[1];
      return {
        duration,
        season,
        value: feature.attributes.value
      };
    });
    return createDataObjects(responseChartData);
  }

  async function queryLayerStatistics(layer: esri.FeatureLayer): Promise<ChartData[]> {
    const query = layer.createQuery();
    query.outStatistics = [
      new StatisticDefinition({
        onStatisticField: "1",
        outStatisticFieldName: "value",
        statisticType: "count"
      })
    ];
    query.groupByFieldsForStatistics = [ "SEASON + '-' + DurationClass" ];

    const queryResponse = await layer.queryFeatures(query);

    const responseChartData = queryResponse.features.map( feature => {
      const timeSpan = feature.attributes["EXPR_1"].split("-");
      const season = timeSpan[0];
      const duration = timeSpan[1];
      return {
        duration,
        season,
        value: feature.attributes.value
      };
    });
    return createDataObjects(responseChartData);
  }

  function createDataObjects(data: StatisticsResponse[]): ChartData[] {
    let formattedChartData: ChartData[] = [];

    durations.forEach( (duration, t) => {
      seasons.forEach( (season, s) => {

        const matches = data.filter( datum => {
          return datum.season === season && datum.duration === duration;
        });

        formattedChartData.push({
          col: t,
          row: s,
          value: matches.length > 0 ? matches[0].value : 0
        });

      });
    });

    return formattedChartData;
  }

  const resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", resetVisuals);

  function resetVisuals () {
    layerView.filter = null;
    layerView.effect = null;
    if(highlight){
      highlight.remove();
      highlight = null;
    }
    seasonsNodes.forEach( (node:HTMLDivElement) => {
      node.classList.add("visible-season");
    });
    updateGrid(layerStats, layerView, true);
  }

})();
