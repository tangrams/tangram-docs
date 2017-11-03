*This is the technical documentation for Tangram's styling system. For a conceptual overview of the styling system, see the [Styles Overview](Styles-Overview.md).*

#### `draw`
`draw` is an optional element in a [layer](layers.md) or [sublayer](layers.md#sublayer-name). It provides one or more *draw groups* for rendering the features that match the _layer_ or _sublayer_ directly above it. These _draw groups_ are the sub-elements of the `draw` element, as in this example:
```yaml
...
layers:
    water:
        data: { source: osm }
        draw:
            draw_group:
                ...
            another_draw_group:
                ...
```
A `draw` element can specify multiple groups, indicating that matching features should be drawn multiple times. In the example above, features that match the "water" layer will be drawn twice, once according to the style of `draw_group` and once with that of `another_draw_group`.

#### draw group
The name of a _draw group_ can be any string. The sub-elements of a _draw group_ are parameters that determine various properties of how a feature will be drawn. These _style parameters_ are described in detail below.

A _draw group_ must specify the _style_ that will be used to draw a feature. It can do this in two ways:

 1. A _draw group_ may contain a parameter called `style` whose value names a _style_ (either a [built-in _style_](Styles-Overview.md#draw-styles) or one defined in the `styles` element of the scene file). For example:

 ```yaml
 ...
 draw:
     fancy_road_lines:
         style: lines
         ... # more parameters follow
 ```
 2. If a _draw group_ does not contain a `style` parameter, the group's name is interpreted as the name of a _style_ (again, either a [built-in _style_](Styles-Overview.md#draw-styles) or one from the `styles` element).

 ```yaml
 ...
 draw:
     lines:
         ... # no 'style' parameter follows
 ```

The 2nd, shorthand syntax is the preferred way to specify a _style_, however an explicit `style` parameter is necessary sometimes. For example, to draw a feature using the _lines_ style twice, the `draw` element would need two _draw groups_ with different names, e.g.
```yaml
...
draw:
    first_line:
        style: lines
        ... # more parameters follow
    second_line:
        style: lines
        ... # more parameters follow
```
Note that two _draw groups_ both named "lines" would be invalid YAML:

```yaml
...
draw:
    lines:
        ... # more parameters
    lines: # <- You can't do this in YAML!
        ... # more parameters
```


If the _style_ specified by a _draw group_ is neither a built-in _style_ nor a _style_ defined in the `styles` element, the group will draw nothing.

## style parameters

Many style parameters, such as [`color`](#color), are shared among draw styles – others are unique to particular draw styles.

#### `align`
Optional _string_ or _array of strings_, one of `left`, `center`, `right`. Default is `center`, unless `anchor` is set (see below).

Sets alignment of text for multi-line labels — see [`text_wrap`](draw.md#text_wrap).

```yaml
text:
    align: left
```

#### `anchor`
Optional _string_, one of `center`, `left`, `right`, `top`, `bottom`, `top-left`, `top-right`, `bottom-left`, or `bottom-right`. Default is `['bottom', 'top', 'right', 'left']`.

Applies to the `text` and `points` styles. Places the label or point/sprite on the specified side or corner of the feature. When an _array_ us used, each anchor position is tried in the order listed until a placement which does not collide is found.

```yaml
draw:
   points:
      ...
      text:
         anchor: [bottom, right, left, top]
```

If `offset` is also set, it is applied *in addition to* the anchor.

```yaml
text:
    anchor: bottom   # places the text so that the top of the text is directly below the feature
    offset: [0, 2px] # moves the text an additional 2px down
```

If `anchor` is set but `align` is not, then `align` will be set to an appropriate default value:

|If `anchor` is...|`align` defaults to...|
|-----------------|----------------------|
|`center`<br>`top`<br>`bottom`|`center`|
|`left`<br>`top-left`<br>`bottom-left`|`right`|
|`right`<br>`top-right`<br>`bottom-right`|`left`|

```yaml
text:
    anchor: bottom-left # the label will use `align: right` by default
```

#### `flat` 
[[ES-only](https://github.com/tangrams/tangram-es)]

Optional _boolean_. Default is `false`.

Applies to `points` styles. If marked `true`, points will be drawn flat on the ground in 3D space, and respond to 3D camera movement accordingly.

This can be used to draw elements such as one-way arrows on streets.

#### `angle`
Optional _number_ or _string_ `auto`. Numeric values of the angle are in degrees.

Applies to `points` style. Rotates the point.

When `auto` is specified, angles are computed according to the underlying geometry.

#### `buffer`
[JS-only] Optional _integer_ or _[integer, integer]_, in _px_. No default.

Applies to `points` and `text`. Specifies an optional buffer area that expands the collision bounding box of the feature, to avoid features from being rendered closer together than desired. A single value will be applied to all sides of the feature; a two-element array specifies separate horizontal and vertical buffering values.

```yaml
draw:
    points:
        buffer: [2px, 1px]: creates a two-pixel buffer on the left and right sides of the feature, and a one-pixel buffer on its top and bottom.
```

Buffers may be applied to both a _point_ and its attached _text_:

```yaml
draw:
    points:
        buffer: 1px # point portion has a one-pixel buffer
        ...
        text:
            buffer: 2px # text portion has a two-pixel buffer
            ...
```

#### `cap`
Optional _string_, one of `butt`, `square`, or `round` following the [SVG protocol](http://www.w3.org/TR/SVG/painting.html#StrokeLinecapProperty). Default is `butt`.

Applies to the `lines` style. Sets the shape of the ends of features.

```yaml
draw:
    lines:
        color: black
        cap: round
```

#### `collide`
Optional _boolean_. Defaults to `true`.

Applies to `points` and `text`.

A point or text draw group marked with `collide: false` will not be checked for any collisions.

_[JS only]_ Only points and text elements from the same datasource will collide with each other.

```yaml
poi-icons:
    draw:
        points:
           collide: false
```

#### `color`

Required* RGB _[number, number, number]_, RGBA _[number, number, number, number]_, _CSS color_, or _stops_. Can also be a _function_ which returns a color. RGB/RGBA value range is 0-1. No default.

Applies to `points`, `polygons`, and `lines`. (For `text`, see [fill](draw.md#fill).) Specifies the vertex color of the feature. This color will be passed to any active shaders and used in any light calculations as "color".

_CSS colors_ include the following color formats, as specified in the [W3C's Cascading Style Sheets specification](http://www.w3schools.com/cssref/css_colors_legal.asp):

- _named colors_: `red`, `blue`, `salmon`, `rebeccapurple`
- _hex colors_: `"#fff"`, `"#000"`, `"#9CE6E5"`
- _RGB colors_: `rgb(255, 190, 0)`
- _RGBA colors_**: `rgb(255, 190, 0, .5)`
- _HSL colors_: `hsl(180, 100%, 100%)`
- _HSL colors_**: `hsla(180, 100%, 100%, 50%)`

*`color` is not required if a style is used which specifies a shader with a _color block_ or a _filter block_. See [shaders: blocks](shaders.md#blocks).

**Currently, alpha values are ignored in the `add` and `multiply` `blend` modes, and respected in the `inlay` and `overlay` modes. For more on this, see the [`blend`](styles.md#blend) entry.


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

#### `extrude`
Optional _boolean_, _number_, _[min, max]_, or _function_ returning any of the previous values. No default. Units are in meters.

Applies to `polygons` and `lines`. Extrudes features drawn with the `polygons` draw style into 3D space along the z-axis. Raises elements drawn with the `lines` draw style straight up from the ground plane.

When the value of this parameter is:

- _boolean_: if `true`, features will be extruded using the values in the feature's `height` and `min_height` properties (if those properties exist). If `false`, no extrusion.
- _number_ or _function_: features will be extruded to the provided height in meters. Features will be extruded from the ground plane, e.g. the `min_height` will be 0.
- _[min, max]_ array: features will be extruded from the provided `min` height in meters, to the provided `max` height in meters, e.g. `extrude: [50, 100]` will draw a polygon volume starting 50m above the ground, extending 100m high.

Since features drawn as `lines` have no height (e.g. they are flat 2D objects), they do not use the `min_height` values. They are simply raised to the specified `height`.

#### `font`
Required element for the `text` style. Defines the start of a font style block. (See [font-parameters](draw.md#font-parameters).)

Applies only to the `text` style.

#### `interactive`
Optional _boolean_ or _function_ returning `true` or `false`. Default is `false`.

Applies to all _draw styles_. When `true`, activates _Feature Selection_, allowing this drawing of the feature to be queried via the [JavaScript API](Javascript-API.md) (see [getFeatureAt](Javascript-API.md#getfeatureatpixel).)

Multiple draw rules can create multiple drawings of one feature. Only those drawings with `interactive: true` in their rule will be available to query.

```yaml
draw:
    polygons:
        interactive: true
```

#### `join`
Optional _string_, one of `bevel`, `round`, or `miter` following the [SVG protocol](http://www.w3.org/TR/SVG/painting.html#StrokeLinecapProperty). Default is `miter`.

Applies to `lines`. Sets the shape of joints in multi-segment lines.

```yaml
draw:
    lines:
        color: black
        join: round
```

#### `max_lines`
Optional _integer_. No default.

Applies to the `text` style. When the `text_wrap: true` parameter is present, `max_lines` sets the maximum number of lines that a text label is allowed to occupy. If a label would wrap onto more lines, the label is truncated with a `…` character at the end of the last visible word.

```yaml
draw:
    text:
         text_source: function(){ return "This is a very very very very very very very long label." }
         text_wrap: true
         max_lines: 2
```

#### `miter_limit`
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

#### `move_into_tile`
[[JS-only](https://github.com/tangrams/tangram)] Optional _boolean_. Default is _true_.

Applies to `text` styles. Moves the label into the tile if the label would otherwise cross a tile boundary.

Note that this parameter is not available for `points` styles, nor for text labels attached to points.

#### `offset`
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

#### `optional`
Optional _boolean_. Default is `false`.

Applies to _text_ blocks under _point_ styles.

When `optional: true`, the point will draw even if the text label does not fit. When `optional: false`, the point will only draw if its text label can also fit on the map.

Note that attached _text_ will never draw without its _point_.

#### `order`
Required _integer_ or _function_. No default. (Not required when a layer is drawn with the _overlay_ [blend mode](styles.md#blend).)

Applies to the _polygon_ and _lines_ styles, by default, and to the `points` and `text` styles when the `inlay` _draw style_ is used.

Sets the drawing order of the _draw style_, to be used in case of z-depth collisions (when two features are at the same "z" height in space). In this case, higher-ordered layers will be drawn over lower-ordered layers. Child layer settings override parent layer settings.

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

Note that by default, `points` and `text` layers are drawn with the `overlay` [blend mode](styles.md#blend), which draws everything _on top_ of any other visible features using traditional alpha compositing. When `overlay` is used in any _draw style_, `order` will have no effect and is not required.

#### `outline`
Optional element. Defines the start of an outline style block.

Applies to `points` and `lines`. Draws an outline around the feature. `outline` elements can take any `lines` style parameters. The following parameters will be inherited from the parent `lines` style if not explicitly specified: `order`, `miterLimit` and `interactive`.

```yaml
draw:
    lines:
        order: 1
        width: 2px
        color: white
        outline:
            width: 1px
            color: blue
```

```yaml
draw:
    points:
        width: 10px
        color: white
        outline:
            width: 1px
            color: blue
```

Note that outlines on a `points` style will be ignored if it being drawn with a texture or sprite.

#### `placement`
Optional _string_, one of `vertex`, `spaced`, `midpoint`, or `centroid`. Default is `vertex`.

Applies to `points` styles. Defines the placement method of one or more points, when a `points`-based style is used to draw line or polygon features. 

- `placement: vertex`: place points at line/polygon vertices
- `placement: midpoint`: place points at line/polygon segment midpoints (better for road shields, which you want away from ambiguous intersections)
- `placement: spaced`: place points along a line/polygon at fixed intervals defined in pixels with `placement_spacing` (useful for symbols like one-way street arrows where consistent spacing is desirable)
- `placement: centroid`: place points at polygon centroids (not applicable to lines)

```yaml
draw:
    points:
        placement: centroid
```

#### `placement_min_length_ratio`
Optional _number_, _stops_, or _function_. Default is `1`. No units.

Applies to `points` styles used to draw line or polygon features, when the `placement` parameter is set to `spaced` or `midpoint`. Specifies the minimum line segment length as a ratio to the size (greater of width or height) of the point being placed. This prevents points from being drawn on line segments which are smaller than the point itself (for example, a road shield bigger than the road it is labeling).

Examples:

- `placement_min_length_ratio: 1` (default value) will only place points on line segments that are at least as long as the point itself (the point must fit 100% along the line segment)
- `placement_min_length_ratio: 0` disables this behavior by allowing a point to place on a line segment of any length (minimum length of 0).
- `placement_min_length_ratio: 2` requires the line segment to be at least twice as long as the point
- `placement_min_length_ratio: 0.5` requires the line segment to be only 50% as long as the point

#### `placement_spacing`
Optional _integer_, _stops_, or _function_. Units are `px`. Default is `80px`.

Applies to `points` styles, when `placement: spaced` is defined. 

#### `priority`
Optional _integer_ or _function_. Default is the local system's max integer value.

Applies to `points` and `text`. Sets the label priority of the feature. _functions_ must return integers.

_[JS only]_ Only points and text elements from the same datasource will collide with each other, so _priority_ values only apply within a single datasource.

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

#### `repeat_distance`
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

#### `repeat_group`
Optional _string_. No default.

Applies to `text`. Allows the grouping of different label types for purposes of fine-tuning label repetition. By default, all labels with the same set `draw` layer and label text belong to the same `repeat_group`.


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

#### `size`
Optional _number_ in `px`, _[x, y]_ in `px`, _stops_ having either 1D or 2D values (mixed 1D and
2D stop values are not allowed), or _function_. Default is `px`.

Applies to `points`.

```yaml
draw:
    points:
        size: 32px
        sprite: museum
```

```yaml
draw:
    points:
        size: [[13, 64px], [16, 18px], [18, 22px]]
        sprite: highway
```

```yaml
draw:
    points:
        size: function() { return (feature.height||0)/10 + 3; } # add 1px for every 10 meters of height (plus 3px base)
        color: red
```

#### `sprite`
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

Note that if any `sprites` are defined for a texture, a `sprite` must be declared for any _points_ drawn with that texture, or nothing will be drawn.

#### `sprite_default`
Optional _string_. Sets a default sprite for cases when the matching function fails.

Applies to `points`.

```yaml
poi-icons:
    draw:
        points:
            sprite: function() { return feature.kind }
            sprite_default: generic
```

#### `style`
Optional _string_, naming a style defined in the [`styles`](styles.md) block.

Applies to all _draw groups_.

Sets the rendering style used for the `draw` group (which defaults to a style matching the name of the draw group, if one exists). See [`draw`](draw.md#draw).

```yaml
draw:
    polygons:
        style: dots
    ...
```

#### `text`
Optional _block_. Declares the beginning of a `text` block of a `points` style.

Applies to _points_ styles only. (For the `text` _draw style_, see the [Styles Overview](Styles-Overview.md#text-1).)

This block allows _points_ styles to define an associated text label for each point, such as for POIs.

Text added in this way can be styled with the same syntax as the _text_ rendering style, but with different default values that take into account the "parent" point (see "[Text behavior](draw.md#text_behavior)" below).

The following parameters will be inherited from the parent `points` style if not explicitly specified: `interactive` and `repeat_group`.

For example, to create an icon with a _text_ label, using a style "icons" that has `base: points`:

```yaml
   draw:
      icons:
         sprite: ...
         size: 16px
         text:
            font: ...
```

#### Text behavior

The default text style behavior is adjusted to account for the parent point:

**Anchor**:
`anchor` defaults to `bottom` instead of `center` (though it is possible to composite a text label over a sprite by setting `anchor: center` and `collide: false`).

The point and text can have separate `anchor` values:
    - The `anchor` of the `text` controls the text's placement *relative to the size and position* of its parent point.
    - The `anchor` of the `points` portion moves the *entire entity* (point + text) relative to the underlying geometry point.

**Collision**:
The point is required, but its text is not: while the `points` portion of the style will render according to its collision test, the `text` portion will only render if **both** it and its parent point passed collision tests, e.g. if the point is occluded, then the text won't render either, even if it is not occluded.
Different collision behaviors can be achieved by setting the `collide: false` flag on either or both of the point and text:
    - Both `collide: true` (default): nothing will overlap, text will only be rendered if point also fits.
    - Points `collide: false`, text `collide: true` (default) and text `optional: true`: all points will render, text will render over points when the text fits (text will collide text but not points). This setting is helpful for labeling a dot density map.
    - Points `collide: false`, text `collide: true` (default): only points with text that fits will render
    - Points `collide: true` (default), text `collide: false`: points will render if they fit, in which case their attached text will also render, even if it overlaps something else.
    - Both `collide: false`: all points and text should render, regardless of overlap.

**Offset**:
Text is automatically offset to account for its anchor relative to its parent point (see description above).
Further manual offset is possible with the `offset` parameter, which moves the text in screen space, e.g. text with `anchor: bottom` will automatically be placed below the sprite, and an additional `offset: [8px, 0]` in the scene file would move the text another 8 pixels to the right.

**Priority**:
The text's `priority` is assigned a default value of `0.5` below the `priority` of its parent point (numerically this means the priority is `+0.5`, since lower numbers are "higher priority"). This can be explicitly overridden by setting a `priority` value in the `text` block, though the text's priority may not be set higher than that of its parent point. This is similar to `outline` handling, where the `order` of the outline cannot be higher than the line fill. (In both cases, the values are capped to their highest/lowest allowed values.)

For example, in this case, the icon has `priority: 3`, so the text portion is assigned a priority of `3.5`:

```yaml
  draw:
     icons:
        ...
        priority: 3
        text:
           ...
```

#### `text_source`
Optional _string_, _function_, _array_, or _mapping_. Default is `name`.

Applies to `text`. Defines the source of the label text.

When the value is a _string_, it must name a feature property to use as the label text. For example, the default `name` value will draw labels showing the names of features (e.g. any that have a `name` field). An example of an alternative feature property label is to label buildings with their heights:

```yaml
draw:
    text:
        text_source: height
        ...
```

When the value is a _function_, the return value will be used as the text of the label. For example, to label buildings as 'high' and 'low':

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

When the value is an _array_, each array element is evaluated as if it was a `text_source` value (meaning each element can be either a _string_ value that specifies a feature property by name, or a _function_ that returns displayable label text). The first _non-null_ evaluated source in the array is used as the label text.

The primary use case here is to support preferred language for text labels. For example:

```yaml
draw:
    text:
        text_source: [name:en, name]
```

The above example will display an English label (name:en) when available, and will fall back to the default local name when not available.

When the value is a _mapping_, it can define two optional subparameters: `left` and `right`. Each of these values is evaluated as a single `text_source` value (as a string, array, or function).

For example:

```yaml
draw:
    text:
        ...
        text_source:
            left: 'name:left'    # feature property name for left-side labels
            right: 'name:right'  # feature property name for right-side labels
```

Separate left and right-side labels are then placed along the line, with each label automatically offset by the height of the text. If an `offset` parameter is specified, it will be applied in addition to this automatic offset, with the Y value pushing each label in an opposite direction, away from the line.

#### `text_wrap`
Optional _boolean_ or _int_, in characters. Default is 15.

Enables text wrapping for labels. Wrapping is enabled by default for point labels, and disabled for line labels.

*Note:* Explicit line break characters (`\n`) in label text will cause a line break, even if `text_wrap` is disabled.

```yaml
text:
    text_wrap: true # uses default wrapping (15 characters).
    text_wrap: 10 # sets a maximum line length of 10 characters.
    text_wrap: false # disables wrapping.
```

#### `tile_edges`
Optional _boolean_, one of `true` or `false`. Default is `false`.

Applies to `lines`. Enables the drawing of borders on the edges of tiles. Usually not desirable visually, but useful for debugging.

```yaml
draw:
    water:
        outline:
            tile_edges: true
```

#### `transition`
[[ES-only](https://github.com/tangrams/tangram-es)] Optional _map_ , where key is one or both of `hide` and `show` and value is a _map_ of `time` to time. `time` values can be either in seconds (`s`) or milliseconds (`ms`).

Applies to `points` and `text`. Sets the transition time from `hide` to `show`.

A transition time of `0` results in an instantaneous transition between states.

```yaml
poi-icons:
    draw:
        points:
           transition:
                show:
                    time: .5s
                hide:
                    time: 0.25s
```

#### `visible`
Optional _boolean_. Default is `true`.

If `false`, features will not be drawn.

```yaml
draw:
    lines-that-wont-draw:
        style: lines
        visible: false
```

This paramater is also available for `text` blocks attached to a `points` layer:

```yaml
draw:
    points:
        color: red
        size: 5px
        text:
            visible: false
```

As well as `outline` blocks under `lines` layers:

```yaml
draw:
    lines:
        color: white
        width: 2px
        outline:
            visible: false
```

#### `width`
Required _number_, _stops_, or _function_. No default. Units are meters `m` or pixels `px`. Default units are `m`. A _function_ must return a unitless _number_ in mercator meters.

Applies to `lines`. Sets the width of a feature.

```yaml
draw:
    lines:
        width: 9
```

```yaml
draw:
    lines:
        width: 4px
```

```yaml
draw:
    lines:
        width: 18m
```

```yaml
draw:
    lines:
        width: function() { return $zoom / 4 * $meters_per_pixel; }
```

#### `z`
Optional _number_. No default. Units are meters `m` or pixels `px`. Default units are `m`.

Applies to `polygons` and `lines`. Sets the z-offset of a feature.

```yaml
draw:
    lines:
        z: 50
```

## `font` parameters

The `font` object has a number of unique parameters. None are required, but least one must be specified for a `text` style to be drawn.

```yaml
draw:
    text:
        font:
            family: Arial
            size: 14px
            style: italic
            weight: bold
            fill: '#cccccc'
            stroke: { color: white, width: 2 }
            transform: uppercase
```

#### `family`
Optional _string_, naming a typeface. Sets the font-family of the label. Default is `Helvetica`.

`family` can be any typeface available to the operating system. The default will be used as a fallback if the other specified families are not available.

#### `fill`
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

#### `size`
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

#### `stroke`
Optional _{color, width}_ or _stops_. _colors_ follow the specs of [color](draw.md#color). _width_ may be an _int_ or _stops_. No default.

Sets the stroke color and width of the label. Width is interpreted as pixels.

(To draw a stroke around a line or point, use [`outline`](draw.md#outline); to draw a stroke around a polygon, create two separate `draw` groups for `polygons` and `lines`.)

```yaml
font:
    stroke: { color: white, width: 2 }
```
```yaml
font:
    stroke:
        color: [[10, gray], [15, white]] # fade from gray to white
        width: [[14, 2px], [18, 6px]]    # increase stroke width at high zoom
```

#### `style`
Optional _string_, specifying a font style. No default.

Currently supports only `italic`.

#### `transform`
Optional _string_, one of `capitalize`, `uppercase`, or `lowercase`. Sets a text transform style. No default.

`capitalize` will make the first letter in each word uppercase. `uppercase` and `lowercase` will change all letters to be uppercase and lowercase, respectively.

#### `weight`
Optional _string_ or _number_. Strings may be one of `lighter`, `normal`, `bold`, or `bolder`; integers may be any CSS-style font weight from `100`-`900`. Default is `normal`.
