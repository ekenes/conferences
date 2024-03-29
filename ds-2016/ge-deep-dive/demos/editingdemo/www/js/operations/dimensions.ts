// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>


import esriMap = require("esri/map");
import esriGeometry = require("esri/geometry/Geometry");
import esriPolygon = require("esri/geometry/Polygon");
import esriPoint = require("esri/geometry/Point");
import esriPolyline = require("esri/geometry/Polyline");
import esriGeometryEngine = require("esri/geometry/geometryEngine");
import esriScreenPoint = require("esri/geometry/ScreenPoint");
import geometryJsonUtils = require("esri/geometry/jsonUtils");
import CommonSymbols = require("../CommonSymbols");
import esriGraphic = require("esri/graphic");
import esriTextSymbol = require("esri/symbols/TextSymbol");
import esriColor = require("esri/Color");
import esriFont = require("esri/symbols/Font");


var _uniqueCounter = 0;


function getMidPoint(seg: esriPolyline): esriPoint {

    return new esriPoint((seg.paths[0][0][0] + seg.paths[0][1][0]) / 2, (seg.paths[0][0][1] + seg.paths[0][1][1]) / 2, seg.spatialReference);
}

 function angleBetweenPoints(seg: esriPolyline) {
        var gpath = seg.paths[0];
            var xDiff = gpath[1][0] - gpath[0][0]; 
            var yDiff = gpath[1][1] - gpath[0][1];
            var theangle = Math.atan2(yDiff, xDiff) * (180 / Math.PI);
            if (theangle < 0) {
                theangle = 360 + theangle;
            }
            if (theangle > 360) {
                theangle = theangle - 360;
            }
            return 360- theangle;
          

        }
        
        function getSegmentLength(pt1, pt2) {
            var dx = pt2.x - pt1.x,
                dy = pt2.y - pt1.y;

            return Math.sqrt(dx * dx + dy * dy);
        }

function bearing(seg: esriPolyline): number {
    var bearing = 0;
    var gpath = seg.paths[0];
    var dx = (gpath[1][0] - gpath[0][0]);
    var dy = (gpath[1][1] - gpath[0][1]);
   


    if (dx > 0) {
        bearing = 90 - Math.atan(dy / dx)
    }
    else if (dx < 0) {
        bearing = 270 - Math.atan(dy / dx)
    }
    if (dx == 0) {
        if (dy > 0) { bearing = 0 }
        if (dy < 0) { bearing = 180 }
    }
    return bearing
}

class Dimensions {

    private _map: esriMap = null;
    private _isshowing = false;

    private _dims: any = {};
    constructor(map: esriMap) {
        this._map = map;
    }

    public set show(state: boolean) {
        this._isshowing = state;
       for(var k in this._dims) {
           this.addAndCalculateDimension(this._dims[k]);
        }
    }
    
    public get show() {
        return this._isshowing;
    }


    public addDimension(geom: esriGeometry, reversed: boolean = false): string {

        try {
            if (geom !== null) {
                _uniqueCounter++;
                var newid = "ID" + _uniqueCounter.toString();
                var ngeom: esriGeometry = null;
                if (geom.type === "polyline") {
                    ngeom = geometryJsonUtils.fromJson(geom.toJson());
                }
                else {
                    var path = (<esriPolygon>geom).rings[0].slice(0);
                    if (reversed == true) { path.reverse(); }
                    ngeom = <esriGeometry>new esriPolyline(this._map.spatialReference);
                    (<esriPolyline>ngeom).addPath(path);
                }

                if (ngeom !== null) {
                    var newdimension = {
                        geom: geom,
                        lineGeom: ngeom,
                        graphics: []
                    }
                    this.addAndCalculateDimension(newdimension);
                    this._dims[newid] = newdimension;
                    return newid
                }


            }
            else {

            }
        }
        catch (ex) {

        }
        return "";
    }

    private addAndCalculateDimension(dim) {

        // Remove any old Graphics... Maybe called as a result of a zoom in
        // And Need to work out new Dimensions for the Screen Pixel Size
        for (var z = 0; z < dim.graphics.length; z++) {
            this._map.graphics.remove(dim.graphics[z]);
        }
        dim.graphics = [];
        if (this._isshowing) {
            var pixelsize = Math.abs(this._map.toMap(new esriScreenPoint(0, 0)).x - this._map.toMap(new esriScreenPoint(20, 0)).x) / 20;
            var offsetpix = -1 * pixelsize*20;
            var offset = esriGeometryEngine.offset(<any>dim.lineGeom, offsetpix, null, <any>"miter", 5, 5);
            var g = new esriGraphic(offset, CommonSymbols.dimensionLine);
            var gBack = new esriGraphic(offset, CommonSymbols.dimensionLineBack);

            dim.graphics.push(g);
            dim.graphics.push(gBack);
            this._map.graphics.add(gBack);
            this._map.graphics.add(g);
            g.attr("marker-mid", "url(#midDimensionMarker)")
            g.attr("marker-start", "url(#midDimensionMarker)")
            g.attr("marker-end", "url(#midDimensionMarker)")

            var offsettext = -1 * pixelsize*25;
            for (var z = 0; z < dim.lineGeom.paths[0].length - 1; z++) {
                try {
                    var segment = new esriPolyline(this._map.spatialReference);
                    segment.addPath([dim.lineGeom.paths[0][z], dim.lineGeom.paths[0][z + 1]]);
                    
                    
                    var angle = angleBetweenPoints(segment);
                   var ttext= offsettext;
               if ((angle>=90) && (angle<=270)) {
                    segment = new esriPolyline(this._map.spatialReference);
                     segment.addPath([ dim.lineGeom.paths[0][z + 1], dim.lineGeom.paths[0][z]]);
                      ttext = -1 * (ttext - pixelsize*12);
                      angle = angleBetweenPoints(segment);
               }
          
                    var dist = esriGeometryEngine.planarLength(segment, 9001).toFixed(2);

                    var offsetsegment = esriGeometryEngine.offset(<any>segment,ttext, null, <any>"miter", 5, 5);
                    var textSymbol = new esriTextSymbol(dist);
                    textSymbol.setColor(new esriColor([0, 0, 255,0.6]));
                    textSymbol.setAlign(esriTextSymbol.ALIGN_MIDDLE);
                   
                    console.log(angle);
                    textSymbol.setAngle(angle);
                    
                    
                    
                    var font = new esriFont("12pt");
                    font.setWeight(esriFont.WEIGHT_BOLD);

                    textSymbol.setFont(font);

                    var t = new esriGraphic(getMidPoint(offsetsegment), textSymbol);
                    dim.graphics.push(t);
                    this._map.graphics.add(t);
                    
                    var thelength = t.getNode().getComputedTextLength();
                    var pt1 = this._map.toScreen(segment.getPoint(0,0));
                    var pt2 = this._map.toScreen(segment.getPoint(0,1));
                    
                    if ((getSegmentLength(pt1, pt2) - 20)<thelength) {
                        t.hide();
                    }
                }
                catch (ex) {

                }

            }
        }
    }



    public removeDimension(shapeid: string): string {
        if (shapeid === "") return "";
        var dimension = this._dims[shapeid];
        if (dimension == undefined) return "";

        delete this._dims[shapeid];
        for (var z = 0; z < dimension.graphics.length; z++) {
            this._map.graphics.remove(dimension.graphics[z]);
        }
        
        return "";
    }
}




export = Dimensions