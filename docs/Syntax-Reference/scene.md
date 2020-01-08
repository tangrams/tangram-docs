*This is the technical documentation for Tangram's `scene` block. For a conceptual overview of the scene file, see the [Scene File overview page](../Overviews/Scene-File.md).*

## `scene`
The `scene` element is an optional top-level element in a Tangram scene file. It declares the beginning of a `sources` block. It allows various scene-wide options to be set:

- `background`
- `animated`

#### background
Optional block that can be used to set the map's background color, using a `color` property.


##### `color`
Optional _color_. Default is `[0., 0., 0.]`.

Specifies the color that will be drawn where no features are drawn. Alpha is not respected.

```yaml
scene:
    background:
        color: white
```

See also: [`color`](draw.md#color).

#### animated
Optional _boolean_, `true` or `false`. Default is `false`.

When `true`, this option forces per-frame updates.

Animated shaders will trigger redraws by default, but certain other kinds of animation – such as that made through the JavaScript API – may not. Setting this parameter may help in those cases.

```yaml
scene:
    animated: true
```
