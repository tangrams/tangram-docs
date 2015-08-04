*This is the technical documentation for Tangram's `styles` object. For a conceptual overview of the styling system, see the [Styles Overview](Styles-Overview.md).*

####`styles`
The `styles` element is an optional top-level element in the [scene file](scene-file.md). It takes only one kind of element, a named _style object_.

Styles defined under this element can be referenced by name inside a [draw](draw.md) group with the `style` parameter.
```yaml
styles:
    buildings-style:
        base: polygon
        shaders: ...

buildings:
    draw:
        polygons:
            style: buildings-style
```

### style name
Required _string_, can be anything. No default.

A custom `style` must specify either a `base` or `mix` parameter, or both.

Defines a new custom style. 
```yaml
styles:
    buildings:
        base: polygons
```
## style parameters

####`base`
Optional _string_, naming one of the built-in _draw styles_. No default.

Defines the expected input geometry of the custom style, which determines what other kinds of parameters the style can take. Tangram's built-in styles are `polygons`, `lines`, `points`, and `text`. No default.

```yaml
styles:
    geo:
        base: polygon
    icons:
        base: points
```

For more, see the [Styles Overview](Styles-Overview.md#draw-styles).

####`mix`
Optional _string_ or _list_, naming one or more custom styles. No default.

Copies properties from other custom styles.

```yaml
styles:
    geo-variant:
        mix: geo
```

Can also be used to combine multiple styles:

```yaml
styles:
    custom:
        mix: [styleA, styleB, styleC]
```

For more, see the [Styles Overview](Styles-Overview.md#style-composition-with-mix).


####`animated`
Optional _boolean_, `true` or `false`. When `true`, the renderer will attempt to redraw the style every frame.
```yaml
styles:
    water:
        base: polygon
        animated: true
```

####`blend`
Optional _string_, one of `add`, `multiply`, `overlay`, or `inlay`. The `points` and `text` draw styles have a default `blend` value of `overlay` – the `polygons` and `lines` draw styles have no default, and no blending will be applied to them if this parameter is not specified.

When set, features drawn with this style will be composited into the scene using the method specified, for a transparent effect.

The `overlay` and `inlay` blend modes apply traditional transparency using the alpha channel. Features drawn with `overlay` will be appear on top of the scene (irrespective of the `order` property), similar to a heads-up display. This is useful for compositing labels on top of the scene. `inlay` will cause features to be interwoven into the scene at an appropriate depth, according to their `order` value. To illustrate the difference: a street label drawn with `overlay` will be visible *over* any geometry covering the street, such as a nearby building, while a label drawn with `inlay` will display *behind* the building (but will still be partially visible where it is not covered by the building).

`add` and `multiply` apply Photoshop-filter-like operations: features composited with `add` will tend to accumulate toward white, and `multiply` will tend to acculumate toward black.

```yaml
styles:
    glass:
        base: polygon
        blend: multiply
```

####`lighting`
Optional _string_, one of `fragment`, `vertex`, or `false`. Sets the lighting type of the style. Default is `fragment`.

- `fragment`: lighting will be calculated once per pixel.
- `vertex`: lighting will be calculated once per vertex, and values between vertices will be interpolated.
- `false`: lighting will not be calculated.

```yaml
styles:
    flat_polygons:
        base: polygon
        lighting: false
```

####`texture`
Optional _URL_, _texture object_, or _named texture_ on the "points" _draw style_. No default.

Assigns a _texture_ for use as the color of the point.

```yaml
styles:
    ghosts:
        base: points
        texture: images/ghost.png
```

For more, see [textures#texture](textures.md#texture).

####`texcoords`
Optional _boolean_, `true` or `false`. When `true`, the geometry will be assigned texture coordinates, for use with `texture` objects in combination with the `mapping` parameter – for more, see [textures](textures.md).

```yaml
styles:
    monsters:
        base: points
        texcoords: true
```

####`shaders`
Optional _string_. Begins the shaders definition object. For more on materials, see the [shaders technical reference](shaders.md).

```yaml
styles:
    buildings:
        base: polygons
        shaders:
            blocks:
            ...
```

####`material`
Optional parameter. Starts a material definition block. For more on materials, see the [materials technical reference](materials.md).

```yaml
styles:
    landuse:
        base: polygons
        material:
            ...
```

####`url`
Optional _URL_. Imports a style definition from a URL. The URL should point to a YAML file that includes one or more style definitions, in the same format they appear under the top-level `styles` element in the [scene file](scene-file.md).

```yaml
styles:
    halftone:
        url: halftone.yaml
```

In `halftone.yaml`:
```yaml
halftone:
    base: polygons
    ...
```
