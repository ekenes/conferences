define(["require", "exports", "esri/views/layers/support/FeatureFilter", "esri/Color", "./constants"], function (require, exports, FeatureFilter, Color, constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mousemoveEnabled = true;
    var highlighted = null;
    var layerView = null;
    var data = [];
    var start = new Color("#efe6e6");
    var end = new Color("#672929");
    var numCols = 4;
    var numRows = 4;
    function normalize(value, minValue, maxValue) {
        return (value - minValue) / (maxValue - minValue);
    }
    function updateGrid(newData, lv) {
        data = newData ? newData : data;
        layerView = lv ? lv : layerView;
        var pixelRatio = window.devicePixelRatio;
        var canvas = document.getElementById("chartCanvas");
        var ctx = canvas.getContext("2d");
        var width = canvas.clientWidth * pixelRatio;
        var height = canvas.clientHeight * pixelRatio;
        canvas.width = width;
        canvas.height = height;
        var cellWidth = width / numCols;
        var cellHeight = height / numRows;
        var minValue = +Infinity;
        var maxValue = -Infinity;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var value = data_1[_i].value;
            minValue = Math.min(value, minValue);
            maxValue = Math.max(value, maxValue);
        }
        ctx.clearRect(0, 0, width, height);
        for (var _a = 0, data_2 = data; _a < data_2.length; _a++) {
            var _b = data_2[_a], col = _b.col, row = _b.row, value = _b.value;
            var ratio = normalize(value, minValue, maxValue);
            ctx.fillStyle = new Color({
                r: Math.round(start.r + (end.r - start.r) * ratio),
                g: Math.round(start.g + (end.g - start.g) * ratio),
                b: Math.round(start.b + (end.b - start.b) * ratio),
                a: Math.round(start.a + (end.a - start.a) * ratio)
            }).toCss();
            ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
            // Draw text
            ctx.fillStyle = "black";
            ctx.textBaseline = "middle";
            ctx.font = 12 * pixelRatio + "px \"Avenir Next W00\",\"Helvetica Neue\",Helvetica,Arial,sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("" + value, col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2);
        }
        // draw highlighted cell
        if (highlighted) {
            var w = 3 * pixelRatio;
            ctx.strokeStyle = "black";
            ctx.lineWidth = w;
            ctx.strokeRect(highlighted.col * cellWidth + w / 2, highlighted.row * cellHeight + w / 2, cellWidth - w, cellHeight - w);
        }
        else {
            ctx.strokeStyle = null;
            ctx.lineWidth = 0;
        }
    }
    exports.updateGrid = updateGrid;
    function addCanvasListeners() {
        var canvas = document.getElementById("chartCanvas");
        function selectCell(event) {
            var pixelRatio = window.devicePixelRatio;
            var width = canvas.width, height = canvas.height;
            var rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            onCellSelect({
                col: Math.floor(x / (width / pixelRatio) * numCols),
                row: Math.floor(y / (height / pixelRatio) * numRows)
            });
        }
        canvas.addEventListener("mousemove", selectCell);
        canvas.addEventListener("click", function (event) {
            mousemoveEnabled = !mousemoveEnabled;
            selectCell(event);
        });
        canvas.addEventListener("mouseleave", function () {
            if (mousemoveEnabled) {
                layerView.filter = new FeatureFilter({
                    where: "1=1"
                });
                highlighted = null;
                updateGrid();
            }
        });
    }
    function onCellSelect(cell) {
        var season = constants_1.seasons[cell.row];
        var timeOfDay = constants_1.timesOfDay[cell.col];
        if (mousemoveEnabled) {
            highlighted = { col: cell.col, row: cell.row };
            layerView.filter = new FeatureFilter({
                where: "Season = '" + season + "' AND timeOfDay = '" + timeOfDay + "'"
            });
        }
        updateGrid();
    }
    addCanvasListeners();
});
//# sourceMappingURL=heatmapChart.js.map