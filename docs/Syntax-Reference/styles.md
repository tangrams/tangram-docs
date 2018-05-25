*This is the technical documentation for Tangram's `styles` object. For a conceptual overview of the styling system, see the [Styles Overview](../Overviews/Styles-Overview.md).*

#### `styles`
The `styles` element is an optional top-level element in the [scene file](../Overviews/Scene-File.md). It takes only one kind of element, a named _style object_.

Styles defined under this element can be referenced by name inside a [draw](draw.md) group with the `style` parameter.
```yaml
styles:
    buildings-style:
        base: polygons
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

#### `base`
Optional _string_, naming one of Tangram's built-in _draw styles_: `polygons`, `lines`, `points`, `text`, or `raster`. No default.

Defines the expected input geometry of the custom style, which determines what other kinds of parameters the style can take.

```yaml
styles:
    geo:
        base: polygons
    icons:
        base: points
```

For more, see the [Styles Overview](../Overviews/Styles-Overview.md#draw-styles).

#### `animated`
Optional _boolean_, `true` or `false`. When `true`, the renderer will attempt to redraw the style every frame.
```yaml
styles:
    water:
        base: polygons
        animated: true
```

#### `blend`
Optional _string_, one of `opaque`, `translucent`, `add`, `multiply`, `overlay`, or `inlay`. The `points` and `text` draw styles have a default `blend` value of `overlay` – the `polygons` and `lines` draw styles have a default of `opaque`.

When set, features drawn with this style will be composited into the scene using the method specified, for a transparent effect.

The `translucent` blend mode provides alpha blending for front-facing polygons, while culling backfaces and occluding other features (such as buildings).

In most cases, for _layers_ drawn with a given _draw style_, [`order`](draw.md#order) must also be defined:

    - when _lines_ and _polygons_ are drawn with any `blend` except `overlay`
    - when _points_ and _labels_ are drawn with a `blend` of `inlay`

The `overlay` and `inlay` blend modes apply traditional transparency using the alpha channel. Features drawn with `overlay` will be appear on top of the scene (irrespective of the `order` property), similar to a heads-up display. This is useful for compositing labels on top of the scene. In this case [`collide`](draw.md#collide) and [`priority`](draw.md#priority) will determine which features are drawn, and in which order.

`inlay` will cause features to be interwoven into the scene at an appropriate depth, according to their `order` value. To illustrate the difference between `inlay` and `overlay`: a street label drawn with `overlay` will be visible *over* any geometry covering the street, such as a nearby building, while a label drawn with `inlay` will display *behind* the building (but will still be partially visible where it is not covered by the building).

`add` and `multiply` apply Photoshop-filter-like operations: features composited with `add` will tend to accumulate toward white, and `multiply` will tend to acculumate toward black.

```yaml
styles:
    glass:
        base: polygons
        blend: multiply
```

Styles will be rendered in the following order:

- All opaque styles render first.
- All non-opaque styles without a defined `blend_order` (see [below](styles.md#blend_order)) render next, sorted by `add`, `multiply`, `inlay`, `overlay`,
- All non-opaque styles with a defined `blend_order` render last, sorted by `blend_order` (ascending), sub-sorted by `add`, `multiply`, `inlay`, `overlay`.

Each group above also now has a final sub-sort by style name, to provide a consistent render order and resolve ambiguities.

#### `blend_order`
Optional _integer_ greater than or equal to 0. No default.

Controls the order in which styles with non-opaque blending (`add`, `multiply`, `inlay`, `overlay`) are rendered. Styles with a greater `blend_order` value will be drawn on top.

```yaml
styles:
    marker:
        base: points
        blend: overlay
        blend_order: 1   # marker goes on top of icons
        ...

    icons:
        base: points
        blend: overlay
        blend_order: 0   # icons go underneath marker
        ...
