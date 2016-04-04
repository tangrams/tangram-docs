*This is the technical documentation for the "layers" block in Tangram's scene file. For a conceptual overview of the way Tangram applies styles to data, see the [Filters Overview](Filters-Overview.md) and the [Styles Overview](Styles-Overview.md).*

####`layers`
The `layers` element is a required top-level element in the [scene file](scene-file.md). It has only one kind of sub-element: a *layer name*, which defines individual layers with a layer filter.

```yaml
layers:
    earth:
        ...
```

### layer name
Required _string_. Can be anything. No default.

```yaml
layers:
    landuse:
        ...
```
## layer parameters

####`data`
Required parameter. Defines the beginning of a [data block](#data-parameters). Usable by top-level layers only. No default.
```yaml
layers:
    landuse:
        data: { source: osm }
```

####`filter`
Optional _object_ or _function_. No default.

A `filter` element may be included once in any layer or sublayer. Only features matching the filter will be included in that layer (and its sublayers). For more on the filtering system, see [Filters Overview](Filters-Overview.md).

```yaml
layers:
    roads:
        data: { source: osm }
        filter: { kind: highway }
```

####`visible`
Optional _Boolean_. Allows layer to be turned off and on. Default is `true`.

```yaml
layers:
    landuse:
        data: { source: osm }
        visible: false
```

####`draw`
Required parameter. Defines the beginning of a [draw block](#draw-parameters). For draw parameters, see the [draw](draw.md) entry.
```yaml
layers:
    landuse:
        data: { source: osm }
        draw:
            ...
```

####sublayer name
Optional _string_. Can be anything except the other sublayer parameters: "draw", "filter", and "properties". No default.

Defines a _sublayer_. Sublayers can have all `layer` parameters except `data`, and can be nested.

All parameters not explicitly defined in a sublayer will be inherited from the parent layer, including `draw`, `properties`, and `filter` definitions. Note that `filter` objects in different sublayers may match simultaneously – see the [Filters Overview](Filters-Overview.md).

```yaml
layers:
    landuse:
        data: { source: osm }
        filter: ...
        draw: ...
        sublayer:
            filter: ...
            draw: ...
        sublayer2:
            filter: ...
            draw: ...
            subsublayer:
                filter: ...
                draw: ...
```

## `data` parameters

####`source`
Required _string_, naming one of the sources defined in the [sources](sources.md) block.

```yaml
data:
    source: osm
```

####`layer`
Optional _string_ or _[strings]_, naming a top-level named object in the source datalayer. In GeoJSON, this is a _FeatureCollection_. If a `layer` is not specified, the _layer name_ will be used.
```yaml
data:
    source: osm
    layer: buildings
```

The above `layer` refers to the below object:
```json
{"buildings":
    {"type":"FeatureCollection","features":[
        {"geometry":"..."}
    ]}
}
```

Because the _layer name_ is the same as the name of the GeoJSON object, the `data` object's `layer` parameter can be omitted. Most of our examples, use this form.
```yaml
layer:
    buildings:
        data: { source: osm }
```

When an array of layer names may is used as the value of the `layer` parameter, the corresponding data layers will be combined client-side. This allows easy styling of multiple layers at once:

```yaml
layer:
    labels:
        data: { source: osm, layer: [buildings, pois] }
        filter: { name: true }
        draw:
            text:
                ...
```
The above example combines the "buildings" and "pois" layers into a new layer called "labels", for drawing with the `text` _draw style_.

## `draw` parameters

See the [draw](draw.md) entry.
