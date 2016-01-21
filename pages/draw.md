*This is the technical documentation for Tangram's styling system. For a conceptual overview of the styling system, see the [Styles Overview](Styles-Overview.md).*

####`draw`
The `draw` element is a required element in the [layer](layers.md) and [sublayer](layers.md#sublayer) elements. It defines the beginning of a _draw group_. There can be only one `draw` group per `layer` or _sublayer_.

####draw style
A previously-defined _draw style_ must be named under a [draw](draw.md) group. It defines the beginning of a _draw block_.

The name of the style must be either:

- one of the four built-in _draw styles_: `polygons`, `lines`, `points`, or `text`.
- the name of a _custom style_ defined in the [styles](styles.md) element.

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
            fancywater:
                ...
```

Rules defined in `draw` blocks will descend into any sublayers.

## style parameters

Many style parameters, such as `color`, are shared among draw styles – others are unique to particular draw styles.

####`align`
Optional _string_, one of `left`, `center`, `right`. Default is `center`, unless `anchor` is set (see below).

Sets alignment of text for multi-line labels — see [`text_wrap`](draw.md#text-wrap).

```yaml
text:
    align: left
```

####`anchor`
Optional _string_, one of `center`, `left`, `right`, `top`, `bottom`, `top-left`, `top-right`, `bottom-left`, or `bottom-right`. Default is `center`.

Applies to the `text` and `points` styles. Places the label or point/sprite on the specified side or corner of the feature. If `offset` is also set, it is applied *in addition to* the anchor.

```yaml
text:
    anchor: bottom   # places the text so that the top of the text is directly below the feature
    offset: [0, 2px] # moves the text an additional 2px down
```

If `anchor` is set but `align` is not, then `align` will be set to an appropriate default value:

- `anchor`: `center` | `top` | `bottom` => `align`: `center`
- `anchor`: `left` | `top-left` | `bottom-left` => `align`: `right`
- `anchor`: `right` | `top-right` | `bottom-right` => `align`: `left`

```yaml
text:
    anchor: bottom-left # the label will use `align: right` by default
```

####`cap`
Optional _string_, one of `butt`, `square`, or `round` following the [SVG protocol](http://www.w3.org/TR/SVG/painting.html#StrokeLinecapProperty). Default is `butt`.

Applies to the `lines` style. Sets the shape of the ends of features.

```yaml
draw:
    lines:
        color: black
        cap: round
```

####`centroid`
Optional _boolean_, default is `false`. 

Applies to the `points` style. If true, draws points only at the centroid of a polygon. 

```yaml
draw:
    points:
        centroid: true
```

####`collide`
[[ES-only](https://github.com/tangrams/tangram-es)] Optional _boolean_. Defaults to `true`.

Applies to `points` and `text`.

A point or text draw group marked with `collide: false` will not be checked for any collisions.

```yaml
poi-icons:
    draw:
        points:
           collide: false
```

####`color`

Required* RGB _[number, number, number]_, RGBA _[number, number, number, number]_, _hexcolor_, _web color name_, _stops_, or _function_ returning an array of _[r, g, b]_ values or _[r, g, b, a]_** values. RGB/RGBA value range is 0-1. No default.

Applies to `points`, `polygons`, and `lines`. (For `text`, see [fill](draw.md#fill).) Specifies the vertex color of the feature. This color will be passed to any active shaders and used in any light calculations as "color".

*`color` is not required if a style is used which specifies a shader with a _color block_ or a _filter block_.

**Currently, alpha values are ignored in every `blend` mode except `overlay`, which is the default blend mode of the `points` and `text` draw styles.


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

####`extrude`
Optional _boolean_, _number_, _[min, max]_, or _function_ returning any of the previous values. No default. Units are in meters.

Applies to `polygons` and `lines`. Extrudes features drawn with the `polygons` draw style into 3D space along the z-axis. Raises elements drawn with the `lines` draw style straight up from the ground plane.

When the value of this parameter is:

- _boolean_: if `true`, features will be extruded using the values in the feature's `height` and `min_height` properties (if those properties exist). If `false`, no extrusion.
- _number_ or _function_: features will be extruded to the provided height in meters. Features will be extruded from the ground plane, e.g. the `min_height` will be 0.
- _[min, max]_ array: features will be extruded from the provided `min` height in meters, to the provided `max` height in meters, e.g. `extrude: [50, 100]` will draw a polygon volume starting 50m above the ground, extending 100m high.

Since features drawn as `lines` have no height (e.g. they are flat 2D objects), they do not use the `min_height` values. They are simply raised to the specified `height`.

####`font`
Optional element. Defines the start of a font style block. (See [font-parameters](draw.md#font-parameters).)

Applies to the `text` style.

####`interactive`
Optional _boolean_ or _function_ returning `true` or `false`. Default is `false`.

Applies to all _draw styles_. When `true`, activates _Feature Selection_, allowing the feature to be queried via the [JavaScript API](Javascript-API.md).

```yaml
draw:
    polygons:
        interactive: true
```

####`join`
Optional _string_, one of `bevel`, `round`, or `miter` following the [SVG protocol](http://www.w3.org/TR/SVG/painting.html#StrokeLinecapProperty). Default is `butt`.

Applies to `lines`. Sets the shape of joints in multi-segment lines.

```yaml
draw:
    lines:
        color: black
        join: round
```

####`miter_limit`
Optional _integer_. Default is 3.

Applies to `lines` with a `join` parameter set to "miter". When the length of a miter join is longer than the ratio of the `miter_limit` to the width of the line, that join is converted from a "miter" to a "bevel". This prevents excessively "spiky" corners on sharply curved lines.

Higher values allow sharper corners. Lower values result in more beveled corners, which produces a comparatively softer line shape.

```yaml
draw:
   lines:
      color: red
      width: 5px
      miter_limit: 2
```

####`move_into_tile`
Optional _boolean_. Default is _true_.

Moves the label into the tile if the label would otherwise cross a tile boundary. This should be set to _false_ if using `anchor`/`align` functionality for text + icon combinations – otherwise, text can get out of sync with expected position.

####`offset`
Optional _[float x, float y]_ _array_ or _stops_, in `px`. No default.

Applies to styles with a `points` or `text` base. Moves the feature from its original location. For `points`, and `text` labels of point features, the offset is in *screen-space*, e.g. a Y offset of 10px will move the point or label 10 pixels down on the screen. 

For labels of line features, the offset follows the *orientation of the line*, so a -10px offset will move the label 10 pixels *above* the line ("up" relative to the line). For example, line label offsets are useful for placing labels on top of or underneath roads or administrative borders.

Drawing points for POIs:

```yaml
pois:
    draw:
        points:
            # moves the point 10 pixels up in screen-space
            offset: [0px, -10px]
```

Drawing labels for POI points:

```yaml
pois:
    draw:
        text:
            # moves the point 10 pixels down in screen-space
            offset: [0px, 10px]
```

Drawing labels for road lines:

```yaml
roads:
    draw:
        text:
            # moves the label 12 pixels above the line
            offset: [0px, -12px]
```

Using _stops_ allows different `offset` values at different zooms. This can be used in conjunction with _anchor_ to position text and sprites adjacent to each other correctly when the sprite's size is interpolating across zooms.

```yaml
roads:
    draw:
        text:
            offset: [[13, [0, 6px]], [15, [0, 9px]]]
```

####`order`
Required _integer_ or _function_. No default.

Applies to all _draw styles_. Sets the drawing order of the _draw style_, to be used in case of depth collisions. Higher-ordered layers will be drawn over lower-ordered layers. Child rules override parent rules.

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


####`outline`
Optional element. Defines the start of an outline style block.

Applies to `polygons` and `lines`. Draws an outline around the feature. `outline` elements can take any `lines` style parameters.


####`priority`
_integer_ or _function_. Default is the local system's max integer value.

Applies to `text`. Sets the label priority of the feature. _functions_ must return integers.

Lower values will have higher priority, e.g. `priority: 1` labels will be drawn before those with `priority: 2`; labels are drawn in a "first-come-first-drawn" method, so earlier labels are more likely to fit in the available space.

For example, to set a `places` labels to have priority over others:
```yaml
draw:
    text:
        priority: 1
```

Here's one way to set a label's priority based on the area of the labeled feature:
```yaml
draw:
    text:
        priority: function() { return Math.min(10 - Math.floor(feature.area / 1000), 10); }
```

####`repeat_distance`
Optional _number_, in `px`. Default is `256px`.

Applies to `text`. Specifies minimum distance between labels in the same `repeat_group`, measuring from the center of each label. Only applies per tile – labels may still be drawn closer than the `repeat_distance` across a tile boundary.

```yaml
draw:
   text:
      repeat_distance: 100px # label can repeat every 100 pixels
      ...
```

```yaml
draw:
   text:
       repeat_distance: 0px # labels can repeat anywhere
      ...
```

####`repeat_group`
Optional _string_. No default.

Applies to `text`. Allows the grouping of different label types for purposes of fine-tuning label repetition. By default, all labels with the same set of `draw` rules (eg `text_source`, `style`, etc.) belong to the same `repeat_group`.


For example: labels from the two layers below can be drawn near each other, because they are in different repeat groups by default:

```yaml
roads:
   major_roads:
      filter: { kind: major_road }
      draw:
         text:
            ...
   minor_roads:
      filter: { kind: minor_road }
      draw:
         text:
            ...
```

However, labels in the sub-layers below won't repeat near each other, because they have been placed in the same `repeat_group`:

```yaml
roads:
   draw:
      text:
         repeat_group: roads-fewer-labels
   major_roads:
      filter: { kind: major_road }
      draw:
         text:
            ...
   minor_roads:
      filter: { kind: minor_road }
      draw:
         text:
            ...
```

####`size`
Optional _number_, in `px`. Default is `32px`.

Applies to `points`.

```yaml
draw:
    points:
        size: 32px
        sprite: museum
```

####`sprite`
Optional _string_, one of any named `sprites` in the style's `texture` element, or a _function_ returning such a string.

Applies to `points`. Sets the `sprite` to be used when drawing a feature.

```yaml
draw:
    points:
        size: 32px
        sprite: museum
```

```yaml
draw:
    points:
        size: 32px
        sprite: function() { return feature.kind } # look for a sprite matching the feature's 'kind' property
```

####`sprite_default`
Optional _string_. Sets a default sprite for cases when the matching function fails.

Applies to `points`.

```yaml
poi-icons:
    draw:
        points:
            sprite: function() { return feature.kind }
            sprite_default: generic
```

####`style`
Optional _string_, naming a style defined in the [`styles`](styles.md) block.

Applies to all _draw styles_.

This will import parameters from a predefined `style` into a `draw` block. Any imported parameters will be applied _after_ the other parameters defined in the `draw` block, using them for inputs. For instance, if a `color` is set in the `draw` block and a `style` is also named, that alpha will be available to any `shader` defined in the `style`. For more on this interaction, see [Materials Overview](Materials-Overview.md) and [Shaders Overview](Shaders-Overview.md).

```yaml
draw:
    polygons:
        style: normalripples
    ...
```

####`text_source`
Optional _string_, or _function_. Default is `name`.

Applies to `text`. Defines the source of the label text.

When the value is a string, it must name a feature property to use as the label text. For example, the default `name` value will draw labels showing the names of features (e.g. any that have a `name` field). An example of an alternative feature property label is to label buildings with their heights:

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

####`text_wrap`
Optional _boolean_ or _int_, in characters. Default is 15.

Enables text wrapping for labels. Wrapping is enabled by default for point labels, and disabled for line labels.

*Note:* Explicit line break characters (`\n`) in label text will cause a line break, even if `text_wrap` is disabled.

```yaml
text:
    text_wrap: true # uses default wrapping (15 characters).
    text_wrap: 10 # sets a maximum line length of 10 characters.
    text_wrap: false # disables wrapping.
```

####`tile_edges`
Optional _boolean_, one of `true` or `false`. Default is `false`.

Applies to `lines`. Enables the drawing of borders on the edges of tiles. Uusually not desirable visually, but useful for debugging.

```yaml
draw:
    water:
        outline:
            tile_edges: true
```

####`transition`
[[ES-only](https://github.com/tangrams/tangram-es)] Optional _map_ , where key is one or both of `hide` and `show` and value is a _map_ of `time` to time. `time` values can be either in seconds (`s`) or milliseconds (`ms`).

Applies to `points` and `text`. Sets the transition time from `hide` to `show`.

A transition time of `0` results in an instantaneous transition between states.

```yaml
poi-icons:
    draw:
        points:
           transition:
                [show, hide]:
                    time: .5s
```

####`visible`
Optional _boolean_ or _function_ returning `true` or `false`. Default is `true`.

If `false`, features will not be drawn.

```yaml
draw:
    lines-that-wont-draw:
        style: lines
        visible: false
```

####`width`
Required _number_, _stops_, or _function_. No default. Units are meters `m` or pixels `px`. Default units are `m`.

Applies to `lines`. Sets the width of a feature.

```yaml
draw:
    lines:
        width: 9
```

####`z`
Optional _number_. No default. Units are meters `m` or pixels `px`. Default units are `m`.

Applies to `polygons` and `lines`. Sets the z-offset of a feature.

```yaml
draw:
    lines:
        z: 50
```

## `font` parameters

The `font` object has a number of unique parameters.

```yaml
draw:
    text:
        font:
            family: Arial
            size: 14px
            style: italic
            weight: bold
            fill: '#cccccc'
            stroke: white
            transform: uppercase
```

####`family`
Optional _string_, naming a typeface. Sets the font-family of the label. Default is `Helvetica`.

`family` can be any typeface available to the operating system. The default will be used as a fallback if the other specified families are not available.

####`fill`
Optional _color_ or _stops_. Follows the specs of [color](draw.md#color). Default is `white`.

Sets the fill color of the label.

```yaml
font:
    fill: black
```
```yaml
font:
    fill: [[14, white], [18, gray]]
```

####`size`
Optional _number_ or _stops_, specifying a font size in `px`, `pt`, or `em`. Sets the size of the text. Default is `12`. Default units are `px`.

```yaml
font:
    family: Helvetica
    size: 10px
```

```yaml
font:
    family: Helvetica
    size: [[14, 12px], [16, 16px], [20, 24px]]
```

####`stroke`
Optional _{color, width}_ or _stops_. _colors_ follow the specs of [color](draw.md#color). _width_ may be an _int_ or _stops_. No default.

Sets the stroke color and width of the label. Width is interpreted as pixels.

```yaml
font:
    stroke: { color: white, width: 2 }
```
```yaml
font:
    stroke: { color: [[10, gray], [15, white]], width: [[10, 1], [15, 2]] }
```
```yaml
font:
    stroke:
        color: [[16, white], [18, red], [20, blue]]
        width: [[14, 3px], [20, 8px]]
```

####`style`
Optional _string_, specifying a font style. No default.

Currently supports only `italic`.

####`transform`
Optional _string_, one of `capitalize`, `uppercase`, or `lowercase`. Sets a text transform style. No default.

- `capitalize` will make the first letter in each word uppercase. `uppercase` and `lowercase` will change all letters to be uppercase and lowercase, respectively.

####`weight`
Optional _string_ or _number_. Strings may be one of `lighter`, `normal`, `bold`, or `bolder`; integers may be any CSS-style font weight from `100`-`900`. Default is `normal`.
