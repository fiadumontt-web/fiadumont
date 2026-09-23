// Decide se o dispositivo aguenta a cena WebGL do hero.
// Devolve { webgl, full, reason } sem carregar three.js.

export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function detectCapability() {
  const params = new URLSearchParams(location.search);
  if (params.has('static')) return { webgl: hasWebGL(), full: false, reason: 'forced' };

  const webgl = hasWebGL();
  if (!webgl) return { webgl, full: false, reason: 'no-webgl' };

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { webgl, full: false, reason: 'reduced-motion' };
  }

  const conn = navigator.connection;
  if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) {
    return { webgl, full: false, reason: 'save-data' };
  }

  const touch = matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4; // só Chromium expõe este valor
  if (touch && (cores <= 4 || memory <= 2)) {
    return { webgl, full: false, reason: 'weak-mobile' };
  }

  // Dispositivos táteis capazes recebem a cena com menos partículas.
  return { webgl, full: true, tier: touch ? 'mid' : 'high', reason: 'ok' };
}
