/** True if the browser can create a WebGL context. Checked before mounting the
 *  Canvas so devices without WebGL get the DOM fallback instead of a crash. */
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}
