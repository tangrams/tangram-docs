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
This contains a deserialized, runtime JavaScript object version of the [scene file](../Overviews/Scene-File.md) which can be modified on the fly:

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

After changes are made to the `config` object, calling [`scene.updateConfig()`](#updateConfig) will update the scene with the changes, and automatically trigger a [`scene.rebuild()`](#rebuild).

#### `getActiveCamera()`
Returns the active camera.

#### `getFeatureAt(pixel, { radius })`
Simple object-picking may be enabled by setting any layer's `interactive` parameter to `true`. This will enable Tangram's "feature selection" capability for objects in that layer. These objects can then be queried with the `getFeatureAt()` function, which takes pixel coordinates within the map view in the form `{ x, y }`.

An optional `radius` value may be passed, interpreted as pixels. Default radius is zero.

The method returns a promise containing the feature (if any) at those pixel coordinates (if multiple features are drawn at that location, only the top-most one is returned). The promise resolves with a `selection` object:

```javascript
{ feature, changed, pixel, leaflet_event }
```

- `feature`: when present, `feature.properties` will contain the feature's properties from the original data source; if `feature` is undefined, no feature was found.
- `changed`: a flag indicating whether the selected feature changed since the last query
- `pixel`: the XY location within the map container where the event occurred, in the form `{ x, y }`
- `leaflet_event`: the Leaflet event that triggered the selection

In addition to the `scene.getFeatureAt()` method, the `radius` parameter may be set when creating or configuring the Leaflet layer:

- Leaflet layer instantiation:
```yaml
layer = Tangram.leafletLayer({
   scene: 'path/to/scene.yaml',
   events: {
      click: clickHandler,
   },
   selectionRadius: 10 // radius of 10px
};
```

- Leaflet layer interface for setting selection handlers:
```yaml
layer.setSelectionEvents (events, { radius: 5 }) // radius of 5px
```

When using a radius, the feature closest to the center point will be returned. As with existing feature selection, only features marked as interactive: true will register.

#### `load({scene_url|config object}, { base_path, file_type })`
Loads the specified scene, either by URL or by object, and rebuilds the geometry. If no arguments are specified, the current scene will be reloaded.

`scene_url` is the path to a scene file. By default, relative paths within this file (for images, fonts, or other resources) are relative to this URL. For example, for a scene loaded from `https://example.com/path/to/scene.yaml`, an image `texture.png` referenced in that scene file would resolve to `https://example.com/path/to/texture.png`.

A _config object_ is the JSON equivalent of the contents of a YAML scene file. For instance, this yaml:

```yaml
import: ['import1.yaml']
scene:
  background:
    color: grey
```

… is converted after loading to this JSON object:

```javascript
{ import: {'import1.yaml'},
  scene: {
    background: {
      color: 'grey'
    }
  }
}
```

An object in this form, or a pointer to such an object, may be passed to `load()` instead of a URL. In this way custom scene files may be generated and loaded at runtime.

Other options may be passed to `load()` inside an object:

`base_path` is an optional argument specifying an alternate base URL for resolving relative paths in the scene file. It is primarily useful for development and debugging.

```javascript
scene.load(scene_url, { base_path: 'https://site.com/scene/resources/' });
```

`file_type` is an optional argument to support cases where zipped files may be loaded locally, such as from a blob URL.

Using `Scene.load()`:

```javascript
scene.load(zip_blob_url, { file_type: 'zip' });
```

Using a JSON object:
```javascript
var styleobject = {
  'import': [
    'import1.yaml',
    'import2.yaml'
  ],
  'scene': {
    'background': {
      'color': 'grey'
    }
  }
}

scene.load(styleobject);
```

Using `Tangram.leafletLayer`:

```javascript
layer = Tangram.leafletLayer({
   scene: zip_blob_url,
   sceneFileType: 'zip',
   ...
});
```

#### `loadTextures()`
Reloads and rebinds [textures](../Syntax-Reference/textures.md) in the scene.

Textures will only be reloaded if any of the texture definition's parameters changed, or if the texture is tied to a DOM element.

#### `queryFeatures()`
Queries the tiles which intersect the viewport and returns the features contained in those tiles. (For querying a single feature at a given pixel location, see [`scene.getFeatureAt()`](#getfeatureatpixel--radius-).)

The query method has the following signature and default parameters: `queryFeatures({ filter = null, visible = null, unique = true, group_by = null, geometry = false })`

`queryFeatures()` will query the features from tiles that currently intersect the map viewport.

The method returns a promise with an array of matching features, e.g. `queryFeatures().then(features => console.log(features));` will print the matching features to the console. (An array is the default return type, see `group_by` below for an alternate format.)

Each returned result will have a properties field for that feature. See the `geometry` option below to include feature geometry with the results.

Optional parameters described below will further limit the set of features returned.

Because tiles usually include some area outside the viewport, the `queryFeatures()` method can be thought of as roughly querying the visible area, but results may include some nearby features as well. This effect can also be caused by tile over-zooming, for data sources with a `max_zoom`.

##### `filter`
An optional [filter](../Overviews/Filters-Overview.md) object can be provided, using the same syntax used for selecting features for styling in layers. If no filter is provided, all features will be returned (subject to other parameters defined below).

This example will return all restaurants in the pois layer in the visible tiles:

```yaml
scene.queryFeatures({ filter: { $layer: 'pois', kind: 'restaurant' } });
```

Filters used with this method support an additional parameter, `$source`, which can be used to specify a data source name to filter features by. For example, `filter: { $source: 'mapzen' }` will only return features from the "mapzen" data source. (This parameter is not relevant for filters in layers because the data source is already explicitly selected by the data block.)

##### `visible`
By default, all features in the tile source data will be returned, regardless of whether they were rendered in the scene or not.

If `visible: true`, the query will be restricted only to features that were rendered in the scene. Note that this means the feature matched a visible draw group within layers, and was not culled by collision detection (in the case of points or labels). It does not guarantee, however, that the feature is visible from any given view position; it may be drawn but underneath another feature with a higher order value, or it may be behind another 3d object such as a building.

Example: `scene.queryFeatures({ filter: { $layer: 'landuse', $geometry: 'polygon' }, visible: true })` will return all visible landuse polygons.

If `visible: false`, the query will be restricted only to features that were NOT rendered in the scene. This is useful for providing feedback on data that is related to the scene but which you don't want to actually visualize, or for understanding which features were not drawn due to collision (lack of available space on screen).

Example: `scene.queryFeatures({ filter: { $layer: 'pois' }, visible: false })` will return all POIs that were not drawn.

##### `unique`

The `unique` parameter indicates whether (and how) duplicate features should be included in the results. Valid values are `true` (default), `false`/`null`, a string providing a single feature property (id), or an array of feature properties (`['kind', 'operator']`)

The default value, `true`, will limit features to those that are entirely unique, meaning it will exclude features with identical properties (and if the `geometry: true` option described below is also set, features with identical geometry will be excluded as well). This is useful for avoiding duplicate features that may be included in multiple tiles, such as building polygons in Mapzen's vector tiles.

A `false` or `null` value will return all features, without any regard to their properties or geometry.

A single string, or array of strings, will only return features that are unique with regard to the named feature properties (and geometry if `geometry: true`). For example, `unique: id` will avoid features with duplicate ids in the results, and `unique: ['kind', 'operator']` will only return a single feature for each unique combination of `kind` and `operator` property values.

##### `group_by`
The `group_by` parameter can be used to group results by one or more unique property values. Valid values are `false`/`null` (the default), a string providing a single feature property (kind), or an array of feature properties (`['kind', 'kind_detail']`).

When grouping properties are specified, the `queryFeatures()` results will be an object (still returned via a promise), where each key is a unique value according to the grouping criteria, and the value of each key is an array of results for that key.

When a single property is provided for grouping, the results key will be the value of that property.

Example: `queryFeatures({ filter: { $layer: 'pois' }, group_by: 'kind' })` will return results like:

`{ station: Array(8), jewelry: Array(19), bus_stop: Array(5)... }`

When multiple properties are provided the grouping, the results key will be a stringified object for each unique combination of values.

Example: `queryFeatures({ filter: { $layer: 'pois' }, group_by: ['kind', 'kind_detail'] })` will return results like:
```javascript
{
  '{"kind":"restaurant","kind_detail":"chinese"}': Array(8),
  '{"kind":"restaurant","kind_detail":"french"}': Array(4),
  '{"kind":"restaurant","kind_detail":"indian"}': Array(3),
  ...
}
```
The caller can optionally use `JSON.parse()` to parse these stringified grouping keys for additional processing.

##### `geometry`
By default, `queryFeatures()` does not return feature geometry, nor consider geometry when determining if a feature is unique (see unique parameter above). Only type and properties will be returned in the query results.

When `geometry: true`, an additional geometry property will also be returned, containing the feature's geometry (as a GeoJSON geometry object).

Including feature geometry in the result can be useful for further visualizations outside of Tangram, such as with Leaflet markets or SVG paths, or even direct exports of raw GeoJSON.

##### Use Cases

Here are a few examples of ways the `queryFeatures()` parameters can be used.

**Get a list of unique subway lines in tile data**
```
scene.queryFeatures({ filter: { $layer: 'transit', kind: 'subway' }, group_by: 'ref' }).then(results => {
  console.log(Object.keys(results));
});

--->
["1", "2", "3", "4", "5", "6", "W", "R", "J", "Z", "PATH", "E", "C", "A", "D", "B", "Q", "N"]
```

**Get a count of visible POIs by kind, each time new tiles are rendered**
```
scene.subscribe({
  view_complete: function() { // when new tiles are rendered
    scene.queryFeatures({ filter: { $layer: 'pois' }, visible: true, group_by: 'kind' }).then(results => {
      for (let key in results) { 
        results[key] = results[key].length;
      }
      console.log(results);
    });
  }
});

--->
{
  "station": 6,
  "cafe": 20,
  "bank": 5,
  "restaurant": 34,
  "convenience": 10,
  "place_of_worship": 5,
  "bus_stop": 5,
  "hotel": 10,
  "museum": 1,
  "pub": 3,
  "bar": 2,
  "hospital": 1
}
```

**Add Leaflet markers for visible restaurant POIs**
```
scene.queryFeatures({ filter: { $layer: 'pois', kind: 'restaurant' }, visible: true, geometry: true }).then(results => {
  results.forEach(feature => {
    L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).addTo(map);
  });
});
```
![screen shot 2017-06-12 at 1 43 48 pm](https://user-images.githubusercontent.com/16733/27047203-368c1a0c-4f75-11e7-87d5-7608b6ef68da.png)

**Add Leaflet polylines (SVG) for major roads**
```
scene.queryFeatures({ filter: { $layer: 'roads', kind: 'major_road' }, unique: false, visible: true, geometry: true }).then(results => {
  results.forEach(feature => L.geoJSON(feature, {
    style: function () {
        return { color: 'red' };
    }
  }).addTo(map))
});
```
![screen shot 2017-06-12 at 1 48 01 pm](https://user-images.githubusercontent.com/16733/27047385-e9c44be4-4f75-11e7-90e0-c6be3d70ec94.png)


#### `rebuild()`
Rebuilds the current scene from scratch.

#### `requestRedraw()`
Requests an update to the drawn map. If the map contains animated elements, this happens once per frame automatically. If not, it happens whenever the map view changes (pan, zoom, etc.).

#### `screenshot({ background = 'white' })`
This queues a screenshot request, returning a Promise that fulfills when the screenshot is available.

The promise resolves with an object containing three properties:

- `url`: a data URL of the Canvas contents, suitable for loading into an `<img>` or opening in a new tab/window.
- `blob`: a `Blob` of type `image/png`, suitable for saving to a file, either manually or with a third-party library such as [FileSaver.js](https://github.com/eligrey/FileSaver.js/).
- `type`: the string `png`.

```javascript
scene.screenshot().then(function(screenshot) { window.open(screenshot.url); });
```

The optional `background` parameter allows a background color to be set for screenshots. The default is "white". This may be any [`color`](../Syntax-Reference/draw.md#color) value, including `transparent`.

```javascript
scene.screenshot({ background: 'transparent' }).then(s => window.open(s.url))
```

#### `setActiveCamera(camera)`
Sets the active camera to the camera specified by name, as named in the scene file.

#### `setDataSource(_string_ name, _object_ config)`
Loads a new `source` object (see [`sources`](../Syntax-Reference/sources.md)), returning a Promise which fulfills when the `source` is loaded.

If `name` doesn't match an existing source, a new source object will be created. The `source` object must follow the [`sources`](../Syntax-Reference/sources.md) specification.

```javascript
scene.setDataSource('osm', { type: 'TopoJSON', url: 'https://tile.nextzen.org/tilezen/vector/v1/256/all/{z}/{x}/{y}.topojson' });
```

This `source` object can be used in situations where the data to be drawn is inside a JavaScript variable, instead of in a separate file:

```javascript
var geojson_data = {};
...
scene.setDataSource('dynamic_data', { type: 'GeoJSON', data: geojson_data });
```

#### `setIntrospection(_boolean_)`
Enables feature selection for all features, regardless of their [`interactive`](../Syntax-Reference/draw.md#interactive) setting in the [scene file](../Overviews/Scene-File).

`scene.setIntrospection(true);`

Enabling or disabling introspection at run-time will cause the scene to rebuild automatically to reflect the new setting.

For more about using feature selection, see [`getFeatureAt()`](#getfeatureatpixel--radius-).

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

`stopVideoCapture()` returns a promise that will resolve with an object containing three properties:

- `url`: a data URL to the video, suitable for opening in a new tab/window.
- `blob`: a `Blob` of type `video/webm`, suitable for saving to a file, either manually or with a third-party library such as [FileSaver.js](https://github.com/eligrey/FileSaver.js/).
- `type`: the string `webm`.

```javascript
scene.startVideoCapture();
```

```javascript
scene.stopVideoCapture().then(function(video) {
    saveAs(video.blob, 'tangram-video-' + (+new Date()) + '.webm');
});
```

#### `updateConfig()`
Re-parses the `scene.config` object and triggers [`scene.rebuild()`](#rebuild) which also redraws the scene, updating data sources, cameras, lights, rendering styles and shaders, and reloading textures. If `updateConfig({ rebuild: true })` is specified, geometry will also be rebuilt (necessary in cases where `scene.config.layers` have been modified).

```javascript
scene.updateConfig()
```

Note that `updateConfig()` will not load changes to the `scene.config.import` object. As the [`import`](../Syntax-Reference/import) block must be parsed before loading the rest of the scene file, any changes to `import` must be handled with [`load()`](#loadscene_url-base_path-file_type).

## Events

Tangram provides a number of event handlers and emitters.

#### `error` and `warning`
The `error` event is fired when an unrecoverable error occurred while processing the scene. The callback is passed an object with `type`, `message` (text error message), `error` (JS error object), and `url` (the URL from which the scene was loaded) properties.

The `warning` event is fired when a recoverable issue occurred while processing the scene. The callback is passed an object with a `type`, which indicates the scope of the issue (e.g. textures, sources, etc.), along with additional type-specific properties.

```javascript
scene.subscribe({
    error: function (e) {
        console.log('scene error:', e);
    },
    warning: function (e) {
        console.log('scene warning:', e);
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

To activate the feature picking functionality for a particular layer, set the [`interactive`](../Syntax-Reference/draw.md#interactive) parameter.

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
