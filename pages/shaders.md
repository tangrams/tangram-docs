*This is the technical documentation for Tangram’s shader injection system. Shaders are a vast topic – if you are new to GLSL we recommend starting with our own Patricio Gonzalez Vivo’s [The Book of Shaders](http://patriciogonzalezvivo.com/2015/thebookofshaders/). For a technical reference, see the [OpenGL ES Shading Language reference card](https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf).*

Tangram's drawing engine is built using WebGL, which is a JavaScript API for controlling a web browser's OpenGL capabilities. OpenGL is itself an API, designed to allow direct control of a graphics card's output.

OpenGL operates by sending self-contained graphics programs called "shaders" to the graphics card. Shaders come in two flavors: "vertex shaders", which control the position of a 3D face's vertices, and "fragment shaders", which control the color of the pixels which fill in a 3D face.

Every system of 3D graphics which uses OpenGL, including Tangram, has both a vertex and a fragment shader.

Tangram's shading system has been designed so that its shaders may be modified by the scene file at certain stages in their construction, by "injecting" shader code which modifies the shaders on their way to the graphics card. These stages allow the construction of sophisticated shading and compositing techniques similar to those used in video games and film VFX.

## `shaders`

The `shaders` element is an optional element in a _style_. It allows custom GPU code to be defined.

The `shaders` block has three optional elements.

- `defines` - allows preprocessing switches to be set before shader compilation.
- `uniforms` - a shortcut block for defining _uniforms_.
- `blocks` - allows direct injection of shader code.

```yaml
styles:
    water:
        defines:
            EFFECT_GRAY: true
        uniforms:
            u_color: [.5, .5, .5]
            u_speed: 2.5
        shaders:
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

“Defines” are GLSL preprocessor directives, which are injected into Tangram's shader code at compilation time. The `defines` block allows you to set and define custom statements, useful for changing the functionality of a shader without modifying the shader code directly.

For more on defines, see [link](link).

```yaml
shaders:
    defines:
        EFFECT_NOISE_ANIMATED: true
```

The following is a list of reserved defines used by the Tangram Engine:

```
TEXTURE_COORDS
FEATURE_SELECTION
WORLD_POSITION_WRAP

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

## `uniforms`
Optional parameter. Defines the start of a `uniforms` block.

The `uniforms` block allows shortcuts for declaring globally-accessible _uniform_ variables, for use in the `global`, `position`, `normal`, `color` and `filter` blocks. Uniforms declared here may also be accessed and manipulated through the [JavaScript API](JavaScript-API.md).

A "uniform" is a GLSL variable which is constant across all vertices and fragments (aka pixels).

Uniforms are declared as key-value pairs; types are inferred by the [YAML](yaml.md) parser, and the corresponding uniform declarations are injected into the shaders automatically.

```yaml
shaders:
    uniforms:
        u_color: vec3(.5, .5, .5)
        u_speed: 2.5
```

See also: [built-in uniforms](built-in-uniforms.md) and [varyings](varyings.md).

## `blocks`
Optional parameter. Defines the start of a `blocks` block.

The `block` element has five optional sub-elements. Each can contain shader code for manipulating a particluar part of the shading pipeline:

    * `global`: define global functions, usable by the other `block` elements
    * `position`: modify the position of a vertex
    * `normal`: modify the normal of a face, per-pixel
    * `color`: modify the color of a pixel before lighting
    * `filter`: modify the color of a pixel after lighting

The _shader blocks_ can be defined in any order, but they will be injected in this order into the _vertex_ and/or _fragment_ shader before their compilation.

```yaml
shaders:
    blocks:
        global: …
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
                global:
                    float getGrayscale(vec3 p) { return (p[0] + p[1] + p[2]) / 3.0; }
```

#### `position`
Optional element. Defines the start of a `position` block, written in GLSL, which is injected into the _vertex_ shader.

This block has access to the `position` variable, which contains the position of the current vertex, and takes the form `vec3(x, y, z)`.

```yaml
blocks:
    position: position.z *= (sin(position.z + u_time) + 1.0);
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
    color: color.rgb = vec3(1.0, .5, .5);
```

## Built-ins, defaults, and presets

The shading system includes a number of parameters and variables which are made available to the _vertex_ and _fragment_ shaders automatically in certain situations, to make defining materials and writing shader code easier.

####built-in uniforms
The following are built-in uniforms present in the _vertex_ and _fragment_ shaders, and can be accessed in any of the custom shader blocks:

```glsl
uniform mat4 u_model;
uniform mat4 u_modelView;
uniform mat3 u_normalMatrix;

uniform vec2 u_resolution;
uniform vec2 u_aspect;
uniform vec2 u_map_center;
uniform vec2 u_tile_origin;

uniform float u_meters_per_pixel;
uniform float u_map_zoom;
uniform float u_time;
```

####built-in varyings
"Varyings" are GLSL variables similar to uniforms which allow fragments to access vertex data, interpolated between vertices at the point of the fragment. For instance, if a face's three vertices have three different colors, a fragment in the center of the face can access the varying `v_color` to get the color at that point, interpolated between the three values.

The following _varyings_ are passed from the _vertex_ to the _fragment_ shader:

```glsl
varying vec4 v_position;
varying vec3 v_normal;
varying vec4 v_color;
varying vec4 v_world_position;

#if defined(TEXTURE_COORDS)
varying vec2 v_texcoord;
#endif
```


## material parameters

Certain other _uniforms_, global variables, and global functions are set when their corresponding [material](material.md) properties are defined:

```glsl
vec4 diffuse;
vec3 diffuseScale; # when diffuse is used with a texture

uniform vec4 ambient;
vec3 ambientScale; # when ambient is used with a texture

uniform vec4 emission;
uniform vec3 emissionScale; # when emission is used with a texture

vec4 specular;
float shininess;
vec3 specularScale; # when specular is used with a texture

vec3 normalScale; # normals can only be manipulated with a texture
float normalAmount;

uniform Material u_material;
Material g_material = u_material;

vec4 g_light_accumulator_ambient = vec4(0.0);
vec4 g_light_accumulator_diffuse = vec4(0.0);
vec4 g_light_accumulator_specular = vec4(0.0);
```

When [UV maps](UV-maps.md) are used, the following functions are available for use in shader blocks:

```glsl
vec4 getSphereMap (in sampler2D _tex, in vec3 _eyeToPoint, in vec3 _normal, in vec2 _skew );

vec3 getTriPlanarBlend ( in vec3 _normal );

vec4 getTriPlanar ( in sampler2D _tex, in vec3 _pos, in vec3 _normal, in vec3 _scale);

vec4 getPlanar ( in sampler2D _tex, in vec3 _pos, in vec2 _scale);
```
