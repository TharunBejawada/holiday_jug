export type Point = [number, number];

// Samples a quadratic bezier (in 0-100 "viewBox" units) into left/top/rotate
// keyframe arrays, so a flying icon can glide along a gentle arc instead of
// a straight diagonal, with its rotation following the curve's tangent.
export function bezierKeyframes(p0: Point, p1: Point, p2: Point, steps = 24) {
  const left: string[] = [];
  const top: string[] = [];
  const rotate: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0];
    const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1];
    left.push(`${x}%`);
    top.push(`${y}%`);

    const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
    const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    rotate.push((Math.atan2(dy, dx) * 180) / Math.PI);
  }

  return { left, top, rotate };
}

export function bezierPathD(p0: Point, p1: Point, p2: Point) {
  return `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`;
}
