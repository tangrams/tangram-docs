// Created by patricio gonzalez vivo - 2015
// http://shiny.ooo/~patriciogv/

#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.1415926535897932384626433832795;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Normal Map
uniform vec2 u_tex0Resolution;  // All have the same size but are use to see if the texture is loaded
uniform sampler2D u_tex0;  

// Texture Day
uniform vec2 u_tex1Resolution;
uniform sampler2D u_tex1;

// Texture Night  
uniform vec2 u_tex2Resolution;
uniform sampler2D u_tex2;       

// Specular Map
uniform vec2 u_tex3Resolution;
uniform sampler2D u_tex3;

// LIGHT Functions and Structs
struct Light { vec3 ambient, diffuse, specular; };
struct PointLight { Light emission; vec3 position;};
struct Material { Light bounce; vec3 emission; float shininess;};

void computeLight(in PointLight _light, in Material _material, in vec3 _pos, in vec3 _normal, inout Light _accumulator ){
    float dist = length(_light.position - _pos);
    vec3 lightDirection = (_light.position - _pos)/dist;

    _accumulator.ambient += _light.emission.ambient;
    float diffuseFactor = max(0.0,dot(lightDirection,_normal));
    _accumulator.diffuse += _light.emission.diffuse * diffuseFactor;

    if (diffuseFactor > 0.0) {
        vec3 reflectVector = reflect(-lightDirection, _normal);
        float specularFactor = max(0.0,pow( dot(-normalize(_pos), reflectVector), _material.shininess));
        _accumulator.specular += _light.emission.specular * specularFactor;
    }
}

vec3 calculate(in Material _material, in Light _light){
    vec3 color = vec3(0.0);
    color += _material.emission;
    color += _material.bounce.ambient * _light.ambient;
    color += _material.bounce.diffuse * _light.diffuse;
    color += _material.bounce.specular * _light.specular;
    return color;
}

// SPHERE functions
vec3 sphereNormal(vec2 uv) {
    uv = fract(uv)*2.0-1.0; 
    vec3 ret;
    ret.xy = sqrt(uv * uv) * sign(uv);
    ret.z = sqrt(abs(1.0 - dot(ret.xy,ret.xy)));
    return ret * 0.5 + 0.5;
}

vec2 sphereCoords(vec2 _st, float _scale){
    float maxFactor = sin(1.570796327);
    vec2 uv = vec2(0.0);
    vec2 xy = 2.0 * _st.xy - 1.0;
    float d = length(xy);
    if (d < (2.0-maxFactor)){
        d = length(xy * maxFactor);
        float z = sqrt(1.0 - d * d);
        float r = atan(d, z) / 3.1415926535 * _scale;
        float phi = atan(xy.y, xy.x);

        uv.x = r * cos(phi) + 0.5;
        uv.y = r * sin(phi) + 0.5;
    } else {
        uv = _st.xy;
    }
    return uv;
}

// SCENE Definitions
//---------------------------------------------------

//  Light
Light l = Light(vec3(0.0),vec3(0.0),vec3(0.0)); 
Material material = Material(Light(vec3(0.0),vec3(.8),vec3(0.0)),vec3(0.0),2.0);
PointLight pLight = PointLight(Light(vec3(0.2),vec3(1.),vec3(0.2)),vec3(0.5,0.5,1.2)*2.0);

void main(){

    // Prepair pixel "atributes"
    vec2 st = gl_FragCoord.xy/u_resolution.xy-0.5;
    st.x*=u_resolution.x/u_resolution.y;
    st += 0.5;

    // Global propeties
    vec3 color = vec3(0.0);
    vec3 normal = vec3(0.0);
    vec3 pos = vec3(0.0);

    // Rotate globe texture with mouse interaction
    vec2 texCoord = sphereCoords(st, 1.0);
    float aspect = u_tex0Resolution.y/u_tex0Resolution.x;
    texCoord.x = fract(texCoord.x*aspect+ 0.25);

    // Set NORMALS
    //------------------------------------------------------------
    normal = normalize(sphereNormal(st)*2.0-1.0);
    pos = normal*1.0;
    if(u_tex0Resolution != vec2(0.0)){
        vec3 normalmap = texture2D(u_tex0, texCoord).rgb*2.0-1.0;
        normal = normalize(normal+normalmap);
    }

    // LIGTHS
    //------------------------------------------------------------  
    computeLight(pLight,material,pos,normal,l);

    // PreCompute brigness to modulate between night/day texture
    float brightness = clamp(calculate(material,l),vec3(0.0),vec3(1.0)).x;

    // MULTI TEXTURING
    //-------------------------------------------------------------
    vec3 dayTexture = vec3(1.0);
    vec3 nightTexture = vec3(0.0);
    vec3 specularSurface = vec3(1.0);

    // Load texture if is pssed
    if(u_tex1Resolution != vec2(0.0)){
        dayTexture = texture2D(u_tex1,texCoord).xyz;
    }

    if(u_tex2Resolution != vec2(0.0)){
        nightTexture = texture2D(u_tex2,texCoord).xyz;
    }

    if(u_tex3Resolution != vec2(0.0)){
        specularSurface = texture2D(u_tex3,texCoord).xyz;
    }
  
    // Feed the colors comming from the textures acording to night/day
    material.emission = nightTexture*(1.0-brightness);
    material.bounce.ambient = dayTexture * brightness;
    material.bounce.diffuse = dayTexture * brightness;
    material.bounce.specular = vec3(0.3,0.8,1.)*(1.0-specularSurface);
    material.shininess = 20.0;

    // Final LIGTH Calculation
    //-------------------------------------------------------------
    color = calculate(material,l);

    // turn black the area around the sphere;
    float radius = length( vec2(0.5)-st )*2.0;
  
    gl_FragColor = mix(vec4(color,1.0),vec4(0.0),smoothstep(0.99,1.0,radius));
}