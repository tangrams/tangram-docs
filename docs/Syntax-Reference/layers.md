*This is the technical documentation for the "layers" block in Tangram's scene file. For a conceptual overview of the way Tangram applies styles to data, see the [Filters Overview](../Overviews/Filters-Overview.md) and the [Styles Overview](../Overviews/Styles-Overview.md).*

#### `layers`
The `layers` element is a required top-level element in the [scene file](../Overviews/Scene-File.md). It has only one kind of sub-element: a *layer name*, which defines individual layers with a layer filter.

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

Note: If a `layer` filter is not specified in a `data` parameter, Tangram will attempt to use the _layer name_ as the filter. See [Layer Name Shortcut](../Overviews/Filters-Overview.md#layer-name-shortcut).

## layer parameters

#### `data`
Required parameter. Defines the beginning of a [data block](#data-parameters). Usable by top-level layers only. No default.
```yaml
layers:
    landuse:
        data: { source: osm }
```


#### `draw`
Required parameter. Defines the beginning of a [draw block](#draw-parameters). For draw parameters, see the [draw](draw.md) entry.
```yaml
layers:
    landuse:
        data: { source: osm }
        draw:
            ...
```

#### `enabled`
Optional _Boolean_. Allows layer to be turned off and on. Default is `true`.

```yaml
layers:
    landuse:
        data: { source: osm }
        enabled: false
```

Unlike the `draw`-level [`visible`](draw.md#visible) parameter, once set, the `enabled` parameter _cannot_ be overridden by any descendant layers. This is useful for culling large portions of the layer tree, e.g. for layer-toggle controls and/or overlays.

[This parameter was renamed from `visible` to avoid confusion with the `draw`-level `visible` parameter. Layer-level `visible` parameters are be supported through v0.12, but are deprecated in later releases.]

#### `exclusive`
Optional _boolean_. Ensures that no other sublayers at the same level will match the same features contained in the current sublayer. No default.

```yaml
layers:
  layerA:
    filter: { kind: building }
    exclusive: true
  layerB:
    filter: { name: "tower" } # no features of "kind: building" will match here.
```

#### `filter`
Optional _object_ or _function_. No default.

A `filter` element may be included once in any layer or sublayer. Only features matching the filter will be included in that layer (and its sublayers). For more on the filtering system, see [Filters Overview](../Overviews/Filters-Overview.md).

```yaml
layers:
    roads:
        data: { source: osm }
        filter: { kind: highway }
```

#### `priority`
Optional _integer_. Controls the order in which sub-layers at the same level are matched, and which one "wins" when multiple matching layers are merged.

When used with [`exclusive`](#exclusive), if/else filter patterns can be expressed:
```yaml
layers:
    layerA:             # if matches layerA...
        filter: ...
        priority: 1
        exclusive: true
        draw: ...
    layerB:             # else if matches layerB...
        filter: ...
        priority: 2
        exclusive: true
        draw: ...
```

#### sublayer name
Optional _string_. Can be anything except the other sublayer parameters: "draw", "filter", and "properties". No default.

Defines a _sublayer_. Sublayers can have all `layer` parameters except `data`, and can be nested.

All parameters not explicitly defined in a sublayer will be inherited from the parent layer, including `draw`, `properties`, and `filter` definitions. Note that `filter` objects in different sublayers may match simultaneously – see the [Filters Overview](../Overviews/Filters-Overview.md).

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

#### `all_layers`
Optional _boolean_. Matches all layers in the data source. Useful for source introspection, without knowing or needing to specify all the layers in the data source by name.

```yaml
data:
    source: newsource
    all_layers: true
```

#### `layer`
Optional _string_ or _[strings]_, naming a top-level named object in the source datalayer. In GeoJSON, this is a _FeatureCollection_. If a `layer` is not specified, the _layer name_ will be used.
```yaml
layers:
	buildings:
		data:
		    source: osm
		    layer: buildings
```

Many of our examples use [_flow syntax_](yaml.md#flow-syntax) for `data` blocks:
```yaml
layers:
	buildings:
		data: {source: osm, layer: buildings}
```

The specified "buildings" `layer` will match this named object in the "osm" datasource:
```json
{"buildings":
    {"type":"FeatureCollection","features":[
        {"geometry":"..."}
    ]}
}
```

Because the _layer name_ "buildings" is the same as the name of the desired GeoJSON object, the `data` object's `layer` parameter can be omitted; when no `layer` is specified, Tangram will attempt to use the _layer name_ as the _data layer_. Most of our examples use this [layer name shortcut](../Overviews/Filters-Overview.md#layer-name-shortcut).
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

#### `source`
Required _string_, naming one of the sources defined in the [sources](sources.md) block.

```yaml
data:
    source: osm
```

## `draw` parameters

See the [draw](draw.md) entry.
