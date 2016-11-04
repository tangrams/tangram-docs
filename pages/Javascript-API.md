*This is the technical documentation for Tangram's JavaScript API.*

In the process of constructing a map, Tangram mirrors much of the structure of the 3D scene and the yaml file itself in JavaScript objects. Most of the properties and functions on these objects are used internally by the library, but a few are designed to be referenceable and modifiable, to allow easier design and interactivity. The top-level `scene` object, and the methods for querying and modifying it comprise Tangram's JavaScript API.

#### `scene`
The `scene` object is the interface for controlling your Tangram scene at runtime. It is available as a property of the Tangram Leaflet layer (which is returned by the `Tangram.leafletLayer()` function that is used to initialize the map).

```javascript
> layer = Tangram.leafletLayer({ scene: url, ... });
> layer.scene
<- Scene {initialized: true, ...}
```

The methods and properties below are accessed through this `scene` object.

#### `config`
This contains a deserialized, runtime JavaScript object version of the [scene file](Scene-file.md) which can be modified on the fly:

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

The promise resolves with a `selection` object:

```javascript
{ feature, changed, pixel, leaflet_event }
```

- `feature`: when present, `feature.properties` will contain the feature's properties from the original data source; if `feature` is undefined, no feature was found.
- `changed`: a flag indicating whether the selected feature changed since the last query
- `pixel`: the XY location within the map container where the event occurred, in the form `{ x, y }`
- `leaflet_event`: the Leaflet event that triggered the selection

#### `load(scene_url, base_path)`
Loads the specified scene by url and rebuilds the geometry. If no arguments are specified, the current scene will be reloaded.

`scene_url` is the path to a scene file. By default, relative paths within this file (for images and other resources) are relative to its host url.

`base_path` is an optional argument specifying an alternate base URL for resolving relative paths in the scene file. It is primarily useful for development and debugging.

#### `loadTextures()`
Reloads and rebinds [textures](textures.md) in the scene.

Textures will only be reloaded if any of the texture definition's parameters changed, or if the texture is tied to a DOM element.

#### `rebuild()`
Rebuilds the current scene from scratch.

#### `requestRedraw()`
Requests an update to the drawn map. If the map contains animated elements, this happens once per frame automatically. If not, it happens whenever the map view changes (pan, zoom, etc.).

#### `screenshot()`
This queues a screenshot request, returning a Promise that fulfills when the screenshot is available.

The promise resolves with an object containing three properties:

- `url`: a data URL of the Canvas contents, suitable for loading into an `<img>` or opening in a new tab/window.
- `blob`: a `Blob` of type `image/png`, suitable for saving to a file, either manually or with a third-party library such as [FileSaver.js](https://github.com/eligrey/FileSaver.js/).
- `type`: the string `png`.

```javascript
scene.screenshot().then(function(screenshot) { window.open(screenshot.url); });
```

#### `setActiveCamera(camera)`
Sets the active camera to the camera specified by name, as named in the scene file.

#### `setDataSource(_string_ name, _object_ config)`
Loads a new `source` object (see [`sources`](sources.md)), returning a Promise which fulfills when the `source` is loaded.

If `name` doesn't match an existing source, a new source object will be created. The `source` object must follow the [`sources`](sources.md#sources) specification.

```javascript
scene.setDataSource('osm', { type: 'TopoJSON', url: 'https://vector.mapzen.com/osm/all/{z}/{x}/{y}.topojson' });
```

```javascript
var geojson_data = {};
...
scene.setDataSource('dynamic_data', { type: 'GeoJSON', data: geojson_data });
```

#### `setIntrospection(_boolean_)`
Enables feature selection for all features, regardless of their [`interactive`](draw.md#interactive) setting in the [scene file](Scene-file.md).

`scene.setIntrospection(true);`

Enabling or disabling introspection at run-time will cause the scene to rebuild automatically to reflect the new setting.

For more about using feature selection, see [`getFeatureAt()`](Javascript-API.md#getfeatureatpixel).

[[JS-only](https://github.com/tangrams/tangram)] An `introspection` parameter is also available on the Leaflet layer:

```html
layer = Tangram.leafletLayer({
   scene: '...',
   introspection: true,
   ...
};
```

#### `startVideoCapture(), stopVideoCapture()`
`startVideoCapture()` uses [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) functionality in Chrome and Firefox to capture a [WebM](https://en.wikipedia.org/wiki/WebM)-encoded movie of a Tangram map. `startVideoCapture()` will return `false` on other browsers.

`stopVideoCapture()` returns a promise that will resolve with `url` and `blob` properties, as well as a `type` property with the value `webm`.

```javascript
scene.startVideoCapture();
```

```javascript
scene.stopVideoCapture().then(function(video) {
    saveAs(video.blob, 'tangram-video-' + (+new Date()) + '.webm');
});
```

#### `updateConfig()`
Re-parses the `scene.config` object and redraws the scene, updating data sources, cameras, lights, rendering styles and shaders, and reloading textures. If `updateConfig({ rebuild: true })` is specified, geometry will also be rebuilt (necessary in cases where `scene.config.layers` have been modified).

```javascript
scene.updateConfig()
```

## Events

Tangram provides a number of event handlers and emitters.

####`error` and `warning`
The `error` event is fired when an unrecoverable error occurred while processing the scene. The callback is passed an object with `type`, `message` (text error message), `error` (JS error object), and `url` (the URL from which the scene was loaded) properties.

The `warning` event is fired when a recoverable issue occurred while processing the scene. The callback is passed an object with a `type`, which indicates the scope of the issue (e.g. textures, sources, etc.), along with additional type-specific properties.

```javascript
scene.subscribe({
    error: function (e) {
        console.log('scene error:', e);
    },
    warning: function (e) {
        console.log('scene warning:' e);
    }
});
```

#### `hover` and `click`
These two selection event handlers tie into Leaflet's existing event handlers as convenient shortcuts, and are the preferred way to access the feature picking functionality. They are passed the same selection object returned by direct calls to `scene.getFeatureAt()`.

They can be configured in two ways:

- When creating the Leaflet layer:

An `events` object can be passed with other leaflet layer options. `hover` and/or `click` properties can be set to a callback function:

```
var layer = Tangram.leafletLayer({
   scene: 'scene.yaml',
   events: {
      hover: function(selection) { console.log('Hover!', selection); },
      click: function(selection) { console.log('Click!', selection); }
   }
};
```

- Updated after Leaflet layer creation:

Selection events can be added, changed, or removed after layer creation with a call to `layer.setSelectionEvents(events)`. It takes the same `events` object as above:

```
layer.setSelectionEvents({
   hover: onTangramHover,
   click: onTangramClick
});
```

Or, to remove an event, `layer.setSelectionEvents({ click: null });`.

To activate the feature picking functionality for a particular layer, set the [`interactive`](draw.md#interactive) parameter.

#### `load`
This event handler can be used to catch 'load' events, which are fired when the scene was loaded. The event callback is passed an object with a `config` property, containing the just-loaded scene config object.

```javascript
scene.subscribe({
    load: function (e) {
        console.log('scene loaded:', e);
    }
});
```

#### `view_complete`
This is a render state event emitter which fires when the view enters "resting state", meaning new geometry has rendered, and no further tiles are loading. For example, when a scene is loaded, a `view_complete` event will fire when all tiles have loaded and the initial map view has been drawn. If the view is then zoomed in a level, another `view_complete` event will fire when the next zoom finishes rendering.

`view_complete` can be subscribed to like other scene events:

```javascript
scene.subscribe({
    view_complete: function () {
        console.log('scene view complete');
    }
});
```
