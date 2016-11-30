Tangram allows raster data sources to be loaded, displayed, and combined with vector data sources in a variety of ways, including with real-time image manipulation.

## Basic Raster Display

The simplest way to use raster data is to display it directly, without any combinations or modifications.

The example below loads a tiled raster data source in the scene file, under the [`sources`](sources.md) block:

```yaml
sources:
    stamen-terrain:
        type: Raster
        url: http://a.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg
```

Then it is rendered with the built-in [`raster` style](styles.md#raster), which is provided for typical rendering cases. This style generates tile-sized geometry and textures it with the appropriate raster data.

```yaml
layers:
    terrain:
        data: { source: stamen-terrain }
        draw:
            raster:
                order: 0 # draw on bottom
```

This allows the raster layer to be used as a basemap, with other vector data drawn on top.

![tangram-wed mar 30 2016 16-51-48 gmt-0400 edt](https://cloud.githubusercontent.com/assets/16733/14157176/e57c96dc-f697-11e5-9c6d-c1a47f8e4d1d.png)

## Tinting

The `raster` style can take a `color` parameter, which will be multiplied by the raster's color as a tint. This parameter's value defaults to "white" and accepts all standard `color` values including JavaScript functions.

This example darkens the underlying tiles by 50%:

```yaml
layers:
    terrain:
        data: { source: stamen-terrain }
        draw:
            raster:
                color: [0.5, 0.5, 0.5]
                order: 0 # draw on bottom
```

![tangram-wed mar 30 2016 16-56-31 gmt-0400 edt](https://cloud.githubusercontent.com/assets/16733/14157295/64e6683a-f698-11e5-9171-75adc131243f.png)

### Geometry Masking

The `raster` style can also be applied to a non-`Raster` source that has a raster sampler attached, using the [`rasters`](sources.md#rasters) parameter. In this case, the Stamen terrain is attached to and masked against the OSM landuse polygons:

```yaml
sources:
    stamen-terrain:
        type: Raster
        url: http://a.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg
    mapzen-osm:
        type: TopoJSON
        url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.topojson
        rasters: [stamen-terrain] # attach stamen terrain

layers:
   terrain:
       data: { source: mapzen-osm, layer: landuse } # render landuse layer from vector data source
       draw:
           raster:
               order: 0 # draw on bottom
```

![tangram-wed mar 30 2016 17-07-48 gmt-0400 edt](https://cloud.githubusercontent.com/assets/16733/14157713/52108590-f69a-11e5-8553-361a7893e257.png)

This technique can be used for combining shaded relief with landcover classifications. For example, here is a base terrain layer in gray, with landuse polygons tinted green:

![tangram-fri apr 01 2016 12-35-12 gmt-0400 edt](https://cloud.githubusercontent.com/assets/16733/14213503/4b24aa5a-f806-11e5-8bbc-ba3d61f33bed.png)

### Custom Styles

The `raster` style is derived from the `polygons` rendering style, and provides the same shader blocks. This allows for custom raster styles to be defined with `base: raster`. For example, this style converts raster tiles to grayscale:

```yaml
sources:
    stamen-terrain:
        type: Raster
        url: http://a.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg

styles:
    grayscale:
        base: raster
        shaders:
            blocks:
                filter: |
                    # get luminance of rgb value
                    float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                    color.rgb = vec3(luma);

layers:
    terrain:
        data: { source: stamen-terrain }
        draw:
            grayscale:
                order: 0
```



![tangram-wed mar 30 2016 16-59-03 gmt-0400 edt](https://cloud.githubusercontent.com/assets/16733/14157381/b90ec916-f698-11e5-8697-5e99a66faf23.png)

## Advanced Raster Styles

Styles can enable raster samplers with the `raster` parameter, which can have the following values:

- `color`: Applies the value of the raster texture as the `color` in the fragment shader. This is the most common case, and is set as the default by the `raster` rendering style.
- `normal`: To support terrain shading, there is also built-in support for applying a raster source as a normal map.
- `custom`: This value is for cases where you want access to raster samplers, but the data is not formatted for direct use as a color or normal. Mapzen's RGB-packed elevation tiles are an example; the raw data must be decoded and re-interpreted for usable results, and is not intended for display.

### Normal Maps

This example loads pre-computed "normal" tiles as a normal map, which can be lit by standard Tangram lights:

```yaml
sources:
    terrain-normals:
        type: Raster
        url: https://tile.mapzen.com/mapzen/terrain/v1/normal/{z}/{x}/{y}.png

    mapzen-osm:
        type: TopoJSON
        url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.topojson
        rasters: [terrain-normals]

styles:
    normals:
        base: polygons
        raster: normal

lights:
    point1:
        type: point

layers:
    earth:
        data: { source: mapzen-osm }
        draw:
            normals:
                color: white
                order: 0
```

![tangram-wed mar 30 2016 21-39-44 gmt-0400 edt](https://cloud.githubusercontent.com/assets/16733/14163150/7bff64d6-f6c0-11e5-9c22-555d8075b8dd.png)

###Direct Sampler Access

When a style declares `raster: custom`, any shaders defined in that style can directly sample the raster for custom effects.

This example uses the [`sampleRaster()`](styles.md#raster) method to unpack Mapzen elevation tiles for color display:

```yaml
styles:
    elevation:
        base: polygons
        raster: custom
        shaders:
            blocks:
                global: |
                    // Unpack RGB elevation
                    float unpack(vec4 h) {
                        return (h.r * 1. + h.g / 256. + h.b / 65536.);
                    }
                color: |
                    color.rgb = vec3(unpack(sampleRaster(0)));
                    color.rgb = (color.rgb - .5) * 20.; // re-scale to a visible range for contrast
```

![tangram-wed mar 30 2016 21-59-05 gmt-0400 edt](https://cloud.githubusercontent.com/assets/16733/14163364/a9429a10-f6c2-11e5-81c7-c0561e5919be.png)

### Multiple Raster Samplers

This example shows the use of two raster samplers in the same rendering style. First, sources are defined for Stamen's Watercolor and Toner tiles. To make them both available in the same rendering `style`, the watercolor source is attached as the second sampler for the toner source.

A simple `style` that does a 50/50 blend of the two samplers is then defined. Finally, the toner source is drawn with the blend style.

```yaml
sources:
    stamen-watercolor:
        type: Raster
        url: http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg
    stamen-toner:
        type: Raster
        url: http://tile.stamen.com/toner/{z}/{x}/{y}.png
        rasters: [stamen-watercolor] # add watercolor sampler alongside toner

styles:
    # blend two raster samplers together
    blend-rasters:
        base: polygons
        raster: color
        shaders:
            blocks:
                filter: |
                    color = (sampleRaster(0) + sampleRaster(1)) * 0.5;

layers:
    earth:
        data: { source: stamen-toner }
        draw:
            blend-rasters:
                order: 0
```

![tangram-wed mar 30 2016 17-20-15 gmt-0400 edt](https://cloud.githubusercontent.com/assets/16733/14158040/074abc0e-f69c-11e5-9cc5-a2852f24b46d.png)
