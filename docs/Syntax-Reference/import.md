*This is the technical documentation for Tangram's `import` block. For a conceptual overview of the scene file, see the [Scene File overview page](../Overviews/Scene-File.md).*

## `import`

The `import` element is an optional top-level element in a Tangram scene file, declaring an `import` parameter. The value can be a single .yaml _URL_, or an _array_ of .yaml _URLs_.

```yaml
import: pois.yaml
```

```yaml
import: [pois.yaml, roads.yaml, landuse.yaml]
```

#### Overview and Usage

The `import` block allows a scene file to import one or more additional scene files (which can then in turn recursively import others).

It works by **deep-merging** each imported scene into the current one: the "child" (imported) file is merged first, with the "parent" file merged after, overwriting any properties shared with the child.

For example:

**`child.yaml`**:
```
layers:
   roads:
      draw:
         lines:
            color: [0.7, 0.3, 0.8]
```

**`parent.yaml`**:
```
import: child.yaml
layers:
   roads:
      draw:
         lines:
            color: [0.3, 0.3, 0.3] # overwrites previous color array with new color array
```

#### Objects vs. Arrays
One important aspect of the merge behavior is that it applies to all *YAML maps/JS objects*, but **not** to *YAML sequences/JS arrays*. While key/value objects merge (with new keys inserted, and existing keys overwriting the previous value), _arrays_ are treated as scalar values that entirely overwrite the previous value (rather than merging the array contents).

## Style Composition

Styles may be composed with `import` using a variety of patterns, a few of which are described below.

#### Base Map + Addition
In this case, an existing basemap is imported, and additional data sources and styles are added to it. In this example, a terrain layer is added to a road map:

```yaml
import: road_map.yaml

sources:
    stamen-terrain:
        type: Raster
        url: http://a.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg

layers:
    earth:
        data: { source: stamen-terrain }
        draw:
            raster:
                order: 0
```

#### Themes / Customization

Using [global properties](global.md) to stand in for common values, styles can derive from a common "skeleton" file, with a smaller number of higher-level properties configured for different purposes. Variable parameters may be set to define color palettes, label visibility presets, and more, by overriding the imported properties with new values. This allows style customization without altering the original scene file.

#### File Management

When designing complex styles such as complete basemaps, it may be desirable to split a large scene into several files to ease the authoring and maintenance burden. Files could be grouped by styling theme (landuse, roads, POIs, etc.), by function (all custom `styles` in one file, all `sources` in another, etc.), or by any other combination.

#### Style/Shader/Sprite Library

Components of an existing style may be extracted into separate files, either as stand-alone building blocks or as part of a packaged "library." These could include complete rendering styles, (to be used as-is or `mix`'ed with others), pre-defined POI sprite textures and accompanying style rules, or individual shader functions for patterns, procedural textures, and so on.
