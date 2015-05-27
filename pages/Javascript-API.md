*This is the technical documentation for Tangram's JavaScript API.*

In the process of constructing the web map, Tangram mirrors much of the structure of the scene file in a JavaScript object called `window.scene`. Most of its properties and functions objects are used internally by the library, but a few are designed to be referenceable and modifiable, to allow easier design and interactivity.

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

#### `requestRedraw()`
Requests an update to the drawn map. If `animated: true` is set, this happens once per frame automatically.

#### `getActiveCamera()`

#### `setActiveCamera()`

#### `reload(scene_url)`

#### `rebuild()`