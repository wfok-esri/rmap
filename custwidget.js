require([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/Widget",
      "esri/core/Accessor",
      "esri/geometry/Polyline",
      "esri/Graphic",
      "dojo/dom-construct",
      "dojo/on"
  ], function (Map, MapView, FeatureLayer, Widget, Accessor, Polyline, Graphic, domConstruct, on) {
      const DrawAlongLineWidget = Widget.createSubclass({
          // Widget properties
          properties: {
              view: {}
          },
          // Render the widget UI
          render: function () {
              return domConstruct.create("div", {
                  innerHTML: "Draw Along Line Widget",
                  className: "draw-along-line-widget"
              });
          },
          // Post-create logic
          postCreate: function () {
              this._setupDrawing();
          },
          // Set up drawing logic
          _setupDrawing: function () {
              const view = this.view;
              let isDrawing = false;
              let startPoint = null;
              let endPoint = null;
              // Listen for mouse down event
              view.on("pointer-down", (event) => {
                  isDrawing = true;
                  startPoint = view.toMap({ x: event.x, y: event.y });
              });
              // Listen for mouse move event
              view.on("pointer-move", (event) => {
                  if (isDrawing) {
                      endPoint = view.toMap({ x: event.x, y: event.y });
                      // Create a polyline between start and end points
                      const polyline = new Polyline({
                          paths: [[[startPoint.x, startPoint.y], [endPoint.x, endPoint.y]]],
                          spatialReference: view.spatialReference
                      });
                      // Clear previous graphics
                      view.graphics.removeAll();
                      // Add the new line graphic
                      const lineGraphic = new Graphic({
                          geometry: polyline,
                          symbol: {
                              type: "simple-line",
                              color: "blue",
                              width: 2
                          }
                      });
                      view.graphics.add(lineGraphic);
                  }
              });
              // Listen for mouse up event
              view.on("pointer-up", () => {
                  isDrawing = false;
              });
          }
      });
      // Initialize the map and view
      const map = new Map({
          basemap: "topo-vector"
      });
      const view = new MapView({
          container: "viewDiv",
          map: map,
          center: [-118.805, 34.027], // Replace with your center coordinates
          zoom: 13
      });
      // Add the trails layer to the map
      const trailsLayer = new FeatureLayer({
          url: "https://your-feature-service-url/FeatureServer/0", // Replace with your feature service URL
          outFields: ["*"]
      });
      map.add(trailsLayer);
      // Add the custom widget to the view
      view.when(() => {
          const drawAlongLineWidget = new DrawAlongLineWidget({
              view: view
          });
          view.ui.add(drawAlongLineWidget, "top-right");
      });
  });
