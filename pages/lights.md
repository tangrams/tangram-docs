*This is the technical documentation for Tangram’s lights. For a conceptual overview of the lighting system, see the [Lights Overview](Lights-Overview.md).*

#### `Lights`

The `lights` element is a top-level element in the [scene file](scene-file.md). Individual lights are defined by a *light name* under this element.

```yaml
lights:
    mainlight:
        type: directional
```

#### Light names
Required _string_. Can be anything*. No default.

```yaml
lights:
    light1:
        type: ambient
    directionalLight:
        type: directional
    point-light:
        type: point
```
* For technical reasons, hyphens in light names are converted to underscores internally. Thus "light-1" becomes "light_1". For this reason, you may not have two lights whose names are identical except for a hyphen in one case and an underscore in the same place in the other (eg "light-1" and "light_1"a) as they will be interpreted as the same name.

## Common light parameters

#### `type`

Required _string_. One of `ambient`, `directional`, `point`, or `spotlight`. No default.

```yaml
lights:
    light1:
        type: ambient
    light2:
        type: directional
    light3:
        type: point
    light4:
        type: spotlight
```

#### `ambient`

Optional parameter. _number_, `[R, G, B]`, _hex-color_, or _css color name_. Numerical values go from `0` to `1`. Defaults to `0`.

```yaml
    light1:
        type: point
        diffuse: white
        ambient: .3
```

#### `diffuse`

Optional parameter. _number_, `[R, G, B]`, _hex-color_, or _css color name_. Numerical values go from `0` to `1`. Defaults to `1`.

```yaml
light1:
    type: point
    diffuse: white
```

#### `specular`

Optional parameter. _number_, `[R, G, B]`, _hex-color_, or _css color name_. Numerical values go from `0` to `1`. Default is `0`.

```yaml
light1:
    type: directional
    direction: [0, 1, -.5]
    diffuse: white
    specular: ‘#FFFF99’
```

#### `visible`

Optional _Boolean_. Default is `true`.

Allows a defined light to be disabled or enabled through the JavaScript API.

```yaml
light1:
    type: point
    visible: false
```

## Directional light properties

#### `direction`

Required _vector_. `[x, y, z]`. Defaults to `[0.2, 0.7, -0.5]`

```yaml
light1:
    type: directional
    direction: [0, 1, -.5]
```

## Point light properties

#### `position`

Required _vector_ `[x, y, z]`, _[lat, long]_, or _{ lat: number, lng: number }_. Vectors may be specified in meters `m` or pixels `px`, depending on the value of `origin`. _[lat, long]s_ may be specified as _lists_ or _objects_ of the format _{ lat: number, lng: number}_. No default value. Default unit for vectors are `m`.

```yaml
lights:
    cameralight:
        type: point
        position: [0px, 0px, -700px]
        origin: camera

    worldlight-ground:
        type: point
        position: [ 0m, 100m, 500m ]
        origin: ground

    worldlight-world:
        type: point
        position: [-74.00976419448853, 40.70531887544228, 500m]
        origin: world

```

#### `origin`

Optional _string_, one of `world`, `camera`, or `ground`. Defaults to `world`.

Sets the reference point for the `position` parameter:

- `world`: sets x and y in _[lat, lng]_ and z in `m` from the ground
- `camera`: sets x and y in `px` from the camera center, and z in `m` from the camera
- `ground`: sets x and y in `px` from the camera center, and z in `m` from the ground

```yaml
light1:
    type: point
    position: [0px, 0px, 300px]
    origin: ground
```

#### `radius`

Optional _number_ or `[inner_radius, outer_radius]`. Assumes units of meters `m`. Defaults to `null`.

If only a single _number_ is set, it defines the outer radius, and the inner radius is set to `0`.

```yaml
light1:
    type: point
    diffuse: white
    radius: [300,700]
```

#### `attenuation`

Optional _number_. Defaults to `1`.

Sets the exponent of the attenuation function, which is applied between the inner and outer `radius` values.

```yaml
light1:
    type: point
    radius: [300,700]
    attenuation: 0.2
```

## Spotlight properties

#### `direction`

This is the same as the _[directional light](#directional-light-properties)_'s [direction](direction|lights#direction.md) property.

#### `position`

This is the same as the _[point light](#point-light-properties)_'s [position](lights.md#position) property.

#### `origin`

This is the same as the _[point light](#point-light-properties)_'s [origin](lights.md#origin) property.

#### `radius`

This is the same as the _[point light](#point-light-properties)_'s [radius](lights.md#radius) property.

#### `attenuation`

This is the same as the _[point light](#point-light-properties)_'s [attenuation](lights.md#attenuation) property.

#### `angle`

Optional _number_, in degrees. Defaults to `20`.

Sets the width of the spotlight's beam.

```yaml
light1:
    type: spotlight
    direction: [0, 1, -.5]
    position: [0, 0, 300]
    origin: ground
    radius: 700
    angle: 45
```

#### `exponent`

Optional _number_. Defaults to `0.2`.

This parameter sets the exponent of the spotlight's fallof, from the center of the beam to the edges. Higher values will give a sharper spotlight.

```yaml
light1:
    type: spotlight
    direction: [0, 1, -.5]
    position: [0, 0, 300]
    origin: ground
    diffuse: white
    ambient: .3
    radius: 700
    attenuation: 0.2
    angle: 45
    exponent: 10.
```
