The **scene file** is a [YAML](http://en.wikipedia.org/wiki/YAML) document which organizes all of the elements Tangram uses to draw a map. YAML is a data format similar in many ways to JSON, but it has some unique features which we thought made it more friendly and easy to use for our purposes. (See the [YAML](yaml.md) entry for more about those features.)

## Top-level Elements

There are a variety of top-level elements allowed in a scene file. Each defines the beginning of a _block_ named for the element.

####`scene`
Optional element. The `scene` block sets various scene-wide parameters.

See [scene](scene.md).

####`sources`
Required element. The `sources` block identifies datasources.

See [sources](sources.md).

####`styles`
Optional element. The `styles` block defines rendering styles, which are composed of [materials](materials.md) and [shaders](shaders.md).

See [Styles Overview](Styles-Overview.md) and [styles](styles.md).

####`layers`
Required element. The `layers` block divides the data into layers and assigns styling parameters.

See [Styles Overview](Styles-Overview.md), [layers](layers.md), and [styling rules](styling-rules.md).

####`cameras`
Optional element. The `cameras` block allows modifications to the view of the map.

See [Cameras Overview](Cameras-Overview.md) and [cameras](cameras.md).

####`lights`
Optional element. The `lights` block allows control of the lighting of the map.

See [Lights Overview](Lights-Overview.md) and [lights](lights.md).

####`textures`
Optional element. The `textures` block allows for advanced configuration of textures within [materials](materials.md).

See [Materials Overview](Materials-Overview.md) and [textures](textures.md).


## The basics
To create a map, the scene file requires only:

- a data source
- data interpretation rules (filters)
- styling rules

Here's a very simple scene file:

```yaml
sources:
    osm:
        type: GeoJSONTileSource
        url:  http://vector.mapzen.com/osm/all/{z}/{x}/{y}.json

layers:
    earth:
        data: { source: osm }
        style: { order: 0, color: green }
    water:
        data: { source: osm }
        style: { order: 1, color: blue }
```

In this example, all three elements are included – this will produce a (very simple) map!

## Examples
For more examples of scene files, check out our [demos](https://github.com/tangrams?query=demo) – ours are usually named `scene.yaml`.

For even more amazing examples, check out the [Tangram Sandbox](http://tangrams.github.io/tangram-sandbox/)!
