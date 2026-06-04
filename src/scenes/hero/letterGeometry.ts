import { ExtrudeGeometry, Shape } from 'three';

const EXTRUDE = {
  depth: 1.5,
  bevelEnabled: true,
  bevelThickness: 0.18,
  bevelSize: 0.14,
  bevelSegments: 4,
  curveSegments: 4,
};

// Hand-built 6-vertex outlines (block letterforms), traversed as a closed loop.
function vShape(): Shape {
  const s = new Shape();
  s.moveTo(-1.6, 3); // top-left outer
  s.lineTo(0, -1.2); // bottom tip (outer)
  s.lineTo(1.6, 3); // top-right outer
  s.lineTo(0.9, 3); // top-right inner
  s.lineTo(0, 0.6); // inner notch
  s.lineTo(-0.9, 3); // top-left inner
  s.closePath();
  return s;
}

function lShape(): Shape {
  const s = new Shape();
  s.moveTo(-1.2, 3); // top-left
  s.lineTo(-1.2, -1.8); // bottom-left
  s.lineTo(1.6, -1.8); // bottom-right
  s.lineTo(1.6, -0.9); // inner bottom-right
  s.lineTo(-0.3, -0.9); // inner corner
  s.lineTo(-0.3, 3); // inner top
  s.closePath();
  return s;
}

/** Builds a centered, ~targetHeight-tall extruded letter geometry. */
function buildLetter(shape: Shape, targetHeight: number): ExtrudeGeometry {
  const geo = new ExtrudeGeometry(shape, EXTRUDE);
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const h = bb.max.y - bb.min.y;
  const scale = targetHeight / h;
  geo.scale(scale, scale, scale);
  geo.center();
  geo.computeBoundingBox();
  geo.computeVertexNormals();
  return geo;
}

export function makeVGeometry(): ExtrudeGeometry {
  return buildLetter(vShape(), 6);
}

export function makeLGeometry(): ExtrudeGeometry {
  return buildLetter(lShape(), 6);
}
