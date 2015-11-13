*This is the technical documentation for Tangram’s shader system. Shaders are a vast topic – if you are new to GLSL we recommend starting with our own Patricio Gonzalez Vivo’s [The Book of Shaders](http://patriciogonzalezvivo.com/2015/thebookofshaders/). For a technical reference, see the [OpenGL ES Shading Language reference card](https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf).*

Tangram's drawing engine is built using WebGL, which is a JavaScript API for controlling a web browser's OpenGL capabilities. OpenGL is itself an API, designed to allow direct control of a graphics card's output.

OpenGL operates by sending self-contained graphics programs called "shaders" to the graphics card. Shaders come in two flavors: "vertex shaders", which control the position of a 3D face's vertices, and "fragment shaders", which control the color of the pixels which fill in a 3D face.

Every system of 3D graphics which uses OpenGL, including Tangram, has both a vertex and a fragment shader.

Tangram's shading system has been designed so that its shaders may be modified by the scene file at certain stages in their construction, by "injecting" shader code which modifies the shaders on their way to the graphics card. These stages allow the construction of sophisticated shading and compositing techniques similar to those used in video games and film VFX.

## `shaders`

The `shaders` element is an optional element in a _style_. It defines the start of a _shader block_, which allows the definition of custom GPU code.

The `shaders` block has several optional elements:

- [`defines`](shaders.md#defines) - allows preprocessing switches to be set before shader compilation.
- [`uniforms`](shaders.md#uniforms) - a shortcut block for defining special shader variables called _uniforms_.
- [`blocks`](shaders.md#blocks) - allows direct injection of shader code.
- [`extensions`](shaders.md#extensions) - allows the shader to enable WebGL extensions.

```yaml
styles:
    water:
        shaders:
            defines:
                EFFECT_GRAY: true
            uniforms:
                u_color: [.5, .5, .5]
                u_speed: 2.5
            blocks:
                global: |
                    float getGrayscale(vec3 p) { return (p.r + p.g + p.b) / 3.0; }
                position: |
                    position.z *= (sin(position.z + u_time * u_speed) + 1.0);
                color: |
                    #ifdef EFFECT_GRAY
                        color.rgb = vec3(getGrayscale(u_color));
                    #endif
```

## `defines`
Optional parameter. Defines the start of a `defines` block.

“Defines” are GLSL preprocessor directives, similar to those found in C, which are injected into Tangram's shader code at compilation time. The `defines` block allows you to set and define custom statements, which are useful for changing the functionality of a shader without modifying the shader code directly.

```yaml
shaders:
    defines:
        EFFECT_NOISE_ANIMATED: true
```

In Tangram's shader code, that gets expanded to:

```glsl
#define EFFECT_NOISE_ANIMATED
```

In cases where non-boolean values are specified, eg:

```yaml
shaders:
    defines:
        EFFECT_NOISE_THRESHOLD: 100
```

This becomes:

```glsl
#define EFFECT_NOISE_THRESHOLD 100
```

These defines are then usable by other directives, such as conditional statements, inside a shader:

```glsl
#ifdef EFFECT_NOISE_ANIMATED
   ...
#endif

if (value > EFFECT_NOISE_THRESHOLD) {
   ...
}
```
### reserved defines
The following is a list of reserved defines used by the Tangram Engine:

```
TANGRAM_TEXTURE_COORDS
TANGRAM_FEATURE_SELECTION
TANGRAM_WORLD_POSITION_WRAP
TANGRAM_MATERIAL_EMISSION
TANGRAM_MATERIAL_EMISSION_TEXTURE
TANGRAM_MATERIAL_EMISSION_TEXTURE_UV
TANGRAM_MATERIAL_EMISSION_TEXTURE_PLANAR
TANGRAM_MATERIAL_EMISSION_TEXTURE_TRIPLANAR
TANGRAM_MATERIAL_EMISSION_TEXTURE_SPHEREMAP
TANGRAM_MATERIAL_AMBIENT
TANGRAM_MATERIAL_AMBIENT_TEXTURE
TANGRAM_MATERIAL_AMBIENT_TEXTURE_UV
TANGRAM_MATERIAL_AMBIENT_TEXTURE_PLANAR
TANGRAM_MATERIAL_AMBIENT_TEXTURE_TRIPLANAR
TANGRAM_MATERIAL_AMBIENT_TEXTURE_SPHEREMAP
TANGRAM_MATERIAL_DIFFUSE
TANGRAM_MATERIAL_DIFFUSE_TEXTURE
TANGRAM_MATERIAL_DIFFUSE_TEXTURE_UV
TANGRAM_MATERIAL_DIFFUSE_TEXTURE_PLANAR
TANGRAM_MATERIAL_DIFFUSE_TEXTURE_TRIPLANAR
TANGRAM_MATERIAL_DIFFUSE_TEXTURE_SPHEREMAP
TANGRAM_MATERIAL_SPECULAR
TANGRAM_MATERIAL_SPECULAR_TEXTURE
TANGRAM_MATERIAL_SPECULAR_TEXTURE_UV
TANGRAM_MATERIAL_SPECULAR_TEXTURE_PLANAR
TANGRAM_MATERIAL_SPECULAR_TEXTURE_TRIPLANAR
TANGRAM_MATERIAL_SPECULAR_TEXTURE_SPHEREMAP
TANGRAM_MATERIAL_NORMAL_TEXTURE
TANGRAM_MATERIAL_NORMAL_TEXTURE_UV
TANGRAM_MATERIAL_NORMAL_TEXTURE_PLANAR
TANGRAM_MATERIAL_NORMAL_TEXTURE_TRIPLANAR
TANGRAM_LIGHTING_VERTEX
TANGRAM_LIGHTING_FRAGMENT
TANGRAM_POINTLIGHT_ATTENUATION_EXPONENT
TANGRAM_POINTLIGHT_ATTENUATION_INNER_RADIUS
TANGRAM_POINTLIGHT_ATTENUATION_OUTER_RADIUS
TANGRAM_SPOTLIGHT_ATTENUATION_EXPONENT
TANGRAM_SPOTLIGHT_ATTENUATION_INNER_RADIUS
TANGRAM_SPOTLIGHT_ATTENUATION_OUTER_RADIUS
```

For more on defines, see [http://www.cprogramming.com/reference/preprocessor/define.html](http://www.cprogramming.com/reference/preprocessor/define.html).

## `uniforms`
Optional parameter. Defines the start of a `uniforms` block.

The `uniforms` block allows shortcuts for declaring globally-accessible _uniform_ variables, for use in the `global`, `position`, `normal`, `color` and `filter` blocks. Uniforms declared here may also be accessed and manipulated through the [JavaScript API](Javascript-API.md).

A "uniform" is a GLSL variable which is constant across all vertices and fragments (aka pixels).

Uniforms are declared as key-value pairs. Types are inferred by Tangram, and the corresponding uniform declarations are injected into the shaders automatically.

For example, float and vector uniform types can be added as follows:

```yaml
shaders:
    uniforms:
        u_speed: 2.5
        u_color: [.5, 1.5, 0]
```

The uniforms `u_speed` and `u_color` are injected into the shader as these types:

```yaml
float u_speed;
vec3 u_color;
```

And are then assigned the following values:

```yaml
u_speed = 2.5;
u_color = vec3(0.5, 1.5, 0.0);
```

See also: [built-in uniforms](shaders.md#built-in-uniforms) and [built-in varyings](shaders.md#built-in-varyings).

## `blocks`
Optional parameter. Defines the start of a `blocks` block.

The `block` element has six optional sub-elements. Each can contain shader code for manipulating a particluar part of the shading pipeline:

    * `global`: define global functions, usable by the other `block` elements
    * `position`: modify the position of a vertex
    * `width`: modify the width of a feature drawn with the `lines` draw style
    * `normal`: modify the normal of a face, per-pixel
    * `color`: modify the color of a pixel before lighting
    * `filter`: modify the color of a pixel after lighting

The _shader blocks_ can be defined in any order, but they will be injected in this order into the _vertex_ and/or _fragment_ shader before their compilation.

```yaml
shaders:
    blocks:
        global: …
        width: …
        position: …
        normal: …
        color: …
        filter: …
```

#### `global`
Optional parameter. Defines the start of a `global` block.

Defines uniforms and functions to be available globally (for both _fragment_ and _vertex_ shaders, to be used by the `position`, `normal`, `color` and `filter` blocks).

```yaml
shaders:
    blocks:
        global: |
            float getGrayscale(vec3 p) { return (p[0] + p[1] + p[2]) / 3.0; }
```

#### `position`
Optional element. Defines the start of a `position` block, written in GLSL, which is injected into the _vertex_ shader.

This block has access to the `position` variable, which contains the position of the current vertex, and takes the form `vec3(x, y, z)`.

```yaml
blocks:
    position: position.z *= (sin(position.z + u_time) + 1.0);
```

#### `width`
Optional element. Defines the start of a `width` block, written in GLSL, which is injected into the _vertex_ shader.

This block has access to the `width` variable for the `lines` draw style. `width` is a `float`.

```yaml
blocks:
    width: width *= (sin(u_time) + 1.0);
```

#### `normal`
Optional element. Defines the start of a `normal` block, written in GLSL, which is injected into the _fragment_ shader.

This block has access to the `normal` variable, which takes the form `vec3(x, y, z)`.

```yaml
blocks:
    normal: |
        normal += vec3(sin(u_time)*0.5,cos(u_time)*0.5,1.);
        normal = normalize(normal);
```

#### `color`
Optional element. Defines the start of a `color` block, written in GLSL, which is injected into the _fragment_ shader.

This block has access to the `color` variable, which takes the form `vec4(r, g, b, a)`. Lighting is applied after this `color` is set.

```yaml
blocks:
    color: color.rgb = vec3(1.0, .5, .5);
```

#### `filter`
Optional element. Defines the start of a `filter` block, written in GLSL, which is injected into the _fragment_ shader.

This block has access to the `color` variable after lighting has been applied – it takes the form `vec4(r, g, b, a)`. 

```yaml
blocks:
    filter: color.rgb = vec3(1.0, .5, .5);
```

## `extensions`
Optional parameter.

Styles can enable [WebGL extensions](https://www.khronos.org/registry/webgl/extensions/) with the `extensions` property. For example, this style uses the `OES_standard_derivatives` extension:

```yaml
styles:
    grid:
        base: polygons
        lighting: false
        shaders:
            extensions: OES_standard_derivatives
            blocks:
                color: |
                    // From: http://madebyevan.com/shaders/grid/
                    // Pick a coordinate to visualize in a grid
                    vec3 coord = worldPosition().xyz / 10.;
                    // Compute anti-aliased world-space grid lines
                    vec3 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
                    float line = min(min(grid.x, grid.y), grid.z);
                    // Just visualize the grid lines directly
                    color = vec4(vec3(1.0 - min(line, 1.0)), 1.0);
```
                    
`extensions` is either a single extension name, or a list of one or more requested extensions, e.g. for multiple extensions:

`extensions: [OES_standard_derivatives, EXT_frag_depth]`

For each available extension, a `#define` with the following form will be set: `TANGRAM_EXTENSION_${name}`, e.g.

`#define TANGRAM_EXTENSION_OES_standard_derivatives`

Setting `#define` flags for each extension allows shader authors to take advantage of extensions when they are available on the user's machine, while still writing fallback code to support machines that don't have these extensions. (If a fallback isn't implemented and the style fails to compile, then any geometry with that style will not render, as is true any other invalid rendering style.)


## Built-ins, defaults, and presets

The shading system includes a number of parameters and variables which are made available to the _vertex_ and _fragment_ shaders automatically in certain situations, to make defining materials and writing shader code easier.

####built-in uniforms
The following are built-in uniforms present in the _vertex_ and _fragment_ shaders, and can be accessed in any of the custom shader blocks:

```glsl
uniform mat4 u_model;
uniform mat4 u_modelView;
uniform mat3 u_normalMatrix;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_device_pixel_ratio; // window.devicePixelRatio

uniform float u_meters_per_pixel;
uniform vec3 u_tile_origin;         // .xy is SW corner of tile in meters from Null Island (0,0), .z is zoom of tile
uniform vec3 u_map_position;        // .xy is map center in meters from Null Island (0,0), .z is current zoom

```

####built-in varyings
"Varyings" are GLSL variables similar to uniforms which allow fragments to access vertex data, interpolated between vertices at the point of the fragment.

The following _varyings_ are passed from the _vertex_ to the _fragment_ shader, but *should not be used directly* because they have unpredictable behavior on some devices. Instead, use the wrappers that we have created:

```glsl
varying vec4 v_position; // local coordinates in meters from the center of the screen
```
Instead of `v_position`, use `position`
```glsl
varying vec3 v_normal;
```
Instead of `v_normal`, use `worldNormal()`
```glsl
varying vec4 v_color;
```
Instead of `v_color`, use `color`
```glsl
varying vec4 worldPosition();  // global coordinates in meters from the web mercator origin (-180,85.051129)
```
Instead of `worldPosition()`, use `worldPosition()`

If texture coordinates are used, the `v_texcoord` varying is defined:

```glsl
#if defined(TEXTURE_COORDS)
varying vec2 v_texcoord;
#endif
```

## material parameters

Certain other _uniforms_, global variables, and global functions are set when their corresponding [material](material.md) properties are defined:

```glsl

struct Material {
        vec4 emission;          // available if emission is defined
        vec3 emissionScale;     // available only if a emission texture is passed

        vec4 ambient;
        vec3 ambientScale;      // available only if a ambient texture is passed

        vec4 diffuse;
        vec3 diffuseScale;      // available only if a diffuse texture is passed

        vec4 specular;          // available if specular is defined
        float shininess;        // available if specular is defined
        vec3 specularScale;     // available only if a specular texture is passed
        
        vec3 normalScale;       // available only if a normal texture is passed
        float normalAmount;     // available only if a normal texture is passed
};

uniform sampler2D u_material_emission_texture;  // available only if a emission texture is passed
uniform sampler2D u_material_ambient_texture;   // available only if a ambient texture is passed
uniform sampler2D u_material_diffuse_texture;   // available only if a diffuse texture is passed
uniform sampler2D u_material_specular_texture;  // available only if a specular texture is passed
uniform sampler2D u_material_normal_texture;    // available only if a normal texture is passed

uniform Material u_material;
Material g_material = u_material;

// Global light accumulators for each term
vec4 light_accumulator_ambient = vec4(0.0);
vec4 light_accumulator_diffuse = vec4(0.0);
vec4 light_accumulator_specular = vec4(0.0);    // available if specular is defined
```

When [UV maps](Materials-Overview.md#mapping-uv) are used, the following functions are available for use in shader blocks:

```glsl
vec4 getSphereMap (in sampler2D _tex, in vec3 _eyeToPoint, in vec3 _normal, in vec2 _skew );
vec3 getTriPlanarBlend ( in vec3 _normal );
vec4 getTriPlanar ( in sampler2D _tex, in vec3 _pos, in vec3 _normal, in vec3 _scale);
vec4 getPlanar ( in sampler2D _tex, in vec3 _pos, in vec2 _scale);
```
