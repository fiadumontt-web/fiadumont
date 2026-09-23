export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uMouse;
  uniform float uMouseStrength;

  attribute vec3 aRand;
  attribute vec3 aScatter;

  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 p = position;
    float t = uTime * 0.25;

    // Respiração lenta da superfície
    float wave = sin(p.x * 1.2 + t * 2.0 + aRand.x * 6.2831) * cos(p.y * 1.4 - t * 1.6);
    p += normalize(p) * wave * 0.18;

    // Repulsão junto ao cursor
    vec3 d = p - uMouse;
    float falloff = smoothstep(1.9, 0.0, length(d));
    p += normalize(d + 0.0001) * falloff * 0.7 * uMouseStrength;

    // Dispersão ao fazer scroll
    float s = smoothstep(0.0, 1.0, uProgress);
    p += aScatter * s * 9.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float twinkle = 0.65 + 0.35 * sin(uTime * 1.5 + aRand.y * 20.0);
    gl_PointSize = uSize * uPixelRatio * (0.55 + aRand.z) * twinkle * (1.0 / -mv.z);

    vAlpha = (1.0 - s * 0.9) * twinkle * (0.6 + falloff * 0.4 * uMouseStrength);
    vMix = aRand.x;
  }
`;

export const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying float vAlpha;
  varying float vMix;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.6);
    vec3 col = mix(uColorA, uColorB, vMix);
    col = mix(col, uColorC, step(0.92, vMix));
    gl_FragColor = vec4(col, a * vAlpha);
    #include <colorspace_fragment>
  }
`;
