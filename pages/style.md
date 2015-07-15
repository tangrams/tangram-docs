The **style** element is used to define the visual appearance of a `layer`. It is a top-level property of a `layer` element, and a sibling of a `filter` element. The style will apply to the data which matches the `filter`.
```yaml
roads:
    geometry: { source: osm, filter: roads }
    style:
        order: 1
        color: [0.83, 0.83, 0.83]
        width: 3px
        outline:
            color: [0, 0, 0]
            width: 2px
```
## Properties

- [name](#name)
- [order](#order)
- [color](#color)
- [width](#width)
- [interactive](#interactive)
- [outline](#outline)


All properties are optional, though if no `color` is applied, the layer may fail to draw.

#### `name`
- ascii string -  associates a `style` with an object defined in the [styles](styles.md) block.

#### `order`
Allowed values:
- `int` or `float`
- JavaScript functions which return a number: `function() { return (feature.z-order); }`

`order` applies a z-offset to the style, to visually separate layers which would otherwise be drawn at the same level.

For instance: OpenStreetMap data does not specify a height or altitude for earth and road data. In order for roads to be consistently drawn over earth areas, they must be offset.

#### `color`
- RGB: `[.245, .110, .656]`
- web colors: `red`
- JavaScript functions which return a 3-item list of numbers: `function() { return [scene.zoom, 1 - scene.zoom, 0]; }`

#### `width`
Allowed values:
- `int` or `float`, followed by either `px` or `m` (no units is assumed to be `m`): `2px`, `5.5`
- JavaScript functions which return a number: `function() { return (scene.zoom); }`

Defines the `width` of a line or outline.

#### `interactive`
- `True` or `False`, or any function which returns either value.

When `True` this value triggers functionality defined in style.js. Currently this defaults to Tangram's "feature selection" behavior.

#### `outline`
This special `outline` property can have any of the above properties. It will inherit properties only from parent `outline` elements.
```yaml
outline:
    color: black
    width: 2px
```

### Inheritance

`Styles` can be applied to [sub-layers]. Styles in sub-layers will inherit all of the styling properties from the parent layers.


