*This is the technical documentation for Tangram's styling system. For a conceptual overview of the styling system, see the [Styles Overview](Styles-Overview.md).*

####`styles`
The `styles` element is an optional top-level element in the [scene file](scene-file.md). It takes only one kind of element, the _style name_.

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

Defines a new custom style. 
```yaml
styles:
    buildings:
        base: polygons
```
## style parameters

####`base` and `mix`
Required _string_, naming one of the available style objects. Defines a style to inherit from. Tangram's built-in styles are `polygons`, `lines`, `sprites`, and `text`. No default.

If a named style is based on one of the built-in styles, `base` is used.
```yaml
styles:
    geo:
        base: polygon
    sprites:
        base: sprites
```

A named style may also descend from another named style. In this case, `mix` is used.
```yaml
styles:
    geo:
        base: polygon

    geo-variant:
        mix: geo
```

####`animated`
Optional _boolean_, `true` or `false`. When `true`, the renderer will attempt to redraw the style every frame.
```yaml
styles:
    water:
        base: polygon
        animated: true
```

####`blend`
Optional _string_, one of `add` or `multiply`. When set, polygons drawn with this style will be composited into the scene using the method specified, for a semi-transparent effect. Polygons composited with `add` will tend to accumulate toward white, and `multiply` will tend to acculumate toward black.
```yaml
styles:
    glass:
        base: polygon
        blend: multiply
```

####`texcoords`
Optional _boolean_, `true` or `false`. When `true`, the geometry will be assigned texture coordinates, for use with `material`s which use `texture`s.

Note that `texture` objects must be accompanied by a `mapping` parameter – for more, see [textures](textures.md).
```yaml
styles:
    monsters:
        base: sprites
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

####`style`
Optional _string_. References a _named style_ defined either in the `styles` block, or from an external file, in conjunction with the `url` parameter.

By default, the `url` parameter attempts to import a style with the same name it appears under; the `style` parameter overrides that.

Add a style named "toner", using the style named "halftone" from the `styles` block:
```yaml
styles:
    toner:
        style: halftone
```

Add a style named "toner", by importing a style named "halftone" from the file `halftone.yaml`:
```yaml
styles:
    toner:
        url: halftone.yaml
        style: halftone
```
