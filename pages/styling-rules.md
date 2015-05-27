*This is the technical documentation for Tangram's styling system. For a conceptual overview of the styling system, see the [[Styles Overview]].*

####`draw`
The `draw` element is a required element in the [[layer|layers]] and [[sublayer|layers#sublayer-name]] elements. It defines the beginning of a _draw group_. There can be only one `draw` group per `layer` or sublayer.

####drawing style
A _drawing style_ must be named under a [[draw]] group. It defines the beginning of a draw block.

The _drawing style_ is named either one of the four styles, or a custom name, with a `style` sub-element naming a pre-defined style.

Rules defined in `draw` blocks will descend into any sublayers.

*Note*: This is not to be confused with the [[styles]] element, which is a top-level element in the scene file used to define [[materials]] and [[shaders]].

```yaml
layers:
    water:
        data: { source: osm }
        draw:
            polygons:
            ...
```

## style parameters

####`name`
Optional _string_, naming a style defined in the [[styles]] block. Any style named here will be applied after and using the parameters defined in the `style` block. For more on this interaction, see [[Materials Overview]] and [[Shaders Overview]].
```yaml
style:
    name: normalripples
    ...
```

####`order`
Required _integer_ or _function_. No default.

Sets the drawing order of the draw style, to be used in case of depth collisions. Higher-ordered layers will be drawn over lower-ordered layers. Child rules override parent rules.

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

When `true`, activates _Feature Selection_ – the feature can be queried via the [[Javascript API]].

```yaml
draw:
    polygons:
        interactive: true
```

####`color`

Optional RGB _[number, number, number]_, _hexcolor_, _web color name_, _stops_, or _function_ returning an array of _[r, g, b]_ values. RGB value range is 0-1. Default is `[1, 1, 1]` (white).

Specifies the vertex color of the feature. This color will be passed to any active shaders and used in any light calculations as "color".

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

####`width`
Optional _number_, _stops_, or _function_, in meters `m` or pixels `px`. No default. Default units are `m`.

Sets the width of a line feature, such as a road.

```yaml
draw:
    lines:
        width: 9
```

####`outline`
Optional element. Defines the start of an outline style block. See [[styling-rules#outline-parameters]].

Can take the `draw` style parameters `color` and `width`, as defined above.

####`font`
Optional element. Defines the start of a font style block. See [[styling-rules#font-parameters]].

Enables labels.

####`sprite`
Optional _string_, one of any named `sprites` in a `texture` element.

Sets the sprite to be used when drawing a `sprites` style.

```yaml
draw:
    icons:
        size: 32px
        sprite: museum
```

####`size`
Optional _number_, in `px`. Sets the size of any `sprite` elements.

```yaml
draw:
    icons:
        size: 32px
        sprite: museum
```

## outline parameters

####`cap`
Optional _string_, one of `butt` or `round`. Default is `butt`.

Sets the shape of the ends of features drawn with a line style.

```yaml
draw:
    lines:
        color: black
        cap: round
```

####`join`
Optional _string_, one of `butt`, `angle`, `round`, or `mitre`. Default is `butt`.

Sets the shape of joints in multi-segment lines, for features drawn with a line style.

```yaml
draw:
    lines:
        color: black
        join: round
```

## font parameters

####`size`
Required _number_, in `px`, `pt`, or `em`. No default.

Sets the size of the label.

```yaml
draw:
    text:
        font:
            size: 12px
```

####`typeface`
Required _string_, naming either a _typeface_ or a _font declaration_. Sets the typeface or font of the label. No default.

A _font_ declaration has the format _style_, _weight_, _size_, _typeface_. The properties mostly follow standard CSS conventions for font-style, font-weight, and font-family. All properties are optional.

- _style_ may be `italic`, `oblique`, or `normal`.
- _weight_ may be `lighter`, `normal`, `bold`, `bolder`, or an _int_ from 100-900.
- _size_ may specified in `px`, `pt`, or `em`.
- _typeface_ may be any typeface available in the browser.


```yaml
font:
    typeface: Ariel
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
Optional _color_. Follows the specs of [[color|styling-rules#color]]. Default is `[0, 0, 0]`.

Sets the fill color of the label.

```yaml
font:
    fill: black
```

####`stroke`
Optional _color_ or _{color, width}_. _colors_ follow the specs of [[color|styling-rules#color]]. Default is `[1.0, 1.0, 1.0]`.

Sets the stroke color (and optionally, width) of the label.

```yaml
font:
    stroke: white
```

```yaml
font:
    stroke: { color: white, width: 2px }
```

####`capitalized`
Optional _Boolean_, `true` or `false`.

Writes labels in all caps.

```yaml
font:
    capitalized: true
```