*This is the technical documentation for Tangram's cameras. For a conceptual overview of the camera system, see the [Cameras Overview](../Cameras-Overview).*

#### `cameras`

The `cameras` element is an optional top-level element in the [scene file](Scene-file.md). Individual cameras are defined by a *camera name* under this element.
```yaml
cameras:
    camera1:
        type: perspective
    camera2:
        type: perspective
    overview:
        type: isometric
```

##### `camera`
It is also permissable to use the element name `camera` at the top level, if there is only a single camera in the scene:

```yaml
camera:
    type: perspective
```

#### camera names
Required _string_ (except in the case of [`camera`](cameras.md#camera)). Can be anything except the [reserved keywords](yaml.md#reserved-keywords). No default.

```yaml
cameras:
    myCamera:
        type: perspective
    camera2:
        type: perspective
    lock-off:
        type: perspective
```
## common camera parameters

#### `type`
Required _string_. One of `perspective`, `isometric`, or `flat`. No default.
```yaml
cameras:
    camera1:
        type: perspective
    camera2:
        type: isometric
    overview:
        type: flat
```

#### `position`
Optional _[lat, lng]_ or _[lat, lng, zoom]_. No default.

Sets the longitude and latitude of the camera, in degrees.
```yaml
camera1:
    position: [-73.97297501564027, 40.76434821445407]
```

#### `zoom`
Optional _number_. Default: `15`

Sets the zoom level of the view, in standard [Web Mercator](http://en.wikipedia.org/wiki/Web_Mercator) zoom levels.

```yaml
camera1:
    zoom: 14
```

#### `active`
Optional _boolean_. `true` or `false`. No default.

Sets the camera which provides the active view of the map when it is first loaded. If multiple cameras are defined, only one may be active at a time. If multiple cameras are set as `active: true`, the behavior will be unpredictable (see the [yaml#mappings](yaml.md#mappings) entry). The [JavaScript API](Javascript-API.md) can be used to [get](Javascript-API.md#getactivecamera) or [set](Javascript-API.md#setactivecamera_string_-camera) the active camera.

```yaml
camera1:
    active: false
```

#### `max_tilt`
[ES-only] Optional _number_ or _[stops](yaml.md#stops)_. Degrees. Defaults to `90`. 

Sets the maximum angle from vertical that the camera is permitted to tilt. For cameras with `type: isometric` the tilt is further constrained at high zooms to prevent the viewing plane from intersecting the ground. 

## perspective camera parameters

#### `focal_length`
Optional _number_ or _[stops](yaml.md#stops)_. Unitless. Defaults to `[[16, 2], [17, 2.5], [18, 3], [19, 4], [20, 6]]`.

Sets the amount of vertical exaggeration in the z-plane. Changes the apparent height of extruded elements. Lower values = more exaggeration. Also see `fov`.

```yaml
camera1:
    focal_length: [[16, 2], [17, 2.5], [18, 3], [19, 4], [20, 6]]
```
#### `vanishing_point`
Optional _[number, number]_, in `px`. Defaults to `[0px, 0px]`. Units default to `px`.

Sets the apparent perspective origin, in pixels from the center of the screen.

```yaml
camera1:
    type: perspective
    vanishing_point: [-250, -250]
```

#### `fov`
Optional _number_.

Sets the "field of view" of the camera, in degrees. Field of view has an inverse relationship with `focal_length`: higher values cause more exaggeration. If both are set, `focal_length` will take precedence over `fov`.

```yaml
camera1:
    fov: 80
```

## isometric camera parameters

#### `axis`
Optional _[number, number]_. Default: `[0, 1]`

Sets the `[x, y]` direction and amount of the isometric camera's vertical axis, which controls controls how extruded objects' height is displayed. A value of `1` equals a scale of 100%. Larger values produce more scaling.

```yaml
isometric-cam:
    type: isometric
    axis: [1, .5]
```

## flat camera parameters

The `flat` camera presents a top-down 2D map view (extrusion is not visible), and has no unique parameters.
