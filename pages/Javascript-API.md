*This is the technical documentation for Tangram's JavaScript API.*

In the process of constructing a map, Tangram mirrors much of the structure of the 3D scene and the yaml file itself in JavaScript objects. Most of the properties and functions on these objects are used internally by the library, but a few are designed to be referenceable and modifiable, to allow easier design and interactivity.

## Objects

### `scene`
A `scene` object can be exposed by passing the scene's url to the `Tangram.leafletLayer()` function. This allows access to the `scene` object as a property on the Leaflet layer:

```javascript
> layer = Tangram.leafletLayer({ scene: url, ... });
> layer.scene
<- Scene {initialized: true, ...}
```

Many of the scene's properties may be accessed and changed on the fly with methods on this object.

#### `config`
This contains a deserialized, run-time JavaScript object version of the [scene file](scene-file.md). This is essentially the same as the scene file, but can be modified on the fly:

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
<- Object {perspective: Object,
           isometric: Object,
           flat: Object,
           central_park: Object}
```

```javascript
> scene.config.cameras.perspective
<- Object {type: "perspective",
           focal_length: Array[5],
           vanishing_point: Array[2],
           active: true}
```

After changes are made to the `config` object, `scene.updateConfig()` will update the scene with the changes.

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

Feature picking is accomplished by assigning a unique color to each feature onscreen and rendering the scene to an offscreen buffer. When queried, `getFeatureAT()` checks the offscreen render at the given location, and identifies the feature by its color.

#### `load(scene_url, base_path)`
Loads the specified scene by url and rebuilds the geometry. If no arguments are specified, the current scene will be reloaded.

`scene_url` is the path to a scene file. Relative paths are assumed to be relative to the host url.

`base_path` is an optional argument specifying a string to be prefixed to paths for resources needed to the scene file, such as images. If it is not present, the paths to these resources are presumed to be relative to the scene file.

#### `rebuild()`
Rebuilds the current scene from scratch.

#### `requestRedraw()`
Requests an update to the drawn map. If `animated: true` is set, this happens once per frame automatically.

#### `screenshot()`
This queues a screenshot request, returning a Promise that fulfills when the screenshot is available.

The promise resolves with an object containing two properties:

- url: a data URL of the Canvas contents, suitable for loading into an <img> or opening in a new tab/window
- blob: a Blob of type image/png, suitable for saving to a file, either manually or with a third-party library such as [FileSaver.js](https://github.com/eligrey/FileSaver.js/)

```javascript
scene.screenshot().then(function(screenshot) { window.open(screenshot.url); });
```

#### `setActiveCamera(_string_ camera)`
Sets the active camera to the camera specified by name, as named in the scene file.

#### `setDataSource(_string_ name, _object_ config)`
Loads a new `source` object (see `[sources](sources.md)`).

If "name" doesn't match an existing source, a new source object will be created. The "config" object must follow the `[sources](sources.md#sources)` specification.

```javascript
scene.setDataSource("osm", {type: 'TopoJSON', url: "//vector.mapzen.com/osm/all/{z}/{x}/{y}.topojson" });
```

```javascript
var geojson_data = {};
...
scene.setDataSource("dynamic_data", {type: 'GeoJSON', data: geojson_data });
```

#### `updateConfig()`
Re-parses the `scene.config` object and redraws the scene, updating data sources and reloading textures. If `updateConfig({ rebuild: true })` is specified, geometry will also be rebuilt.

```javascript
scene.updateConfig()
```

## Events

Tangram provides two selection event handlers: `hover` and `click`, and one render state event emitter: `view_complete`.

#### `hover` and `click`

These two event handlers tie into Leaflet's existing event handlers as convenient shortcuts. They are passed the same selection object returned by direct calls to `scene.getFeatureAt()`.

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

#### `view_complete`
This is an event which fires when the view enters "resting state", meaning new geometry has rendered, and no further tiles are loading/building. For example, when a scene is loaded, a `view_complete` event will fire when all tiles have loaded and the map renders. If the view is then zoomed in a level, another `view_complete` event will fire when the next zoom finishes rendering.

`view_complete` can be subscribed to like other scene events:

```javascript
scene.subscribe({
    view_complete: function () {
        console.log('scene view complete');
    }
});
```
