var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/renderers/smartMapping/creators/color", "esri/renderers/smartMapping/statistics/histogram", "esri/widgets/smartMapping/ColorSlider"], function (require, exports, EsriMap, MapView, FeatureLayer, colorRendererCreator, histogram, ColorSlider) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        /**
         * Creates the DOM elements needed to render basic UI and contextual information,
         * including the title, description, and attribute field select
         */
        function updatePanel() {
            var panelDiv = document.getElementById("panel");
            panelDiv.style.textAlign = "center";
            // title
            var titleElement = document.createElement("h2");
            titleElement.innerText = title;
            panelDiv.appendChild(titleElement);
            // description
            var descriptionElement = document.createElement("div");
            descriptionElement.style.paddingBottom = "10px";
            descriptionElement.innerText = appDescription;
            panelDiv.appendChild(descriptionElement);
            // attribute field select
            var selectElement = createSelect(variables);
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
        function createSelect(fieldInfos) {
            var selectElement = document.createElement("select");
            selectElement.className = "esri-widget";
            fieldInfos.forEach(function (info, i) {
                var option = document.createElement("option");
                option.value = info.value;
                option.text = info.label;
                option.selected = i === 0;
                selectElement.appendChild(option);
            });
            return selectElement;
        }
        /**
         * Callback that executes each time the user selects a new variable
         * to visualize.
         *
         * @param event
         */
        function selectVariable(event) {
            return __awaiter(this, void 0, void 0, function () {
                var selectedValue, selectedInfo, rendererResponse, sliderContainer, panelDiv;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            selectedValue = event ? event.target.value : variables[0].value;
                            selectedInfo = findVariableByValue(selectedValue);
                            return [4 /*yield*/, generateRenderer({
                                    layer: layer,
                                    view: view,
                                    value: selectedInfo.value,
                                    normalize: true
                                })];
                        case 1:
                            rendererResponse = _a.sent();
                            // update the layer with the generated renderer and popup template
                            layer.renderer = rendererResponse.renderer;
                            layer.popupTemplate = rendererResponse.popupTemplate;
                            // updates the ColorSlider with the stats and histogram
                            // generated from the smart mapping generator
                            if (!colorSlider) {
                                sliderContainer = document.createElement("div");
                                panelDiv = document.getElementById("panel");
                                panelDiv.appendChild(sliderContainer);
                                colorSlider = ColorSlider.fromRendererResult(rendererResponse.rendererResponse, rendererResponse.histogram);
                                colorSlider.container = sliderContainer;
                                colorSlider.on("thumb-drag", function () {
                                    var renderer = layer.renderer;
                                    var rendererClone = renderer.clone();
                                    var colorVariable = rendererClone.visualVariables[0];
                                    colorVariable.stops = colorSlider.stops;
                                    rendererClone.visualVariables = [colorVariable];
                                    layer.renderer = rendererClone;
                                });
                            }
                            else {
                                colorSlider.updateFromRendererResult(rendererResponse.rendererResponse, rendererResponse.histogram);
                            }
                            return [2 /*return*/];
                    }
                });
            });
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
        function findVariableByValue(value) {
            return variables.filter(function (info) { return info.value === value; })[0];
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
        function getValueExpression(value, normalize) {
            // See variables array above
            var fieldInfo = findVariableByValue(value);
            var normalizationField = normalize ? normalizationVariable : null;
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
        function generateArcade(fields, normalizationField) {
            var value = fields.map(function (field) { return "$feature." + field; }).reduce(function (a, c) { return a + " + " + c; });
            var percentValue = normalizationField ?
                "( ( " + value + " ) / $feature." + normalizationField + " ) * 100" : value;
            return "Round( " + percentValue + " )";
        }
        /**
         * Generates a renderer with a continuous color ramp for the given layer and
         * Arcade expression.
         *
         * @param {GenerateRendererParams} params
         *
         * @return {Object}
         */
        function generateRenderer(params) {
            return __awaiter(this, void 0, void 0, function () {
                var valueExpressionInfo, rendererParams, rendererResponse, rendererHistogram, popupTemplate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            valueExpressionInfo = getValueExpression(params.value, params.normalize);
                            console.log(valueExpressionInfo.valueExpression);
                            rendererParams = {
                                layer: params.layer,
                                valueExpression: valueExpressionInfo.valueExpression,
                                valueExpressionTitle: valueExpressionInfo.valueExpressionTitle,
                                view: params.view
                            };
                            return [4 /*yield*/, colorRendererCreator.createContinuousRenderer(rendererParams)];
                        case 1:
                            rendererResponse = _a.sent();
                            return [4 /*yield*/, histogram({
                                    layer: params.layer,
                                    valueExpression: valueExpressionInfo.valueExpression,
                                    numBins: 30,
                                    view: params.view
                                })];
                        case 2:
                            rendererHistogram = _a.sent();
                            popupTemplate = createPopupTemplate({
                                valueExpression: valueExpressionInfo.valueExpression,
                                valueExpressionTitle: valueExpressionInfo.valueExpressionTitle,
                                name: nameField,
                                description: valueExpressionInfo.valueExpressionDescription,
                                totalField: normalizationVariable
                            });
                            return [2 /*return*/, {
                                    rendererResponse: rendererResponse,
                                    renderer: rendererResponse.renderer,
                                    popupTemplate: popupTemplate,
                                    statistics: rendererResponse.statistics,
                                    histogram: rendererHistogram,
                                    visualVariable: rendererResponse.visualVariable
                                }];
                    }
                });
            });
        }
        /**
         * Creates a popup template specific to the generated renderer
         *
         * @param {UpdatePopupTemplateParams} params
         */
        function createPopupTemplate(params) {
            return {
                title: "{" + params.name + "}",
                content: "\n        {expression/expression-from-renderer}% of the {" + params.totalField + "} people ages 14+ in {" + params.name + "} " + params.description + "\n      ",
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
            };
        }
        var layer, map, view, title, appDescription, variables, normalizationVariable, nameField, colorSlider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    layer = new FeatureLayer({
                        portalItem: {
                            id: "b975d17543fb4ab2a106415dca478684"
                        }
                    });
                    map = new EsriMap({
                        basemap: {
                            portalItem: {
                                id: "4f2e99ba65e34bb8af49733d9778fb8e"
                            }
                        },
                        layers: [layer]
                    });
                    view = new MapView({
                        map: map,
                        container: "viewDiv",
                        center: [-99.5789795341516, 19.04471398160347],
                        zoom: 7
                    });
                    title = "2014 Educational Attainment";
                    appDescription = "\n    Educational attainment refers to the\n    highest level of education that an\n    individual has completed. People\n    who completed higher levels of\n    education are not included in counts\n    of lower education levels.\n  ";
                    variables = [
                        {
                            value: "no-school",
                            label: "% with no formal education completed",
                            description: "didn't complete any level of formal education.",
                            fields: ["EDUC01_CY", "EDUC02_CY", "EDUC03_CY"]
                        }, {
                            value: "primary",
                            label: "% that completed primary school",
                            description: "completed primary school, but didn't advance beyond that.",
                            fields: ["EDUC04_CY", "EDUC05_CY", "EDUC07_CY"]
                        }, {
                            value: "secondary",
                            label: "% that completed secondary school",
                            description: "completed secondary school, but didn't advance beyond that.",
                            fields: ["EDUC06_CY", "EDUC08_CY"]
                        }, {
                            value: "high-school",
                            label: "% that completed high school",
                            description: "completed high school, but didn't advance beyond that.",
                            fields: ["EDUC09_CY", "EDUC11_CY"]
                        }, {
                            value: "university",
                            label: "% that completed university degree",
                            description: "completed a university or other advanced degree.",
                            fields: ["EDUC10_CY", "EDUC12_CY", "EDUC13_CY", "EDUC14_CY", "EDUC15_CY"]
                        }
                    ];
                    normalizationVariable = "EDUCA_BASE";
                    nameField = "NAME";
                    return [4 /*yield*/, view.when()];
                case 1:
                    _a.sent();
                    updatePanel();
                    ;
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map