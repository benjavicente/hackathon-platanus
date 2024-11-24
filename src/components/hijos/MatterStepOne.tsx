import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const MatterStepOne = () => {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // module aliases
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

    // create an engine
    let engine = Engine.create();

    // create a renderer
    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        wireframes: false,
      },
    });

    // create two boxes and a ground
    //
    var group = Body.nextGroup(true);

    var stack = Composites.stack(250, 255, 1, 6, 0, 0, function (x, y) {
      return Bodies.rectangle(x, y, 30, 30);
    });

    var catapult = Bodies.rectangle(400, 520, 320, 20, { collisionFilter: { group: group } });

    Composite.add(engine.world, [
      stack,
      catapult,
      Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true, render: { fillStyle: "#060a19" } }),
      Bodies.rectangle(250, 555, 20, 50, { isStatic: true, render: { fillStyle: "#060a19" } }),
      Bodies.rectangle(400, 535, 20, 80, {
        isStatic: true,
        collisionFilter: { group: group },
        render: { fillStyle: "#060a19" },
      }),
      Bodies.circle(560, 100, 50, { density: 0.005 }),
      Constraint.create({
        bodyA: catapult,
        pointB: Vector.clone(catapult.position),
        stiffness: 1,
        length: 0,
      }),
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
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
    Body.scale(catapult, 0.9, 1);
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
