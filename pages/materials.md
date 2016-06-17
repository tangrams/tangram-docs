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

`ambient`, `diffuse` and `specular` properties can be defined as a texture map instead of a color. When a texture is used in this way, a number of other parameters may be used to modify its display.

#### `texture`

Optional _named texture_ or _URL_. No default.

For more, see [textures#texture](textures.md#texture).

#### `mapping`
Optional _string_, one of `uv`, `planar`, `triplanar`, or `spheremap`. Default is `triplanar` for `normal` textures and `spheremap` for all others.

The `spheremap` mapping can't be used with a `normal` map.

```yaml
material:
    diffuse:
        texture: ./material/rock.jpg
        mapping: uv
```

#### `scale`

Optional _number_ or _2D vector_. `number` or `[x,y]`. Defaults to `[1,1]`.

Sets a scaling value for the texture. Does not work with `uv` mapping.

```yaml
material:
    diffuse:
        texture: ./material/rock.jpg
        mapping: planar
        scale: 2.0
```

#### `amount`

Optional _number_ or _3D vector_. `number` or `[r,g,b]`. Defaults to `1`.

This value is a multiplier on the effect of the texture – it can be thought of as the texture's opacity.

```yaml
material:
    ambient: .5
    diffuse:
        texture: ./material/rock.jpg
        mapping: uv
        scale: 2.0
        amount: 0.5
```

See also: [texture parameters](textures.md#texture-parameters).
