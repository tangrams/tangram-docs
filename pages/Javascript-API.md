*This is the technical documentation for Tangram's JavaScript API.*

In the process of constructing a map, Tangram mirrors much of the structure of the 3D scene and the yaml file itself in JavaScript objects. Most of the properties and functions on these objects are used internally by the library, but a few are designed to be referenceable and modifiable, to allow easier design and interactivity.

#### `scene`
A `scene` object can be exposed by passing the scene's url to the `Tangram.leafletLayer()` function. This allows access to the `scene` object as a property on the Leaflet layer:

```javascript
> layer = Tangram.leafletLayer({ scene: url, ... });
> layer.scene
<- Scene {initialized: true, ...}
```

Many of the scene's properties may be accessed and changed on the fly with methods on this object.

#### `config`
This contains the JavaScript version of the [scene file](scene-file.md):
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

If changes are made to the `config` object, you must call `scene.updateConfig()` for them to take effect.

####`scene.config.textures`
The `textures` object lists all currently-loaded textures available in the scene. This list is loaded from the `textures` element in the scenefile, but may be modified on the fly. Modifications will not take efect until `scene.updateConfig()` is called.

For instance, to change the url of a texture:

```javascript
  scene.config.textures.orbits.url = "http://..../image.png";
  scene.updateConfig({ rebuild: true });
```

To add a new texture:

```javascript
var image = new document.createElement("image");
...
scene.config.textures.orbits.element = image;
scene.updateConfig({ rebuild: true });

// or

var canvas = new document.createElement("canvas");
...
scene.config.textures.orbits.element = canvas;
scene.updateConfig({ rebuild: true });

// or

var raw_data = { data: [], width: 500, height: 500 }
...
scene.config.textures.orbits.data = raw_data;
scene.updateConfig({ rebuild: true });
```

#### `scene.selection.feature`
Simple object-picking may be enabled by setting any layer's `interactive` option to `true`. This will enable Tangram's "feature selection" capability for objects in that layer.

The properties of the feature at the current cursor location may be accessed through the `scene.selection.feature` object:

```javascript
> scene.selection.feature.properties
<- Object {name: "1 New York Plaza", area: 9699, height: 195, id: 157001066}
```

This is accomplished by assigning a unique color to each feature onscreen and rendering the scene to an offscreen buffer. When queried, the `scene.selection` object checks the offscreen render at the current cursor position, and identifies the feature by its color.

#### `getActiveCamera()`
Returns the active camera.

#### `requestRedraw()`
Requests an update to the drawn map. If `animated: true` is set, this happens once per frame automatically.

#### `reload(scene_url)`
Loads the specified scene by url and rebuilds the geometry.

#### `rebuild()`
Rebuilds the current scene from scratch.

#### `screenshot()`
This queues a screenshot request, returning a Promise that fulfills when the screenshot is available. (The screenshot must be "queued" because it cannot be captured immediately: we must ensure that the GL buffer is finished drawing, and then must capture the buffer contents just after rendering, before it is cleared by other operations.)

The promise resolves with an object containing two properties:

- url: a data URL of the Canvas contents, suitable for loading into an <img> or opening in a new tab/window
- blob: a Blob of type image/png, suitable for saving to a file, either manually or with a third-party library such as FileSaver.js

```javascript
scene.screenshot().then(function(screenshot) {
    // uses FileSaver.js: https://github.com/eligrey/FileSaver.js/
    saveAs(screenshot.blob, 'tangram-' + (+new Date()) + '.png');
});
```

#### `setActiveCamera(_string_ camera)`
Sets the active camera to the camera specified by name, as named in the scenefile.

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
Re-parses the scene.config object and rebuilds the scene from scratch, updating data sources, reloading textures, and rebuilding geometry.

```javascript
scene.updateConfig()
```

#### `scene.view_complete`
This is an event which fires when the view is in a "resting state", meaning new geometry is rendered, and no further tiles are loading/building. For example, when a scene is loaded, a view_complete event will fire when all tiles have loaded and the map renders. If the view is then zoomed in a level, another view_complete event will fire when the next zoom finishes rendering.

`view_complete` can be subscribed to like other scene events:

```javascript
scene.subscribe({
    view_complete: function () {
        console.log('scene view complete, rendered ' +
            scene.render_count + ' primitives at: ' +
            [scene.center.lng, scene.center.lat, scene.zoom].join('/'));
    }
});
```