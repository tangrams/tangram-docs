*This is the technical documentation for Tangram's `textures` block. For the JS-only draw-level parameter, see [`texture`](draw.md#texture). For an overview of the ways textures can be used by Tangram, see the [Materials Overview](../Overviews/Materials-Overview.md).*

## `textures`
The `textures` element is an optional top-level element in the [scene file](../Overviews/Scene-File.md). It has only one kind of sub-element: a named _texture object_.

```yaml
textures:
    pois:
        url: demos/images/marker.png
    brick:
        url: demos/images/brick.jpg
```

When a texture is defined in the top-level `textures` element, it is declared with a _texture name_ which allows it to be referenced by name in other `texture` parameters, including in `styles` and `materials` definitions:

```yaml
# here we define and name the texture
textures:
    pois:
        url: images/poi_icons_18@2x.png

# here we reference the above texture
styles:
    pois-style:
        base: points
        texture: pois
```

Outside of the `textures` element, a new texture may be defined inline by providing a URL instead of a texture name:
```yaml
# defining a new texture inline
styles:
    rock:
        base: polygons
        material:
            normal:
                texture: images/rock.jpg
                mapping: uv
```
These textures will use the default [parameters](#texture-parameters) described below. To use custom parameters for a texture, you must declare it in the `textures` element.

If a texture is provided for a _lines_ style, the texture is repeated across the line, with the width of the texture matching the width of the line, and the texture y coordinate scaled to match the aspect ratio of the image (its height over its width).

#### draw group texture parameter

Textures may also be assigned, re-assigned, or un-assigned per _draw group_ with Tangram-JS only – see [`texture`](draw.md#texture).

## texture parameters

#### `url`
Optional _string_, though either `url` or [`element`](#element) is required ([JS-only](https://github.com/tangrams/tangram). This element is required for [ES](https://github.com/tangrams/tangram-es)). Specifies the path to a texture source file. No default.

URLs can be absolute or relative.

```yaml
textures:
    ghost:
        url: demos/images/ghost.png
```

```yaml
textures:
    ghost:
        url: http://ghostimages.com/ghost.png
```

#### `density`
Optional _number_. Default is `1`.

Indicates the intended native pixel density of the texture, to allow the texture to be drawn correctly at various display densities. The number is effectively used as a devisor when calculating display pixels.

This is specifically useful when style rules don't explicitly define the size of a sprite.

```yaml
textures:
    pois:
        url: pois.png
        density: 2 # authored at 2x resolution
        sprites:
            # define sprites: [x origin, y origin, width, height]
            airport: [0, 0, 64, 64]
            ...
```

In the example above, the sprite will be drawn as a 32-pixel square.

#### `element`
[[JS-only](https://github.com/tangrams/tangram)] Optional _string_, though either [`url`](#url) or `element` is required. Specifies a CSS element selector string. No default.

This parameter allows an HTML element to be used as the source of the texture, as identified by a CSS selector string.

For example, this canvas element:

`<canvas class='awesome-texture'>`

Can be referenced as:

```yaml
textures:
    awesome-texture:
        element: .awesome-texture
```

You can also reference an element by `id`, but the use of `#` in CSS means the YAML must be quoted so it's not interpreted as a YAML comment:

`<canvas id='texture-id'>`

```yaml
textures:
    awesome-texture:
        element: '#texture-id' # no comment!
```

#### `filtering`
Optional _string_, one of `linear`, `nearest`, or `mipmap`. Defaults to `linear`.

Sets the filtering mode for the texture, which determines quality at various zoom levels.

```yaml
textures:
    ghost:
        url: demos/images/ghost.png
        filtering: mipmap
```

#### `sprites`
Optional parameter. Defines the start of a `sprites` block.

`sprites` take only one kind of parameter: the _sprite name_. Any number of sprites may be defined.

For using sprites in _draw styles_, see [`sprite`](draw.md#sprite).

#### sprite name
Required _string_. Can be anything. No default.

Defines an area of a texture to be used as an individual sprite, as _[x origin, y origin, width, height]_ in pixels.

```yaml
textures:
    pois:
        url: demos/images/poi_icons_32.png
        filtering: mipmap
        sprites:
            airport: [0, 0, 32, 32]
            restaurant: [0, 777, 32, 32]
            cafe: [0, 814, 32, 32]
            museum: [0, 518, 32, 32]
```

For using sprites in _draw styles_, see [`sprite`](draw.md#sprite).
