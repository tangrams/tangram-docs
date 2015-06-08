*This is the technical documentation for Tangram’s materials. For a conceptual overview of the material system, see the [Materials Overview](Materials-Overview.md).*

#### `material`

Optional parameter. Begins a material block under a named [style](styles.md).

```yaml
styles:
    water:
        base: polygons
        animated: true
        material:
            ambient: .7
            diffuse: [0,0,1]
            specular: white
```

## material properties

#### `diffuse`

Optional parameter. Can be a _number_ from `0`-`1`, `[R, G, B]`, `hex-color`, `css color name`, or `texture`. Defaults to the geometry's `color` value.

```yaml
styles:
    red-wall:
        base: polygons
        material:
            diffuse: red 
```


#### `ambient` 
Optional parameter. Can be a _number_ from `0`-`1`, `[R, G, B]`, `hex-color`, `css color name`, or _texture_. Defaults to the `diffuse` value.

```yaml
styles:
    surface:
        base: polygons
        material:
            ambient: .7
```

#### `specular`

Optional parameter. Can be a _number_ from `0`-`1`, `[R, G, B]`, `hex-color`, `css color name`, or _texture_. Defaults to `[1.0, 1.0, 1.0]`.

```yaml
styles:
    water:
        base: polygons
        material:
            ambient: .7
            diffuse: [0,0,1]
            specular: white
            shininess: 2.0
```

#### `shininess`

Optional _number_. Defaults to `0.2`.

```yaml
styles:
    water:
        base: polygons
        material:
            ambient: .7
            diffuse: [0,0,1]
            specular: white
            shininess: 2.0
```

#### `normal`

Optional parameter. Begins a `normal` texture block. Requires `texture` and `mapping` parameters. All the mapping parameters may be applied to this object except `mapping: spheremap`. No default.

```yaml
material:
    ambient: .7
    normal:
        texture: materials/bricks.png
        mapping: uv
```

### Textures

`ambient`, `diffuse` and `specular` properties can be defined with a texture map instead of a color. A `texture` requires, at the minimum, a url path and a `mapping` mode.

#### `texture`

Optional _string_, defining a _path_ `"complete/texture/url.png"` or _named [texture](textures.md)_. No default.

If a texture is identified by _path_, a `mapping` mode must be specified.

```yaml
diffuse:
    texture: ./material/sky.jpg
    mapping: spheremap
```

If a texture is referenced by _name_, the `mapping` parameter must be defined in the associated _named [texture](textures.md)_ block.
```yaml
textures:
    sky:
        texture: ./material/sky.jpg
        mapping: spheremap

diffuse:
    texture: sky
```

See also: [texture parameters](textures.md#texture-parameters).
