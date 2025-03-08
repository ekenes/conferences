async function load() {
    //Imports
    const Map = await $arcgis.import("esri/Map");
    const StreamLayer = await $arcgis.import("esri/layers/StreamLayer");
    const FeatureLayer = await $arcgis.import("esri/layers/FeatureLayer");
    const Basemap = await $arcgis.import("esri/Basemap");

    //Elements
    const timeSlider = document.querySelector("arcgis-time-slider");
    const mapElem = document.querySelector("arcgis-map");
    const sceneElem = document.querySelector("arcgis-scene");
    const toggleMapElem = document.getElementById("2d-3d-toggle-map");
    const toggleSceneElem = document.getElementById("2d-3d-toggle-scene");
    const liveSwitchElem2D = document.getElementById("2d-live-switch");
    const liveSwitchElem3D = document.getElementById("3d-live-switch");

    // Set up the map
    const featureLayer = new FeatureLayer({
        portalItem: {
            id: "6b84497d99b74d9e937cd0074f7c7365"
        },
        refreshInterval: 0.1
    });

    const basemap = new Basemap({
        portalItem: {
            id: "a9c628e802f84ad282f5c72f6354265b"
        }
    });

    const streamLayer = new StreamLayer({
        portalItem: {
            id: "795f80425a7249908fe338fb550ddc1c"
        },
        visible: false,
        purgeOptions: {
            maxObservations: 5
        }
    });

    const map = new Map({
        basemap: basemap,
        layers: [featureLayer, streamLayer]
    });

    // Assign the map to arcgis-map and arcgis-scene
    mapElem.map = map;
    sceneElem.map = map;

    mapElem.addEventListener("arcgisViewReadyChange", async ({ target }) => {
        await target.whenLayerView(featureLayer);
        timeSlider.fullTimeExtent = featureLayer.timeInfo.fullTimeExtent.expandTo("hours");
        timeSlider.stops = {
            interval: featureLayer.timeInfo.interval
        };
    });

    sceneElem.addEventListener("arcgisViewReadyChange", async ({ target }) => {
        await target.whenLayerView(featureLayer);
        timeSlider.fullTimeExtent = featureLayer.timeInfo.fullTimeExtent.expandTo("hours");
        timeSlider.stops = {
            interval: featureLayer.timeInfo.interval
        };
    });

    // Toggle between 3D and 2D
    toggleMapElem.addEventListener("click", function () {
        mapElem.style.display = "none";
        sceneElem.style.display = "block";
        liveSwitchElem3D.checked = liveSwitchElem2D.checked;
        timeSlider.referenceElement = sceneElem;
    });

    toggleSceneElem.addEventListener("click", function () {
        mapElem.style.display = "block";
        sceneElem.style.display = "none";
        liveSwitchElem2D.checked = liveSwitchElem3D.checked;
        timeSlider.referenceElement = mapElem;
    });

    //Switch between historic and live modes
    const toggleLive = () => {
        featureLayer.visible = !featureLayer.visible;
        !featureLayer.visible ? timeSlider.style.display = "none" : timeSlider.style.display = "inline";
        timeSlider.disabled = !featureLayer.visible;
        if (timeSlider.disabled) {
            mapElem.view.timeExtent = null;
            sceneElem.view.timeExtent = null;
            document.getElementById("statusBlock").setAttribute("status", "valid");
            document.getElementById("statusBlock").setAttribute("description", "LIVE");
        } else {
            document.getElementById("statusBlock").setAttribute("status", "idle");
            document.getElementById("statusBlock").setAttribute("description", "Past observations");
            timeSlider.timeExtent = timeSlider.fullTimeExtent;
        }
        streamLayer.visible = !streamLayer.visible;
    };
    liveSwitchElem2D.addEventListener("calciteSwitchChange", toggleLive);
    liveSwitchElem3D.addEventListener("calciteSwitchChange", toggleLive);

}
load();