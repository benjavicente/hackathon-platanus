import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const MatterStepOne = () => {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Body = Matter.Body,
      MouseConstraint = Matter.MouseConstraint,
      Constraint = Matter.Constraint,
      Vector = Matter.Vector,
      Mouse = Matter.Mouse;

    // Scale factor
    const scale = 0.4;

    // create an engine
    let engine = Engine.create();

    // create a renderer
    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: 800 * scale,
        height: 600 * scale,
        wireframes: false,
        background: "white",
      },
    });

    // create two boxes and a ground
    let group = Body.nextGroup(true);

    let stack = Composites.stack(250 * scale, 255 * scale, 1, 6, 0, 0, function (x, y) {
      return Bodies.rectangle(x, y, 30 * scale, 30 * scale);
    });

    let catapult = Bodies.rectangle(400 * scale, 520 * scale, 320 * scale, 20 * scale, {
      collisionFilter: { group: group },
    });

    Composite.add(engine.world, [
      stack,
      catapult,
      Bodies.rectangle(400 * scale, 600 * scale, 800 * scale, 50.5 * scale, {
        isStatic: true,
        render: { fillStyle: "#060a19" },
      }),
      Bodies.rectangle(250 * scale, 555 * scale, 20 * scale, 50 * scale, {
        isStatic: true,
        render: { fillStyle: "#060a19" },
      }),
      Bodies.rectangle(400 * scale, 535 * scale, 20 * scale, 80 * scale, {
        isStatic: true,
        collisionFilter: { group: group },
        render: { fillStyle: "#060a19" },
      }),
      Bodies.circle(560 * scale, 100 * scale, 50 * scale, { density: 0.005 }),
      Constraint.create({
        bodyA: catapult,
        pointB: Vector.clone(catapult.position),
        stiffness: 1,
        length: 0,
      }),
    ]);

    // add mouse control
    let mouse = Mouse.create(render.canvas);
    let mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    render.mouse = mouse;

    // run the renderer
    Render.run(render);

    // create runner
    let runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
  }, []);

  return (
    <div
      ref={boxRef}
      style={{
        width: 100,
        height: 100,
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default MatterStepOne;
