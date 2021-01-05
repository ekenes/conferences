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
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/renderers/smartMapping/creators/color", "esri/renderers/smartMapping/statistics/histogram", "esri/widgets/smartMapping/ColorSlider", "esri/widgets/Legend"], function (require, exports, EsriMap, MapView, FeatureLayer, colorRendererCreator, histogram, ColorSlider, Legend) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var layer, map, view, rendererParams, rendererResponse, rendererHistogram, sliderContainer, panelDiv, colorSlider;
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
                    view.ui.add(new Legend({ view: view }), "bottom-right");
                    return [4 /*yield*/, view.when()];
                case 1:
                    _a.sent();
                    rendererParams = {
                        layer: layer,
                        valueExpression: "Round( ( $feature.EDUC01_CY / $feature.EDUCA_BASE ) * 100 )",
                        valueExpressionTitle: "% population with no formal education",
                        basemap: view.map.basemap,
                        view: view
                    };
                    return [4 /*yield*/, colorRendererCreator.createContinuousRenderer(rendererParams)];
                case 2:
                    rendererResponse = _a.sent();
                    // apply renderer to layer after the promise resolves
                    layer.renderer = rendererResponse.renderer;
                    return [4 /*yield*/, histogram({
                            layer: layer,
                            view: view,
                            valueExpression: "Round( ( $feature.EDUC01_CY / $feature.EDUCA_BASE ) * 100 )",
                            numBins: 30
                        })];
                case 3:
                    rendererHistogram = _a.sent();
                    sliderContainer = document.createElement("div");
                    panelDiv = document.getElementById("panel");
                    panelDiv.appendChild(sliderContainer);
                    view.ui.add(panelDiv, "bottom-left");
                    colorSlider = ColorSlider.fromRendererResult(rendererResponse, rendererHistogram);
                    colorSlider.container = sliderContainer;
                    colorSlider.on("thumb-drag", function () {
                        var renderer = layer.renderer;
                        var rendererClone = renderer.clone();
                        var colorVariable = rendererClone.visualVariables[0];
                        colorVariable.stops = colorSlider.stops;
                        rendererClone.visualVariables = [colorVariable];
                        layer.renderer = rendererClone;
                    });
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=basic-arcade.js.map