import "mafs/core.css";
import "mafs/font.css";

import { Mafs, Circle, Coordinates, useMovablePoint, vec, Transform, Ellipse, Theme, Polygon } from "mafs";

export const CirclePlot = () => {
  const pointOnCircle = useMovablePoint([Math.sqrt(2) / 2, Math.sqrt(2) / 2]);
  const r = vec.mag(pointOnCircle.point);

  return (
    <Mafs viewBox={{ y: [-2, 2] }}>
      <Coordinates.Cartesian />
      <Circle center={[0, 0]} radius={r} />
      {pointOnCircle.element}
    </Mafs>
  );
};

export const EllipsePlot = () => {
  const hintRadius = 3;

  // This center point translates everything else.
  const translate = useMovablePoint([0, 0], {
    color: Theme.orange,
  });

  // This outer point rotates the ellipse, and
  // is also translated by the center point.
  const rotate = useMovablePoint([hintRadius, 0], {
    color: Theme.blue,
    // Constrain this point to only move in a circle
    constrain: (position) => vec.withMag(position, hintRadius),
  });
  const angle = Math.atan2(rotate.point[1], rotate.point[0]);

  const width = useMovablePoint([-2, 0], {
    constrain: "horizontal",
  });
  const height = useMovablePoint([0, 1], {
    constrain: "vertical",
  });

  return (
    <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }}>
      <Coordinates.Cartesian />

      <Transform translate={translate.point}>
        <Transform rotate={angle}>
          {/*
           * Display a little hint that the
           * point is meant to move radially
           */}
          <Circle center={[0, 0]} radius={hintRadius} strokeStyle="dashed" strokeOpacity={0.3} fillOpacity={0} />

          <Ellipse center={[0, 0]} radius={[Math.abs(width.x), Math.abs(height.y)]} />

          {width.element}
          {height.element}
        </Transform>

        {rotate.element}
      </Transform>

      {translate.element}
    </Mafs>
  );
};

export const SquarePlot = () => {
  const center = [0, 0] as [number, number]; // Center of the square
  const initialPoint = [1, 0] as [number, number]; // Initial position of the movable point
  const movablePoint = useMovablePoint(initialPoint, {
    constrain: (p) => {
      // Constrain the movable point to the right edge of the square
      const angle = Math.atan2(p[1], p[0]);
      const distance = Math.sqrt(p[0] ** 2 + p[1] ** 2); // Distance to the center
      return [Math.cos(angle) * distance, Math.sin(angle) * distance];
    },
  });

  const size = Math.sqrt(movablePoint.point[0] ** 2 + movablePoint.point[1] ** 2); // Distance determines square size
  const angle = Math.atan2(movablePoint.point[1], movablePoint.point[0]); // Rotation angle

  return (
    <Mafs>
      <Coordinates.Cartesian />

      {/* Translate the square based on the center */}
      <Transform translate={center}>
        {/* Apply rotation based on the movable point */}
        <Transform rotate={angle}>
          {/* Apply scaling based on the movable point's distance from the center */}
          <Transform scale={[size, size]}>
            <Polygon
              points={[
                [1, 1],
                [1, -1],
                [-1, -1],
                [-1, 1],
              ]}
              color={Theme.blue}
            />
          </Transform>
        </Transform>
      </Transform>

      {movablePoint.element}
    </Mafs>
  );
};
