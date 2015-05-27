*This is the technical documentation for Tangram's cameras. For a conceptual overview of the camera system, see the [[Cameras Overview]].*

####`cameras`

The `cameras` element is a required top-level element in the [[scene file]]. Individual cameras are defined by a *camera name* under this element.
```yaml
cameras:
    camera1:
        type: perspective
    camera2:
        type: perspective
    overview:
        type: isometric
```

#### camera names
Required _string_. Can be anything except the [[reserved keywords|yaml#reserved keywords]]. No default.

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

####`type`
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

####`position`
Optional _[lat, lng]_ or _[lat, lng, zoom]_. Defaults to `[-74.00976419448854, 40.70532700869127, 16]`, the southern tip of Manhattan.

Sets the longitude and latitude of the camera, in degrees.
```yaml
camera1:
    position: [-73.97297501564027, 40.76434821445407]
```

####`zoom`
Optional _number_. Default: `15`

Sets the zoom level of the view, in standard [Web Mercator](http://en.wikipedia.org/wiki/Web_Mercator) zoom levels.

```yaml
camera1:
    zoom: 14
```

####`active`
Optional _boolean_. `true` or `false`. No default.

Sets the camera which provides the active view of the map when it is first loaded. If multiple cameras are active, the camera defined first in the scene file will take precedence. The [[Javascript API]] can be used to [[get|Javascript API#getactivecamera]] or [[set|Javascript API#setactivecamera]] the active camera.

```yaml
camera1:
    active: false
```

##perspective camera parameters

####`focal_length`
Optional _number_ or _[[stops|yaml#stops]]_. Unitless. Defaults to `[[16, 2], [17, 2.5], [18, 3], [19, 4], [20, 6]]`.

Sets the amount of vertical exaggeration in the z-plane. Changes the apparent height of extruded elements. Lower values = more exaggeration. Also see `fov`.

```yaml
camera1:
    focal_length: [[16, 2], [17, 2.5], [18, 3], [19, 4], [20, 6]]
```
####`vanishing_point`
Optional _[number, number]_, in `px`. Defaults to `[0px, 0px]`. Units default to `px`.

Sets the apparent perspective origin, in pixels from the center of the screen.

```yaml
camera1:
    type: perspective
    vanishing_point: [-250, -250]
```

####`fov`
Optional _number_.

Sets the "field of view" of the camera, in degrees. Field of view has an inverse relationship with `focal_length`: higher values cause more exaggeration. If both are set, `focal_length` will take precedence over `fov`.

```yaml
camera1:
    fov: 80
```

##isometric camera parameters

####`axis`
Optional _[number, number]_. Default: `[0, 1]`

Sets the `[x, y]` direction and amount of the isometric camera's vertical axis, which controls controls how extruded objects' height is displayed. A value of `1` equals a scale of 100%. Larger values produce more scaling.

```yaml
isometric-cam:
    type: isometric
    axis: [1, .5]
```

##flat camera parameters

The `flat` camera presents a top-down 2D map view (extrusion is not visible), and has no unique parameters.