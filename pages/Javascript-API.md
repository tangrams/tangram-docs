*This is the technical documentation for Tangram's JavaScript API.*

In the process of constructing a map, Tangram mirrors much of the structure of the 3D scene and the yaml file itself in JavaScript objects. Most of the properties and functions on these objects are used internally by the library, but a few are designed to be referenceable and modifiable, to allow easier design and interactivity.

#### `scene`
The `scene` object is the interface for controlling your Tangram scene at run-time. It is available as a property of the Tangram Leaflet layer (which is returned by the `Tangram.leafletLayer()` function that is used to initialize the map).

```javascript
> layer = Tangram.leafletLayer({ scene: url, ... });
> layer.scene
<- Scene {initialized: true, ...}
```

The methods and properties below are accessed through this `scene` object.

#### `config`
This contains a deserialized, run-time JavaScript object version of the [scene file](Scene-file.md). This is essentially the same as the scene file, but can be modified on the fly:

```javascript
> scene.config
<- Object {cameras: Object,
           lights: Object,
           background: Object,
           styles: Object,
           sources: Object…}
```

Each object contains sub-objects which correlate to each element's subelements and attributes, including any assigned default values for properties which weren't specified in the scene file.

```javascript
> scene.config.cameras
<- Object {camera1: Object,
           camera2: Object}
```

```javascript
> scene.config.cameras.camera1
<- Object {type: "perspective",
           focal_length: Array[5],
           vanishing_point: Array[2],
           active: true}
```

After changes are made to the `config` object, calling `scene.updateConfig()` will update the scene with the changes.

#### `getActiveCamera()`
Returns the active camera.

#### `getFeatureAt(pixel)`
Simple object-picking may be enabled by setting any layer's `interactive` parameter to `true`. This will enable Tangram's "feature selection" capability for objects in that layer. These objects can then be queried with the `getFeatureAt()` function, which takes pixel coordinates within the map view in the form `{ x, y }`, and returns a promise containing the feature (if any) at those pixel coordinates (if multiple features are drawn at that location, only the top-most one is returned).

The promise resolves with a `selection` object containing `{ feature, changed }` properties. If `feature` is present, `feature.properties` will contain its properties from the original data source, and `feature.layers` will contain a list of layer names which contained the feature; if `feature` is undefined, no feature was found. The `changed` flag indicates if the selected feature changed since the last query.

```javascript
> map.on('click', function() {
>    var pixel = { x: event.clientX, y: event.clientY };
>    layer.scene.getFeatureAt(pixel).then(function(selection) {
>       console.log(selection.feature, selection.changed);
>    });
>});
```

```javascript
> scene.getFeatureAt(pixel).then(function(selection) {
>    if (selection.feature) {
>       console.log(selection.feature.layers);
>    }
> });
<- ["roads:major_road:trunk_primary:early", 
"roads:major_road:trunk_primary:routes:early", 
"roads:major_road:trunk_primary:labels-trunk_primary-z13"]
```

#### `load(scene_url, base_path)`
Loads the specified scene by url and rebuilds the geometry. If no arguments are specified, the current scene will be reloaded.

`scene_url` is the path to a scene file. By default, relative paths within this file (for images and other resources) are relative to its host url.

`base_path` is an optional argument specifying an alternate base URL for resolving relative paths in the scene file. It is primarily useful for development and debugging.

#### `rebuild()`
Rebuilds the current scene from scratch.

#### `requestRedraw()`
Requests an update to the drawn map. If the map contains animated elements, this happens once per frame automatically. If not, it happens whenever the map view changes (pan, zoom, etc.).

#### `screenshot()`
This queues a screenshot request, returning a Promise that fulfills when the screenshot is available.

The promise resolves with an object containing two properties:

- `url`: a data URL of the Canvas contents, suitable for loading into an `<img>` or opening in a new tab/window.
- `blob`: a `Blob` of type `image/png`, suitable for saving to a file, either manually or with a third-party library such as [FileSaver.js](https://github.com/eligrey/FileSaver.js/).

```javascript
scene.screenshot().then(function(screenshot) { window.open(screenshot.url); });
```

#### `setActiveCamera(camera)`
Sets the active camera to the camera specified by name, as named in the scene file.

#### `setDataSource(name, source)`
Loads a new `[data source](sources.md)` or replaces an existing one, and rebuilds the scene.

If `name` doesn't match an existing source, a new source object will be created. The `source` object must follow the `[sources](sources.md#sources)` specification.

```javascript
scene.setDataSource('osm', { type: 'TopoJSON', url: 'https://vector.mapzen.com/osm/all/{z}/{x}/{y}.topojson' });
```

```javascript
var geojson_data = {};
...
scene.setDataSource('dynamic_data', { type: 'GeoJSON', data: geojson_data });
```

#### `updateConfig()`
Re-parses the `scene.config` object and redraws the scene, updating data sources, cameras, lights, rendering styles and shaders, and reloading textures. If `updateConfig({ rebuild: true })` is specified, geometry will also be rebuilt (necessary in cases where `scene.config.layers` have been modified).

```javascript
scene.updateConfig()
```

#### `view_complete`
This is an event which fires when the view enters "resting state", meaning new geometry has rendered, and no further tiles are loading. For example, when a scene is loaded, a `view_complete` event will fire when all tiles have loaded and the initial map view has been drawn. If the view is then zoomed in a level, another `view_complete` event will fire when the next zoom finishes rendering.

`view_complete` can be subscribed to like other scene events:

```javascript
scene.subscribe({
    view_complete: function () {
        console.log('scene view complete');
    }
});
```
