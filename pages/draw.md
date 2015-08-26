*This is the technical documentation for Tangram's styling system. For a conceptual overview of the styling system, see the [Styles Overview](Styles-Overview.md).*

####`draw`
The `draw` element is a required element in the [layer](layers.md) and [sublayer](layers.md#sublayer) elements. It defines the beginning of a _draw group_. There can be only one `draw` group per `layer` or _sublayer_.

####draw style
A previously-defined _draw style_ must be named under a [draw](draw.md) group. It defines the beginning of a _draw block_.

The name of the style must be either:

- one of the four built-in _draw styles_ ("polygons", "lines", "sprites", or "text")
- a custom name, with a `style` sub-element naming a custom style defined in the [styles](styles.md) element.

An example of using a built-in draw style:
```yaml
layers:
    water:
        data: { source: osm }
        draw:
            polygons:
                ...
```

An example of using a custom draw style:
```yaml
layers:
    water:
        data: { source: osm }
        draw:
            fancy-water:
                style: water-shader
                ...
```

Rules defined in `draw` blocks will descend into any sublayers.

## style parameters

####`style`
Optional _string_, naming a style defined in the [`styles`](styles.md) block. Any style named here will be applied after the other parameters defined in the `draw` block, using them for inputs. For instance, if a `color` is set in the `draw` block and a `style` is also named, that alpha will be available to any `shader` defined in the `style`. For more on this interaction, see [Materials Overview](Materials-Overview.md) and [Shaders Overview](Shaders-Overview.md).
```yaml
draw:
    style: normalripples
    ...
```

####`order`
Required _integer_ or _function_. No default.

Sets the drawing order of the _draw style_, to be used in case of depth collisions. Higher-ordered layers will be drawn over lower-ordered layers. Child rules override parent rules.

```yaml
layers:
    roads:
        draw:
            lines:
                order: 1
        sublayer:
            draw:
                lines:
                    order: 2   # this layer's order is now 2
```

####`interactive`
Optional _boolean_ or _function_ returning `true` or `false`. Default is `false`.

When `true`, activates _Feature Selection_ – the feature can be queried via the [JavaScript API](Javascript-API.md).

```yaml
draw:
    polygons:
        interactive: true
```

####`color`

Optional RGB _[number, number, number]_, RGBA _[number, number, number, number]_, _hexcolor_, _web color name_, _stops_, or _function_ returning an array of _[r, g, b]_ values or _[r, g, b, a]_ values. RGB/RGBA value range is 0-1. Default is `[1, 1, 1]` (white).

Specifies the vertex color of the feature. This color will be passed to any active shaders and used in any light calculations as "color".

(Note that currently, alpha values are ignored in every `blend` mode except `overlay`, which is the default blend mode of the `points` and `text` draw styles.)

```yaml
draw:
    polygons:
        color: [.7, .7, .7]
```

```yaml
draw:
    polygons:
        color: red
```

```yaml
draw:
    polygons:
        color: '#ff00ff'
```

```yaml
draw:
    polygons:
        color: function() { return [$zoom, .5, .5]; }
```

```yaml
draw:
    points:
        color: [1.0, .5, .5, .5] # 50% alpha
```

####`width`
Required _number_, _stops_, or _function_, when using the `line` draw style. No default. Units are meters `m` or pixels `px`. Default units are `m`.

Sets the width of a feature drawn with the `line` draw style.

```yaml
draw:
    lines:
        width: 9
```

####`outline`
Optional element. Defines the start of an outline style block. See [outline-parameters](draw.md#outline-parameters).

Can take the `draw` style parameters `color` and `width`, as defined above.

####`extrude`
Optional _boolean_, _number_, _stops_, or _function_. No default. Units are meters `m` or pixels `px`. Default units are `m`.

Extrudes elements drawn with the `polygons` draw style into 3D space along the z-axis. It will also raise elements drawn with the `lines` draw style straight up from the ground plane.

####`font`
Optional element. Defines the start of a font style block. See [font-parameters](draw.md#font-parameters).

Enables labels for features drawn with the `text` style (or a custom style with `base: text`).

####`text_source`
Optional _string_, or _function_. Default is `name`.

Defines which label text is used, for features drawn with the `text` style (or a custom style with `base: text`). Ignored for other styles.

When the value is a string, it specifies a feature property to use as the label text. For example, the default `name` value will draw labels showing the names of features (e.g. any that have a `name` field). An example of an alternative feature property label is to label buildings with their heights:

```yaml
draw:
    text:
        text_source: height
        ...
```

When the value is a function, the return value will be used as the text of the label. For example, to label buildings as 'high' and 'low':

```yaml
draw:
    text:
        text_source: |
            function() {
                if (feature.height > 100) {
                    return 'high';  // features taller than 100m will be labeled 'high'
                }
                else {
                    return 'low';   // features 100m or shorter will be labeled 'low'
                }
            }
        ...
```

####`priority`
Required _integer_. No default.

Sets the label priority of the feature, when drawing with the `text` style (or a custom style with `base: text`).

Lower values will have higher priority, e.g. `priority: 1` labels will be drawn before those with `priority: 2`.

For example, to set a `places` labels to have priority over others:

```yaml
places:
    data: { source: osm }
    draw:
        text:
            priority: 1
            font:
                ...
```

####`sprite`
Optional _string_, one of any named `sprites` in the style's `texture` element, or a _function_ returning such a string.

Sets the sprite to be used when drawing a `sprites` style.

```yaml
draw:
    icons:
        size: 32px
        sprite: museum
```

```yaml
draw:
    icons:
        size: 32px
        sprite: function() { return feature.kind } # look for a sprite matching the feature's 'kind' property
```

####`size`
Optional _number_, in `px`. Sets the size of any `sprite` elements.

```yaml
draw:
    icons:
        size: 32px
        sprite: museum
```

####`sprite_default`
Optional _string_. Sets a default sprite for cases when the matching function fails.

```yaml
poi-icons:
    draw:
        icons:
            sprite: function() { return feature.kind }
            sprite_default: generic
```



## outline parameters

####`cap`
Optional _string_, one of `butt`, `square`, or `round` following the [SVG protocol](http://www.w3.org/TR/SVG/painting.html#StrokeLinecapProperty). Default is `butt`.

Sets the shape of the ends of features drawn with a line style.

```yaml
draw:
    lines:
        color: black
        cap: round
```

####`join`
Optional _string_, one of `bevel`, `round`, or `miter` following the [SVG protocol](http://www.w3.org/TR/SVG/painting.html#StrokeLinecapProperty). Default is `butt`.

Sets the shape of joints in multi-segment lines, for features drawn with a line style.

```yaml
draw:
    lines:
        color: black
        join: round
```

####`tile_edges`
Optional _boolean_, one of `true` or `false`. Default is `false`.

Enables borders on the edges of tiles.

```yaml
draw:
    water:
        outline:
            tile_edges: true
```


## font parameters

####`typeface`
Required _string_, naming either a _typeface_ or a _font declaration_. Sets the typeface or font of the label. Default is `Helvetica 12px`.

A _font_ declaration has the format _style_, _weight_, _size_, _typeface_. The properties mostly follow standard CSS conventions for font-style, font-weight, and font-family. All properties are optional.

- _style_ may be `italic`, `oblique`, or `normal`.
- _weight_ may be `lighter`, `normal`, `bold`, `bolder`, or an _int_ from 100-900.
- _size_ may specified in `px`, `pt`, or `em`.
- _typeface_ may be any typeface available in the browser.


```yaml
font:
    typeface: Arial
```

```yaml
font:
    typeface: italic bold 1.5em Futura
```

```yaml
font:
     typeface: bold 20pt Courier
```

####`fill`
Optional _color_. Follows the specs of [color](draw.md#color). Default is `white`.

Sets the fill color of the label.

```yaml
font:
    fill: black
```

####`stroke`
Optional _color_ or _{color, width}_. _colors_ follow the specs of [color](draw.md#color). No default.

Sets the stroke color (and optionally, width) of the label. Width is specified in pixels.

```yaml
font:
    stroke: white
```

```yaml
font:
    stroke: { color: white, width: 2 }
```

####`capitalized`
Optional _Boolean_, `true` or `false`.

Writes labels in all caps. Default is `false`

```yaml
font:
    capitalized: true
```
