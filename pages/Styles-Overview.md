*This is an overview of Tangram's styling system. For a complete technical reference of the custom style-creation system, see [styles](styles.md), and for all the technical details of drawing with those styles, see [draw](draw.md).*

Tangram currently has five built-in _draw styles_: `polygons`, `lines`, `points`, `text`, and `raster`. Each draw style displays data in a different way, and some of them require specific data types and properties.

Draw styles are referenced in two places in the scene file: when defining custom [styles](styles.md) and again in [draw](draw.md) groups.

## draw styles

#### `polygons`
The `polygons` _draw style_ tessellates and extrudes vector shapes into 3D geometry. It requires polygonal data. See [`polygons`](#polygons_1).

#### `lines`
The `lines` _draw style_ can turn either polygonal or line data into lines. See [`lines`](#lines_1).

#### `points`
The `points` _draw style_ draws a filled circle at the location of the data point. It can work with point data, lines, or polygons. Points will "collide" with each other, with only the winner being drawn, determined by the [`priority`](draw.md#priority) draw parameter.

Technically, this draw style creates a small quad, which is then colored with a default shader which draws a dot. This behavior can be overridden with either a custom shader or a texture.

See [`points`](#points_1).

#### `text`
The `text` _draw style_ draws text labels at a given point. It can work with point, line, or polygon data. When used with lines, the label will be drawn along the line. When used with polygons, the label will be drawn at the polygon's centroid. Text labels will "collide" with each other, with only the winner being drawn, determined by the [`priority`](draw.md#priority) draw parameter.

See [`text`](#text_1).
 
#### `raster`
The `raster` _draw style_ draws one tile-sized square per tile and paints it with the appropriate tile from a `Raster` data source. See [`raster`](#raster_1).

## Using Styles

These built-in _draw styles_ are used as the foundation for all custom styling in Tangram. When writing an inline style under a `layer`, they are referenced in _draw groups_, in one of two ways:

A _draw group_ with a custom name may reference a _style_ by name with the `style` parameter:

```yaml
roads:
    draw:
        my_style:
            style: polygons
            color: blue
```

Or, if a _draw group_ is named for one of the _draw styles_, the `style` parameter may be omitted:

```yaml
roads:
    draw:
        polygons:
            color: blue
        lines:
            color: red
```

By defining multiple _draw groups_ the same feature may be drawn using multiple styles simultaneously:

```yaml
roads:
    draw:
        polygons:
            color: blue
        lines:
            color: red
```

When defining a custom style, the built-in _draw groups_ are explicitly referenced under the new style name with the `base` parameter:

```yaml
styles:
    buildings:
        base: polygons
```

In this way, custom styles may "extend" the behavior or the built-in _draw styles_.

## polygons
The *polygons* draw style requires a datasource containing coordinates connected by lines into a "closed" shape. If the lines of the polygon start and stop at different places, it is an "open" shape, and the `polygons` draw style can't use it. But if a sequence of lines connects back onto its own starting point, it is considered "closed", and can be extruded into a 3D shape.

#### `polygons` parameters
Styles which are extensions of the `polygons` draw style can take the following parameters:

- `texcoords`
- `animated`
- `blend`
- `materials` : see [materials](materials.md)
- `shaders`: see [shaders](shaders.md)

#### `polygons` draw group requirements
[Draw groups](draw.md#draw-group) which use the `polygons` draw style must specify, at minimum, the following parameters in order to be drawn:

- [color](draw.md#color)

## lines
The *lines* style requires a datasource containing connected coordinates. Thus it can accept either linear or polygonal input data. It draws a rectangle along each line segment, and can optionally draw special [`join`](draw.md#join) and [`cap`](draw.md#cap) styles.

#### `lines` parameters
Styles which are extensions of the `lines` draw style can take the following parameters:

- `texcoords`
- `animated`
- `blend`
- `materials` : see [materials](materials.md)
- `shaders`: see [shaders](shaders.md)

#### `lines` draw group requirements
[Draw groups](draw.md#draw-group) which use the `lines` draw style must specify, at minimum, the following parameters in order to be drawn:

- [color](draw.md#color)
- [width](draw.md#width)

## points
The `points` draw style is used to draw dots or sprites at points of interest. It also builds a rectangle at a point, and can be colored in a variety of ways:

- with a special shader designed to draw a circle
- with a `texture`
- with a `sprite` from a `texture`

If the point is used to draw a dot, the size and color of this circle can be specified in the scene file with the `size` and `color` parameters.

`points` and `text` have a special relationship, which is useful for creating custom labels and icons. They will also collide with each other – the "winner" is drawn and the "loser" is not, as determined by the [`priority`](draw.md#priority) draw parameter.

#### `points` draw group requirements
[Draw groups](draw.md#draw-group) which use the `points` draw style must specify, at minimum, the following parameters in order to be drawn:

- [color](draw.md#color)
- [size](draw.md#size)

## text
The `text` style is similar to the `sprites` style, in that it builds a rectangle at a point. However, instead of being colored with a custom texture, this style builds its own texture, containing text.

The content of the text is based on the [`text_source`](draw.md#text-source) parameter. The style of the text is specified by the [`font`](draw.md#font-parameters) parameters.

#### `text` parameters
Styles which are extensions of the `text` style can take the following special parameters:

- [`font`](draw.md#font-parameters): Sets font's typeface, style, size, color, and outline.
- [`text_source`](draw.md#text_source): Determines label text, defaults to the feature's `name` property.
- [`priority`](draw.md#priority): Sets the priority of the label relative to other labels and points/sprites.
- [`align`](draw.md#align): Controls text alignment.
- [`anchor`](draw.md#anchor): Controls text's relative positioning.
- [`offset`](draw.md#offset): Controls text's position offset.
- [`text_wrap`](draw.md#text_wrap): Sets number of characters before text wraps to multiple lines.
- [`repeat_distance`](draw.md#repeat_distance): Sets the distance beyond which label text may repeat.
- [`repeat_group`](draw.md#repeat_group): Optional grouping mechanism for fine-grained control over text repetition.
- [`collide`](draw.md#collide): Sets whether label collides with other labels or points/sprites.
- [`move_into_tile`](draw.md#move_into_tile): Increases number of labels that will display, by moving some to fit within tile bounds (JS-only)

These parameters are described in the [draw](draw.md) entry.

#### `text` draw group requirements
[Draw groups](draw.md#draw-group) which use the `text` draw style must specify, at minimum, the following parameters in order to be drawn:

- [font](draw.md#font)

## `raster`
The `raster` style renders [Raster data sources](sources.md#Raster), such as traditional raster tiles.

Note that `Raster` sources can also be used by other styles, by "attaching" the sources to the styles with the [rasters](sources.md#rasters) parameter. See the [Rasters Overview](Raster-Overview.md).

## style composition with `mix`

The `mix` parameter copies the properties of the named style (or styles) to a new style. In this way, new styles can be "forked" from existing styles.

This allows styles to be made which vary only slightly from each other, without having to manually duplicate everything else in the style code. It also allows a style to act as a "base" or "foundation" style, to be mixed into others.

The following example creates a style named "geo2" by copying all the properties of the "geo" style:

```yaml
styles:
    geo:
        base: polygon
    geo2:
        mix: geo
```

These two styles are identical.

#### modifications

Once you've mixed in a style, you can add or modify any properties you like.

For example, you could create a new style called styleB that "inherits from" an existing style called styleA, and then adds custom shader blocks:

```yaml
styleB:
   mix: styleA
   shaders:
      blocks:
         color: ...
```

Or you could mix in an existing style, but disable lighting:

```yaml
fancy-but-no-lighting:
    base: fancy
    lighting: false
```

You can even modify the mix'ed-in style's `base`. For example, if you have a polygon-based style with custom shader blocks that you want to apply to lines instead, you can create a line-based version like this:

```yaml
fancy-lines:
    mix: fancy-polygons
    base: lines # change the base to lines
```

Note that in this case, any properties which were special to the `polygons` draw style will still be copied, but will be ignored by the renderer.


#### combinations

The `mix` parameter can also be given a list of styles – this makes it possible to mix multiple effects together, e.g. to apply both the windows and halftone effects simultaneously:

```yaml
halftone-windows:
    mix: [ windows, halftone ]
```

Styles in a list will be copied in the order listed – so if a property is common to multiple named styles, styles named last in the list will take precedence.

```yaml
styles:
    custom:
        mix: [styleA, styleB, styleC]
```

Here, styleC's properties will override any it has in common with the other listed styles.