```

For more, see the [Styles Overview](../Overviews/Styles-Overview.md#draw-styles).

#### `dash`
Optional _array_ of _numbers_. Defines a dash pattern for use with line textures. No default.

Applies to _lines_ styles.

A _dash pattern_ is an array defining a pattern of alternating dashes and spaces, e.g. `[2, 1]` creates a pattern of dashes that are each 2 units long, separated by spaces that are 1 unit long.

The unit of the _dash pattern_ is the width of its line, for example:

- `[1]` creates a series of square dashes and spaces.
- `[2]` creates a series of dashes and spaces whose length is twice the width of the line.
- `[.5]` creates a series of dashes and spaces whose length is half the width of the line.
- `[2, 1]` creates a dash which is twice as long as the line's width, with spaces the length of the line's width.

If the _dash pattern_ contains an odd number of entries, it is repeated to form an even pattern (as in SVG). This means that the `[1, 1]` example above is equivalent to just `[1]`. Similarly, `[3, 1, 1]` would become `[3, 1, 1, 3, 1, 1]`.

```yaml
styles:
    dashed-lines:
        base: lines
        dash: [1, 1]
```

```yaml
styles:
    dashed-lines:
        base: lines
        dash: [.5, 1]
```

Dash patterns may be changed or removed at the _draw layer_ with the `draw` group's `dash`(draw.md#dash) parameter.

##### Dash coloring

The dashes are colored using the feature's _color_ as assigned by the layer's _draw_ group (aka the "vertex color").

By default, the "spaces" in the dash pattern are transparent. Alternatively, an opaque background color can be assigned with the [dash_background_color](styles.md#dash_background_color) parameter, which is useful for typical "stairs" or "railway"-like patterns.

```yaml
styles:
    dashed-lines:
        base: lines
        dash: [1, 2]
        
layers:
    earth:
        data: { source: osm }
        draw:
            dashed-lines:
                order: 1
                width: 3px
                color: orange
```

#### `dash_background_color`

Optional _color_. Sets an opaque background color for lines drawn using the `dash` parameter. Default is transparent.

```yaml
styles:
    dashed-lines:
        base: lines
        dash: [1, 1]
        dash_background_color: [0.086,0.149,0.290]
```

See [`dash`](styles.md#dash).

#### `draw`
Optional `draw` _block_, specifying [`draw`](draw.md) parameter defaults. These defaults will be applied to any `draw` group using the parent `style`, and may be overridden or supplemented as normal.

This example sets a default `size` for icons:

```
styles:
  # setting up style with default draw size
  icons:
    base: points
    texture: icons
    draw:
      size: 16px # default size

layers:
  ...
  draw:
    # drawing style with default size, plus setting sprite
    icons:
      sprite: coffee
```

It's possible to specify all needed draw parameters in this way, though a `draw` group specifying the style must still be specified in the `layers` block. In this case, it is enough to specify an empty draw group:

```
layers:
  ...
  draw:
    icons: # draw with defaults
```

#### `lighting`
Optional _string_, one of `fragment`, `vertex`, or `false`. Sets the lighting type of the style. Default is `fragment`.

- `fragment`: lighting will be calculated once per pixel.
- `vertex`: lighting will be calculated once per vertex, and values between vertices will be interpolated.
- `false`: lighting will not be calculated.

```yaml
styles:
    flat_polygons:
        base: polygons
        lighting: false
```

#### `material`
Optional parameter. Starts a material definition block. For more on materials, see the [materials technical reference](materials.md).

```yaml
styles:
    landuse:
        base: polygons
        material:
            ...
