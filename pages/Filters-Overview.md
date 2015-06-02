Tangram is designed to work with vector tiles in a number of formats. Data sources are specified in the `sources` block of Tangram's scene file. Once a datasource is specified, **filters** allow you to style different parts of your data in different ways.

The Tangram scene file uses filters in two ways: as top-level **layer filters** and lower-level **feature filters**.

## Layer filters

Vector tiles typically contain top-level structures which can be thought of as "layers" – inside a GeoJSON file, these would be the _FeatureCollection_ objects. Tangram's top-level filter allows you to split the data by layer, by matching against the layer name:

```yaml
layers:
    roads:
        data:
            source: osm
            layer: roads
        style: ...
```

Specifying `layer: roads` in the `data` block matches this GeoJSON object:

```json
{"roads":
    {"type":"FeatureCollection","features":[
        {"geometry":"..."}
    ]}
}
```
If a `layer` filter is not specified, Tangram will attempt to use the _layer name_ as the filter. In this case, the layer name "roads" will match, so the `filter` line can be omitted:

```yaml
layers:
    roads:
        data:
            source: osm
        style: ...
```

Now all styles in the "roads" layer will apply only to data matching the filter.

## Feature filters

Once a top-level filter has been applied, feature-level filters can be applied, to further narrow down the data of interest:

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

Specifying a filter at this level means that within the "roads" layer, only features with the property "kind" and value "highway" will pass through to the styles.

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

Feature filters can match any of these named properties, either exactly or with conditions returned by a function:

```yaml
filter:
    kind: residential
```

```yaml
filter:
    function() { return feature.area > 100000 }
```

## Truth

Every filter is a proposition: "This statement is true". Each feature is tested against each top-level filter, and if the feature's data doesn't contradict the filter, that feature will be drawn in any associated [[draw]] styles, and passed on to any _sublayers_.

for example, assume we have a piece of data, in the form of a feature with a single property called "height":

```json
{ "type":"Feature", "properties":{ "height":200 } }
```

This feature will match these filters:

``yaml
filter: { height: 200 }
filter: { height: { max: 300 } }
filter: { not: { height: 100 } }
filter: { height: true }
filter: { unicycle: false }
filter: function() { return feature.height >= 100; }
filter: function() { return true; }
```

And will not match these filters:

``yaml
filter: { height: 100 }
filter: { height: { min: 300 } }
filter: { not: { height: 200 } }
filter: { height: false }
filter: { unicycle: true }
filter: function() { return feature.height <= 100; }
filter: function() { return false; }
```

#### Booleans

Note that in the above examples, the values `true` and `false` are used to test for the existence of a property. To test for literal Boolean values, use either list syntax or a JavaScript function:

```yaml
# list syntax
filter: { unicycle: [true] }

# JavaScript function
filter: function() { return feature.unicycle === true; }
```

## Filter functions

We support a number of named filter functions: 

- `min`
- `max`
- `not`
- `any`
- `all`
- `none` (a combination of `not` and `any`)

These functions expect a few types of inputs: `min` and `max` expect plain values, `not` expects an _object_, and `any`, `all`, and `none` expect lists of _objects_. (A _function_ counts as an _object_ in these cases.)

```yaml
filter:
    height: { min: 20 }

filter:
    area: { max: 10000 }

filter:
    area: { min: 100, max: 10000 }

filter: { not: { kind: restaurant } }

filter:
    not: { kind: [bar, pub] }

filter:
    all:
        - { kind: museum }
        - function() { return feature.area > 100000 }

filter:
    any:
        - { $zoom: { min: 10 }, area: { min: 10000000 } }
        - { $zoom: { min: 12 }, area: { min: 1000000 } }
        - { $zoom: { min: 15 }, area: { min: 10000 } }
        - { $zoom: { min: 17 } }
```

#### Lists imply `any`, Objects imply `all`

Matching against a _list_ implies `any`. These two filters are equivalent:

```yaml
filter: { kind: [park, forest, cemetery] }

filter:
    any:
        - kind: park
        - kind: forest
        - kind: cemetery
```

Matching against an _object_ implies all. These two filters are equivalent:

```yaml
filter: { kind: hamlet, $zoom: { min: 13 } }

filter:
    all:
        - kind: hamlet
        - $zoom: { min: 13 }
```

#### `$zoom`
The keyword `$zoom` matches the current zoom level.

```yaml
filter: { $zoom: { min: 10 } }

filter:
    $zoom: { min: 12, max: 15 }
```

#### `$geometry`
The keyword `$geometry` matches the feature's geometry type, for cases when a featureCollection includes more than one type of kind of geometry.

```yaml
filter: { $geometry: point }

filter: { $geometry: polygon }
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

Using sublayers and inheritance, you may specify increasingly-specific filters and styles to account for as many special cases as you like.

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

With this style, if any section of road is both a "highway" and a "bridge", it will match twice. Because YAML lists are technically "orderless", there's no way to guarantee that one of these styles will consistently be shown over the other. The solution here is to restructure the styles so that each case matches explicitly:

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