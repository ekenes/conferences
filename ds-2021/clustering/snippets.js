async function generateClusterConfig(layer){
  const popupTemplate = await clusterPopupCreator
    .getTemplates({ layer })
    .then(response => response.primaryTemplate.value);

  const { labelingInfo, clusterMinSize } = await clusterLabelCreator
    .getLabelSchemes({ layer, view })
    .then(labelSchemes => labelSchemes.primaryScheme);

  layer.featureReduction = {
    type: "cluster",
    popupTemplate,
    labelingInfo,
    clusterMinSize
  };
}

layer.featureReduction = {
  type: "cluster",
  minClusterSize: 4,
  maxClusterSize: 40,
  clusterRadius: 60,
  popupTemplate: {
    // popupTemplate with aggregate fields
  },
  // Array of label classes
  labelingInfo: []
}

// displays all features from a given cluster in the view
async function displayFeatures(graphic) {

  const query = layerView.createQuery();
  query.aggregateIds = [graphic.getObjectId()];

  const { features } = await layerView.queryFeatures(query);

  features.forEach(async (feature) => {
    const symbol = await symbolUtils.getDisplayedSymbol(feature);
    feature.symbol = symbol;
    view.graphics.add(feature);
  });
}


const query = layerView.createQuery();
query.aggregateIds = [ graphic.getObjectId() ];
query.groupByFieldsForStatistics = ["fuel1"];
query.outFields = ["capacity_mw", "fuel1"];
query.orderByFields = ["num_features desc"];
query.outStatistics = [
  {
    onStatisticField: "capacity_mw",
    outStatisticFieldName: "capacity_total",
    statisticType: "sum"
  }
];

const { features } = await layerView.queryFeatures(query);
const stats = features.map((feature) => feature.attributes);