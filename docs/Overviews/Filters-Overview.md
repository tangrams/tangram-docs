Tangram is designed to work with vector tiles in a number of formats. Data sources are specified in the [`sources`](../Syntax-Reference/sources.md) block of Tangram's scene file. Once a datasource is specified, **filters** allow you to style different parts of your data in different ways.

The Tangram scene file filters data in two ways: with top-level **layer filters** and lower-level **feature filters**.

# Layer filters

Vector tiles typically contain top-level structures which can be thought of as "layers" – inside a GeoJSON file, these would be the _FeatureCollection_ objects. Inside a Tangram scene file, the [`layers`](../Syntax-Reference/layers.md) object allows you to split the data by layer, by matching against the layer name.

```yaml
layers:
    my-roads-layer:
        data:
            source: nextzen
            layer: roads
        draw: ...
```

Specifying `layer: roads` in the [`data`](../Syntax-Reference/layers.md#data) block matches this GeoJSON object:

```json
{"roads":
    {"type":"FeatureCollection","features":[
        {"geometry":"..."}
    ]}
}
```

## Layer name shortcut

If a `layer` filter is not specified, Tangram will attempt to use the _layer name_ as the filter. In this example, the layer name "roads" matches a layer in the data:

```yaml
layers:
    roads:
        data:
            source: nextzen
        draw: ...
```

# Feature filters

Once a top-level `layer` filter has been applied, feature-level [`filter`](../Syntax-Reference/layers.md#filter) objects can be defined to filter by feature properties, in order to further narrow down the data of interest and refine the styles applied to the data.

```yaml
layers:
    roads:
        data: { source: nextzen }

        highway:
            filter:
                kind: highway
            draw: ...
```

Here, a top-level layer named "roads" matches the "roads" layer in the "osm" data source. It has a `style` block, which will apply to all features in the "roads" layer unless it is overridden, functioning as a kind of "default" style.

Then, a _sublayer_ named "highway" is declared, with its own `filter` and `draw`. Its `draw` block will apply only to roads which match its `filter` – in this case, those with the property "kind", with a value of "highway".

## Inheritance

Higher-level filters continue to apply at lower levels, which means that higher-level `draw` parameters will be inherited by lower levels, unless the lower level explicitly changes the `draw` parameters.

Using sublayers and inheritance, you may specify increasingly specific filters and draw styles to account for as many special cases as you like.

# Matching

Each feature in a `layer` is first tested against each top-level `filter`, and if the feature's data matches the filter, that feature will be assigned any associated [`draw`](../Syntax-Reference/draw.md) styles, and passed on to any _sublayers_. If any _sublayer_ filters match the feature, that _sublayer_'s `draw` styles will overwrite any previously-assigned styling rules for those matching features, and so on down the chain of inheritance.

Feature filters can match any named feature property in the data, as well as a few special _reserved keywords_.

## Feature properties

Feature properties in a GeoJSON datasource are listed in a JSON member specifically named "properties":

```json
{
    "type": "Feature",
    "id": "248156318",
    "properties": {
        "kind": "commercial",
        "area": 12148,
        "height": 63.4000000
    }
```

Analogous property structures exist in other data formats such as TopoJSON and Mapbox Vector Tiles. Tangram makes these structures available to `filter` blocks by property name, and also to any JavaScript filter functions under the `feature` keyword.

The json feature above will match these two filters:

```yaml
filter:
    kind: commercial

filter: function() { return feature.kind == "commercial"; }
```

The simplest type of feature filter is a statement about one named property of a feature.

A filter can match an exact value:

```yaml
filter:
    kind: residential
```

any value in a list:

```yaml
filter:
    kind: [residential, commercial]
```

or a value in a numeric range:

```yaml
filter:
    area: { min: 100, max: 500 }
```

A Boolean value of "true" will pass a feature that contains the named property, ignoring the property's value. A value of "false" will pass a feature that does _not_ contain the named property:

```yaml
filter:
    kind: true
    area: false
```

To match a property whose value is a boolean, use the list syntax:

```yaml
filter:
    boolean_property: [true]
```

A feature filter can also evaluate one or more properties in a JavaScript function:

```yaml
filter:
    function() { return feature.area > 100000 }
```

For example, let's say we have a feature with a single property called "height":

```json
{ "type":"Feature", "properties":{ "height":200 } }
```

This feature will match these filters:

```yaml
filter: { height: 200 }
filter: { height: { max: 300 } }
filter: { height: true }
filter: { unicycle: false }
filter: function() { return feature.height >= 100; }
filter: function() { return true; }
```

and will not match these filters:

```yaml
filter: { height: 100 }
filter: { height: { min: 300 } }
filter: { height: false }
filter: { unicycle: true }
filter: function() { return feature.height <= 100; }
filter: function() { return false; }
```

## Keyword properties

The keyword `$geometry` matches the feature's geometry type, for cases when a FeatureCollection includes more than one type of kind of geometry. Valid geometry types are:

- `point`: matches `Point`, `MultiPoint`
- `line`: matches `LineString`, `MultiLineString`
- `polygon`: matches `Polygon`, `MultiPolygon`

```yaml
filter: { $geometry: polygon }                      # matches polygons only

filter: { $geometry: [point, line] }                # matches points and lines, but not polygons

filter: function() { return $geometry === 'line' }  # matches lines only
```

The keyword `$layer` matches the feature's layer name, for cases when a data layer includes more than one source layer. In the case below, a data layer is created from two source layers, which can then be separated again by layer for styling:

```yaml
labels:
    data: { source: nextzen, layer: [places, pois] }
    draw:
        ...
    pois-only:
        filter: { $layer: pois }            # matches features from the "pois" layer only
        draw:
            ...
```

The keyword `$zoom` matches the current zoom level of the map. It can be used with specific values, or with the `min` and `max` parameters.

```yaml
filter: { $zoom: 14 }                       # matches only zoom 14

filter: { $zoom: { min: 10 } }              # matches zooms 10 and up

filter: { $zoom: { min: 12, max: 15 } }     # matches zooms 12-14

filter: { $zoom: [8, 9] }                   # matches only zooms 8 and 9

filter: function() { return $zoom <= 10 }   # matches zooms 10 and below
```

## `label_placement`

The special `label_placement` property is given only to _point_ geometries created by setting `generate_label_centroids` on a non-tiled datasource to `true`. This option creates a new "centroid" _point_ feature in the geometric center of each polygon in the datasource. Then, with `label_placement` set to `true`, a single label may be drawn in the center of each polygonal feature, instead of one label per tile, which is the default behavior. To add these centroid _points_ to a datasource, add the `generate_label_centroids` property to its [source] block:

```yaml
sources:
    nextzen:
        type: TopoJSON
        url: https://your.data.com/example.topojson
        generate_label_centroids: true

layers:
    landuse:
        data: {source: nextzen}
        points:
            filter:
                label_placement: true
```

See [`generate_label_centroids`](../Syntax-Reference/sources.md#generate_label_centroids)

## Dot notation

Dot notation with `.` can be used to access nested feature properties, which may be encoded in a GeoJSON/TopoJSON source, or parsed from MVT stringified JSON properties. These properties can also be accessed through custom JS filter functions.

Given a feature property `a: { b: { c: 'test' } }`, this filter will match:
`filter: { a.b.c: test }`

Feature property names that include a `.` can be escaped with `\.`, e.g. a feature property named `'d.e.f': 'escaped'` will match with:
`filter: { d\.e\.f: escaped }`

These could be mixed, e.g. a property `{ 'a.b': { c: 'mixed' }` would match with:
`filter: { a\.b.c: mixed }`

## Filter functions

### Range functions

The filter functions `min` and `max` are equivalent to `>=` and `<` in a JavaScript function, and can be used in combination.

```yaml
filter:
    area: { max: 1000 } }      # matches areas below 1000 sq meters

filter:
    height: { min: 70 } }       # matches heights 70 and up

filter:
    $zoom: { min: 5, max: 10 }  # matches zooms 5-9
```

### Array functions

- `includes_any`: check if an array `a` contains one or more of the values `p`, `q`, `r`:

`filter: { a: { includes_any: [p, q, r] } }`

For example:

```yaml
filter:
    kind: { includes_any: [bus, rail, road] }
```

- `includes_all`: check if an array `a` contains the values `p`, `q`, AND `r`:

`filter: { a: { includes_all: [p, q, r] } }`

For example:
```yaml
filter:
    kind: { includes_any: [bus, rail, road] }
```


### `px2`

Range functions can also accept a special screen-space area unit called `px2`:

```yaml
filter: { area: { min: 500px2 } }
```

This example filters the feature's area property by the number of _square mercator meters_ that cover a 500 pixel screen area at the current zoom level. This means that the area property must be in square mercator meters, as the property provided by Mapzen vector tiles is.

As with other pixel-based values in the scene file, the `px2` units are expressed in _logical pixels_ (or "CSS pixels"), meaning they are interpreted at a pixel density of 1, and are automatically scaled up for higher density displays.

The `px2` unit syntax can be used to simplify more cumbersome per-zoom filters.

Note that a `px2` area filter can only be applied if the data source already contains a suitable area property – it does not need to be named area, as any property name can be specified in the filter, but it must already exist in the data source.

## Boolean functions

The following Boolean filter functions are also available:

- `not`
- `any`
- `all`
- `none` (a combination of `not` and `any`)

`not` takes a single filter object as its input:

```yaml
filter:
    not: { kind: restaurant }

filter:
    not: { kind: [bar, pub] }
```

`any`, `all`, and `none` take lists of filter objects:

```yaml
filter:
    all:
        - { kind: museum }
        - function() { return feature.area > 100000 }

filter:
    any:
        - { height: { min: 100 } }
        - { name: true }

filter:
    none:
        - { kind: cemetery }
        - { kind: graveyard }
        - { kind: aerodrome }
```

### Lists imply `any`, Mappings imply `all`

A _list_ of several filters is a shortcut for using the `any` function. These two filters are equivalent:

```yaml
filter: [ kind: minor_road, railway: true ]

filter:
    any:
        - kind: minor_road
        - railway: true
```

A _mapping_ of several filters is a shortcut for using the `all` function. These two filters are equivalent:

```yaml
filter: { kind: hamlet, $zoom: { min: 13 } }

filter:
    all:
        - kind: hamlet
        - $zoom: { min: 13 }
```

## Matching collisions

In some cases, filters at the same level may return overlapping results:

```yaml
roads:
    data: { source: nextzen }
    highway:
        filter: { kind: highway }
        draw: { lines: { color: red } }
    bridges:
        filter: { is_bridge: yes }
        draw: { lines: { color: blue } }
```

In this case, "highways" are colored red, and "bridges" are blue. However, if any feature is both a "highway" _and_ a "bridge", it will match twice. Because YAML maps are technically "orderless", there's no way to guarantee that one of these styles will consistently be shown over the other. The solution here is to restructure the styles so that each case matches explicitly:

```yaml
roads:
    highway:
        filter: { kind: highway }
        draw: { lines: { color: red } }
        highway-bridges:
            filter: { is_bridge: yes }
            draw: { lines: { color: blue } }
    other-bridges:
        filter: { is_bridge: yes, not: { kind: highway} }
        draw: { lines: { color: green } }
```
