Tangram allows raster data sources to be loaded, displayed, and combined with vector data sources in a variety of ways, including with real-time image manipulation.

## Basic Raster Display

The simplest way to use raster data is to display it directly, without any combinations or modifications. This is done by specifying a [`source`](sources.md) of type `raster`, either tiled or untiled. A source `url` which includes the `{x}/{y}/{z}` url token pattern. Sources without this pattern will be treated as untiled.

The example below loads a tiled raster data source:

```yaml
sources:
    stamen-terrain:
        type: Raster
        url: http://a.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg
```

Then it is rendered with the built-in [`raster` style](../Syntax-Reference/styles.md#raster), which is provided for typical rendering cases. This style generates tile-sized geometry and textures it with the appropriate raster data.

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

The `raster` style can also be applied to a non-`Raster` source that has a raster sampler attached, using the [`rasters`](../Syntax-Reference/sources.md#rasters) parameter. In this case, the Stamen terrain is attached to and masked against the OSM landuse polygons:

```yaml
sources:
    stamen-terrain:
        type: Raster
        url: http://a.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg
    mapzen-osm:
        type: TopoJSON
        url: https://tile.nextzen.org/tilezen/vector/v1/256/all/{z}/{x}/{y}.topojson
        rasters: [stamen-terrain] # attach stamen terrain

layers:
   terrain:
       data: { source: nextzen-osm, layer: landuse } # render landuse layer from vector data source
       draw:
           raster:
               order: 0 # draw on bottom
```

![Raster terrain data with vector mask](https://cloud.githubusercontent.com/assets/16733/14157713/52108590-f69a-11e5-8553-361a7893e257.png)

This technique can be used for combining shaded relief with landcover classifications. For example, here is a base raster terrain layer in gray, with vector landuse polygons tinted green:

![Raster terrain data with tinted landuse polygons](https://cloud.githubusercontent.com/assets/16733/14213503/4b24aa5a-f806-11e5-8bbc-ba3d61f33bed.png)

## High-Resolution Tile Support

### Multiple-Resolution Sources

Some raster tile sources support multiple resolutions for better quality on high-density displays, following the `@2x` file naming convention for web and mobile assets. This is supported by Tangram raster data sources with the `{r}` URL template token, as shown below:

`https://tiles.maps.com/{z}/{x}/{y}{r}.png`

The most common case is a source that supports 1x and 2x tiles, and this is the default configuration. However, other resolutions are also possible. Multiple resolutions can be supported with the [`url_density_scales`](sources.md#url_density_scales) parameter. For example, Wikimedia maps has several resolutions, which can be rendered in Tangram with:

```yaml
sources:
  raster:
    type: Raster
    url: https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png
    url_density_scales: [1, 1.3, 1.5, 2, 2.6, 3]
```

The default value for url_density_scales is [1, 2], meaning it will load either "plain" tile URLs like tile.png, or tile@2x.png tiles on displays with a display density >= 2.

### Downsampling

In some circumstances, the default tiles for a source may be either too large (in file size) or too detailed (in feature density or coordinate precision) than needed for the current application. The [`zoom_offset`](sources.md#zoom_offset) parameter allows the user to request lower zooms for each zoom level, reducing tile size and visual detail. (`zoom_offset` also works for vector data!)

## Untiled Raster Sources

Untiled raster image data may also be loaded, by specifying a single image file in the source's `url` parameter, as well as a bounding box in the `bounds` parameter:

```yaml
sources:
  chelan:
    type: Raster # can now indicate either tiled or un-tiled image source
    url: images/chelan.jpg # no tile XYZ pattern in URL indicates standalone image
    bounds: [-120.588, 47.467, -119.904, 48.033] # geo-extent of the image
```

This example shows a USGS historical map from the Chelan, WA area, overlaid on top of the Mapzen Walkabout base map:

![Raster map positioned over vector data](https://user-images.githubusercontent.com/16733/51869261-0ae0b380-231e-11e9-9fd5-55ec4120a9fc.png)

Three additional parameters exist for fine-tuning raster behavior:

- [`composite`](sources.md#rasters-composite) allows multiple images to be combined into a single data source;
- [`alpha`](sources.md#rasters-alpha) sets an alpha value for the entire data source;
- [`max-display-density`](sources.md#rasters-max-display-density) allows a cap to be set on oversampling, to limit texture memory use.

## Custom Styles

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

### Advanced Raster Styles

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
        url: https://tile.nextzen.org/tilezen/terrain/v1/normal/{z}/{x}/{y}.png

    mapzen-osm:
        type: TopoJSON
        url: https://tile.nextzen.org/tilezen/vector/v1/256/all/{z}/{x}/{y}.topojson
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
        data: { source: nextzen-osm }
        draw:
            normals:
                color: white
                order: 0
```

![tangram-wed mar 30 2016 21-39-44 gmt-0400 edt](https://cloud.githubusercontent.com/assets/16733/14163150/7bff64d6-f6c0-11e5-9c22-555d8075b8dd.png)

### Direct Sampler Access

When a style declares `raster: custom`, any shaders defined in that style can directly sample the raster for custom effects.

This example uses the [`sampleRaster()`](../Syntax-Reference/styles.md#raster) method to unpack Mapzen elevation tiles for color display:

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
