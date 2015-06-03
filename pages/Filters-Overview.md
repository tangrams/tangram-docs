Tangram is designed to work with vector tiles in a number of formats. Data sources are specified in the [`sources`](sources.md) block of Tangram's scene file. Once a datasource is specified, **filters** allow you to style different parts of your data in different ways.

The Tangram scene file filters data in two ways: with top-level **layer filters** and lower-level **feature filters**.

## Layer filters

Vector tiles typically contain top-level structures which can be thought of as "layers" – inside a GeoJSON file, these would be the _FeatureCollection_ objects. Inside a Tangram scene file, the [`layer`](layer.md) object allows you to split the data by layer, by matching against the layer name.

```yaml
layers:
    my-roads-layer:
        data:
            source: osm
            layer: roads
        style: ...
```

Specifying `layer: roads` in the [`data`](data.md) block matches this GeoJSON object:

```json
{"roads":
    {"type":"FeatureCollection","features":[
        {"geometry":"..."}
    ]}
}
```
If a `layer` filter is not specified, Tangram will attempt to use the _layer name_ as the filter. In this example, the layer name "roads" matches a layer in the data:

```yaml
layers:
    roads:
        data:
            source: osm
        style: ...
```

## Feature filters

Once a top-level filter has been applied, feature-level filters can be applied to further narrow down the data of interest:

```yaml
layers:
    roads:
        data:
            source: osm
            layer: roads
        filter:
            kind: highway
        style: ...
```

Specifying a filter at this level means that within the "roads" layer, only features with a property named "kind" that has value "highway" will pass through to the styles and to any _sublayers_.

Feature filters can match any named feature property in the data, as well as a few special _reserved keywords_.

#### Feature properties

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
Analogous property structures exist in other data formats such as TopoJSON and Mapbox Vector Tiles.

## Matching

Every filter is a proposition: "This statement is true". Each feature is tested against each top-level filter, and if the feature's data doesn't contradict the filter, that feature will be drawn in any associated [`draw`](draw.md) styles, and passed on to any _sublayers_.

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
    bridge: [true]
```
A feature filter can also evaluate one or more properties in a JavaScript function:
```yaml
filter:
    function() { return feature.area > 100000 }
```

#### Keyword properties

The keyword `$zoom` matches the current zoom level. It can be used with the `min` and `max` functions.

```yaml
filter: { $zoom: 14 }

filter: { $zoom: { min: 10 } }

filter:
    $zoom: { min: 12, max: 15 }
```

The keyword `$geometry` matches the feature's geometry type, for cases when a FeatureCollection includes more than one type of kind of geometry.

```yaml
filter: { $geometry: point }

filter: { $geometry: polygon }
```

#### filter functions

- 
The following Boolean filter functions combine one or more feature filters into a new feature filter:

- `not`
- `any`
- `all`
- `none` (a combination of `not` and `any`)

`not` takes a single filter object as its input and `any`, `all`, and `none` take lists of filter objects, as in the examples here:

```yaml
filter: { not: { kind: restaurant } }

filter:
    not: { kind: [bar, pub] }

filter:
    all:
        - { kind: museum }
        - function() { return feature.area > 100000 }

filter:
    any:
        - { height: { min: 100 } }
        - { name: true }
```

#### Lists imply `any`, Objects imply `all`

A _list_ of several filters is a shortcut for using the `any` function. These two filters are equivalent:

```yaml
filter: [kind: minor_road, railway: true]

filter:
    any:
        - kind: minor_road
        - railway: true
```

An _object_ of several filters is a shortcut for using the `all` function. These two filters are equivalent:

```yaml
filter: { kind: hamlet, $zoom: { min: 13 } }

filter:
    all:
        - kind: hamlet
        - $zoom: { min: 13 }
```

#### Sublayer filters

Feature filters can also be applied to a sublayer:

```yaml
layers:
    roads:
        data: { source: osm }
        style: ...
        highway:
            filter:
                kind: highway
            style: ...
```

Here, a sublayer named `highway` is declared, with its own `filter` and `style`. With this setup, the first `style` block will apply to all features in the "roads" layer, functioning as a kind of "default" style. The second, nested `style` block will apply only to roads which match `kind: highway`.

#### Inheritance

Because higher-level filters continue to apply at lower levels, higher-level styles will be inherited by lower levels, unless the lower level explicitly overrides it.

Using sublayers and inheritance, you may specify increasingly specific filters and styles to account for as many special cases as you like.

#### Matching collisions

In some cases, filters at the same level may return overlapping results:

```yaml
roads:
    data: { source: osm }
    highway:
        filter: { kind: highway }
        style: { color: red }
    bridges:
        filter: { kind: bridge }
        style: { color: blue }
```

In this case, "highways" are colored red, and "bridges" are blue. However, if any feature is both a "highway" *and* a "bridge", it will match twice. Because YAML lists are technically "orderless", there's no way to guarantee that one of these styles will consistently be shown over the other. The solution here is to restructure the styles so that each case matches explicitly:

```yaml
roads:
    highway:
        filter: { kind: highway }
        style: { color: red }
        highway-bridges:
            filter: { kind: bridge }
            style: { color: blue }
    other-bridges:
        filter: { kind: bridge, not: { kind: highway} }
        style: { color: green }
```


#### Examples

Consider a feature with a single property called "height":

```json
{ "type":"Feature", "properties":{ "height":200 } }
```

This feature will pass these filters:

```yaml
filter: { height: 200 }
filter: { height: { max: 300 } }
filter: { height: true }
filter: { unicycle: false }
filter: function() { return feature.height >= 100; }
filter: function() { return true; }
```

and will not pass these filters:

```yaml
filter: { height: 100 }
filter: { height: { min: 300 } }
filter: { height: false }
filter: { unicycle: true }
filter: function() { return feature.height <= 100; }
filter: function() { return false; }
```