```

#### `mix`
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

For more, see the [Styles Overview](../Overviews/Styles-Overview.md#style-composition-with-mix).

#### `raster`
Optional _string_, one of `color`, `normal`, or `custom`. Controls interpretation of any attached `Raster` sources. Default is `color`.

The `raster` parameter determines how any `Raster` sources attached with the `rasters` parameter will be interpreted and applied to the geometry, and whether the sources' texture data will be made available to any shaders.

- `color`: Applies the value of the raster texture as the `color` in the fragment shader. This is the most common case, and is set as the default by the `raster` rendering style.
- `normal`: To support terrain shading, there is also built-in support for applying a raster source as a normal map.
- `custom`: This value is for cases where you want access to raster samplers, but the data is not formatted for direct use as a color or normal. Mapzen's RGB-packed elevation tiles are an example; the raw data must be decoded and re-interpreted for usable results, and is not intended for display.

When a style has `raster: custom`, any shaders defined in the style can directly sample the raster data for custom effects. The following (public) GLSL uniforms and helper functions are provided:

- `sampleRaster(int N)`: Samples the Nth raster source at the current pixel position (similar to `texture2D()` but adjusts UV offset and scale to account for any raster tile overzooming).
- `sampleRasterAtPixel(int N, vec2 pixel)`: Samples the Nth raster source at the pixel (not UV) position in `pixel`, e.g. `sampleRasterAtPixel(0, vec2(100, 50))` to sample at pixel `(100, 50)`.
- `vec2 currentRasterPixel(int N)`: Returns the current pixel position for the Nth raster source. Useful along with the above for sampling nearby pixels (e.g. to derive a normal map, perform a convolution kernel, etc).
- `vec2 rasterPixelSize(int N)`: A uniform array providing the pixel dimensions of the Nth raster source.

For examples, see [Raster Overview#Direct Sampler Access](../Overviews/Raster-Overview.md#Direct-Sampler-Access).

#### `shaders`
Optional _string_. Begins the shaders definition object. For more on materials, see the [shaders technical reference](shaders.md).

```yaml
styles:
    buildings:
        base: polygons
        shaders:
            blocks:
            ...
```

#### `texture`
Optional _URL_, _texture object_, or _named texture_ on a _points_- or _lines_-based _draw style_ or within a points- or lines-based _draw group_. No default.

Assigns a _texture_ for use as the color of the point.

When used within a _draw style_ definition, `texture` sets the default texture to be used with a given _points_ or _lines_ style:

```yaml
styles:
    ghosts:
        base: points
        texture: images/inky.png
```

```yaml
styles:
    arrows:
        base: lines
        texture: arrow.png
```

When used within a _draw group_, `texture` may be used to override or clear a texture declaration:

```yaml
layers:
    ghosts:
        filter: ...
        draw:
            points:
                ... # use default
        blinky:
            filter: ...
            draw:
                points:
                    style: ghosts
                    texture: images/blinky.png # override in sublayer
        other:
            filter: ...
            draw:
                ghosts:
                    texture: null # override in sublayer
```

For more, see [textures#texture](textures.md#texture).

#### `texcoords`
Optional _boolean_, `true` or `false`. When `true`, the geometry will be assigned texture coordinates, for use with `texture` objects in combination with the `mapping` parameter – for more, see [textures](textures.md). This option only affects `polygons` and `lines` styles. Default is `false`.

```yaml
styles:
    building:
        base: polygons
        texcoords: true
```

When any [material](https://github.com/tangrams/tangram-docs/blob/gh-pages/pages/materials.md) with mapping `uv` is set, the option will be set to `true`.

```yaml
styles:
    building:
        base: polygons
        texcoords: false
        material:
            diffuse:
                texture: grid
                mapping: uv # will default texcoords to true for the style `building`
                            # and generate texture coordinates for the polygons
```

Texture coordinates for line geometries are generated with a linear scale in relation to the line's width, enabling properly spaced line patterns.

When `texcoords: true` for any lines-based style, the value of `v_texcoord.x` will range from 0-1 across the width of the line, and the value of `v_texcoord.y` will vary along the length of the line, with a value of `1` being a length  equal to the line's width.

For example, setting `color.rgb = vec3(fract(v_texcoord.y));` creates a pattern of repeating greyscale gradient squares across the line.

The pattern's aspect ratio can be adjusted by dividing the `v_texcoord.y`, for example `fract(v_texcoord.y / 2.)` creates a pattern that is twice as long as it is wide.
