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

#### `scene.selection.feature`
Simple object-picking may be enabled by setting any layer's `interactive` option to `true`. This will enable Tangram's "feature selection" capability for objects in that layer.

The properties of the feature at the current cursor location may be accessed through the `scene.selection.feature` object:

```javascript
> scene.selection.feature.properties
<- Object {name: "1 New York Plaza", area: 9699, height: 195, id: 157001066}
```

This is accomplished by assigning a unique color to each feature onscreen and rendering the scene to an offscreen buffer. When queried, the `scene.selection` object checks the offscreen render at the current cursor position, and identifies the feature by its color.

#### `requestRedraw()`
Requests an update to the drawn map. If `animated: true` is set, this happens once per frame automatically.

#### `getActiveCamera()`

#### `setActiveCamera()`

#### `reload(scene_url)`

#### `rebuild()`
