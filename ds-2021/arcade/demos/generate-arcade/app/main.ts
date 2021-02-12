import esri = __esri;

import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");

import colorRendererCreator = require("esri/renderers/smartMapping/creators/color");
import histogram = require("esri/renderers/smartMapping/statistics/histogram");
import ColorSlider = require("esri/widgets/smartMapping/ColorSlider");

import { ClassBreaksRenderer } from "esri/renderers";

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

  const title = "2014 Educational Attainment";

  const appDescription = `
    Educational attainment refers to the
    highest level of education that an
    individual has completed. People
    who completed higher levels of
    education are not included in counts
    of lower education levels.
  `;

  //
  // Configure aggregated fields for generating Arcade expressions
  // Some field values are a subset of a larger variable. For example,
  // all people who earned a bachelor's, master's, and doctorate degree
  // are all considered "university graduates", so all of those fields
  // are added together to simplify the visualization
  //

  interface FieldInfoForArcade {
    value: string,  // e.g. "no-school"
    label: string,  // e.g. "% with no formal education completed"
    description: string,  // e.g. "didn't complete any level of formal education."
    fields: string[]  // e.g. [ "EDUC01_CY", "EDUC02_CY", "EDUC03_CY" ]
  }

  const variables: FieldInfoForArcade[] = [
    {
      value: "no-school",
      label: "% with no formal education completed",
      description: "didn't complete any level of formal education.",
      fields: [ "EDUC01_CY", "EDUC02_CY", "EDUC03_CY" ]
    }, {
      value: "primary",
      label: "% that completed primary school",
      description: "completed primary school, but didn't advance beyond that.",
      fields: [ "EDUC04_CY", "EDUC05_CY", "EDUC07_CY" ]
    }, {
      value: "secondary",
      label: "% that completed secondary school",
      description: "completed secondary school, but didn't advance beyond that.",
      fields: [ "EDUC06_CY", "EDUC08_CY" ]
    }, {
      value: "high-school",
      label: "% that completed high school",
      description: "completed high school, but didn't advance beyond that.",
      fields: [ "EDUC09_CY", "EDUC11_CY" ]
    }, {
      value: "university",
      label: "% that completed university degree",
      description: "completed a university or other advanced degree.",
      fields: [ "EDUC10_CY", "EDUC12_CY", "EDUC13_CY", "EDUC14_CY", "EDUC15_CY" ]
    }
  ];

  // This field will be used to normalize the value of each category
  // to form a percentage

  const normalizationVariable = "EDUCA_BASE";
  const nameField = "NAME";

  await view.when();
  updatePanel();

  /**
   * Creates the DOM elements needed to render basic UI and contextual information,
   * including the title, description, and attribute field select
   */
  function updatePanel (){
    const panelDiv = document.getElementById("panel");
    panelDiv.style.textAlign = "center";
    // title

    const titleElement = document.createElement("h2");
    titleElement.innerText = title;
    panelDiv.appendChild(titleElement);

    // description

    const descriptionElement = document.createElement("div");
    descriptionElement.style.paddingBottom = "10px";
    descriptionElement.innerText = appDescription;
    panelDiv.appendChild(descriptionElement);

    // attribute field select

    const selectElement = createSelect(variables);
    panelDiv.appendChild(selectElement);
    view.ui.add(panelDiv, "bottom-left");
    selectElement.addEventListener("change", selectVariable);

    // generate the renderer for the first selected attribute
    selectVariable();
  }

  /**
   * Creates the HTML select element for the given field info objects.
   *
   * @param {FieldInfoForArcade[]} fieldInfos - An array of FieldInfoForArcade objects,
   *   defining the name ane description of known values. The description is
   *   used in the text of each option.
   *
   * @returns {HTMLSelectElement}
   */
  function createSelect(fieldInfos: FieldInfoForArcade[]): HTMLSelectElement {

    const selectElement = document.createElement("select");
    selectElement.className = "esri-widget";

    fieldInfos.forEach( (info, i) => {
      const option = document.createElement("option");
      option.value = info.value;
      option.text = info.label;
      option.selected = i === 0;

      selectElement.appendChild(option);
    });

    return selectElement;
  }

  let colorSlider: ColorSlider;

  /**
   * Callback that executes each time the user selects a new variable
   * to visualize.
   *
   * @param event
   */
  async function selectVariable(event?: any){
    const selectedValue = event ? event.target.value : variables[0].value;
    const selectedInfo = findVariableByValue(selectedValue);

    // generates the renderer with the given variable value

    const rendererResponse = await generateRenderer({
      layer: layer,
      view: view,
      value: selectedInfo.value,
      normalize: true
    });

    // update the layer with the generated renderer and popup template
    layer.renderer = rendererResponse.renderer;
    layer.popupTemplate = rendererResponse.popupTemplate;

    // updates the ColorSlider with the stats and histogram
    // generated from the smart mapping generator

    if(!colorSlider){
      const sliderContainer = document.createElement("div");
      const panelDiv = document.getElementById("panel");
      panelDiv.appendChild(sliderContainer);

      colorSlider = ColorSlider.fromRendererResult(rendererResponse.rendererResponse, rendererResponse.histogram);
      colorSlider.container = sliderContainer;

      colorSlider.on("thumb-drag", () => {
        const renderer = layer.renderer as ClassBreaksRenderer;
        const rendererClone = renderer.clone();
        const colorVariable = rendererClone.visualVariables[0] as esri.ColorVariable;
        colorVariable.stops = colorSlider.stops;
        rendererClone.visualVariables = [ colorVariable ];
        layer.renderer = rendererClone;
      });
    } else {
      colorSlider.updateFromRendererResult(rendererResponse.rendererResponse, rendererResponse.histogram);
    }
  }

  /**
   * Returns the object with the associated description and fields for the
   * given value.
   *
   * @param {string} value - The value of the selected variable. For example,
   *   this value could be "no-school".
   *
   * @returns {FieldInfoForArcade}
   */
  function findVariableByValue (value: string): FieldInfoForArcade {
    return variables.filter( (info) => { return info.value === value } )[0];
  }

  interface GetValueExpressionResult {
    valueExpression: string,
    valueExpressionTitle?: string,
    valueExpressionDescription?: string
  }

  /**
   * Generates an Arcade Expression and a title for the expression to use in the
   * Legend widget.
   *
   * @param {string} value - The value selected by the user. For example, "no-school".
   * @param {boolean} [normalize]  - indicates whether to normalize by the normalizationField.
   *
   * @returns {GetValueExpressionResult}
   */
  function getValueExpression(value: string, normalize?: boolean): GetValueExpressionResult {

    // See variables array above

    const fieldInfo = findVariableByValue(value);
    const normalizationField = normalize ? normalizationVariable : null;

    return {
      valueExpression: generateArcade(fieldInfo.fields, normalizationField),
      valueExpressionTitle: fieldInfo.label,
      valueExpressionDescription: fieldInfo.description
    };
  }

  /**
   * Generates an Arcade expression with the given fields and normalization field.
   *
   * @param {string[]} fields - The fields making up the numerator of the percentage.
   * @param {string} normalizationField - The field making up the denominator of the percentage.
   *
   * @returns {string}
   */

  function generateArcade(fields: string[], normalizationField?: string): string {
    const value = fields.map( field => `$feature.${field}` ).reduce( (a,c) => `${a} + ${c}`);
    const percentValue = normalizationField ?
      `( ( ${value} ) / $feature.${normalizationField} ) * 100` : value;
    return `Round( ${percentValue} )`;
  }

  interface GenerateRendererParams {
    layer: esri.FeatureLayer,
    view: esri.MapView,
    value: string,
    normalize?: boolean
  }

  /**
   * Generates a renderer with a continuous color ramp for the given layer and
   * Arcade expression.
   *
   * @param {GenerateRendererParams} params
   *
   * @return {Object}
   */
  async function generateRenderer(params: GenerateRendererParams) {

    const valueExpressionInfo = getValueExpression(params.value, params.normalize);
    console.log(valueExpressionInfo.valueExpression);

    const rendererParams = {
      layer: params.layer,
      valueExpression: valueExpressionInfo.valueExpression,
      valueExpressionTitle: valueExpressionInfo.valueExpressionTitle,
      view: params.view
    };

    const rendererResponse = await colorRendererCreator.createContinuousRenderer(rendererParams);

    const rendererHistogram = await histogram({
      layer: params.layer,
      valueExpression: valueExpressionInfo.valueExpression,
      numBins: 30,
      view: params.view
    });

    const popupTemplate = createPopupTemplate({
      valueExpression: valueExpressionInfo.valueExpression,
      valueExpressionTitle: valueExpressionInfo.valueExpressionTitle,
      name: nameField,
      description: valueExpressionInfo.valueExpressionDescription,
      totalField: normalizationVariable
    })

    return {
      rendererResponse,
      renderer: rendererResponse.renderer,
      popupTemplate: popupTemplate,
      statistics: rendererResponse.statistics,
      histogram: rendererHistogram,
      visualVariable: rendererResponse.visualVariable
    };
  }

  interface UpdatePopupTemplateParams {
    valueExpression: string,
    valueExpressionTitle: string,
    description: string,
    name: string,
    totalField: string
  }

  /**
   * Creates a popup template specific to the generated renderer
   *
   * @param {UpdatePopupTemplateParams} params
   */
  function createPopupTemplate (params: UpdatePopupTemplateParams): esri.PopupTemplate {
    return {
      title: `{${params.name}}`,
      content: `
        {expression/expression-from-renderer}% of the {${params.totalField}} people ages 14+ in {${params.name}} ${params.description}
      `,
      expressionInfos: [{
        name: "expression-from-renderer",
        title: params.valueExpressionTitle,
        expression: params.valueExpression
      }],
      fieldInfos: [{
        fieldName: "expression/expression-from-renderer",
        format: {
          digitSeparator: true,
          places: 0
        }
      }, {
        fieldName: params.totalField,
        format: {
          digitSeparator: true,
          places: 0
        }
      }]
    } as esri.PopupTemplate;
  };

})();