import { useEffect, useRef, MouseEvent, useState } from "react";

type buttonState = 'down' | 'up';

interface CanvasProps {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

interface Speed {
  x: number;
  y: number;
}

interface Mouse {
  prevPos: Position
  currentPos: Position
  buttonState: buttonState
}

const Canvas = ({ width, height }: CanvasProps) => {
  const TWO_PI = 2 * Math.PI;
  const ref = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const ballsRef = useRef<Ball[]>([]);

  let mouse : Mouse = {
    prevPos: {
      x: width / 2,
      y: height / 2,
    },
    currentPos: {
      x: width / 2,
      y: height / 2,
    },
    buttonState: 'up',
  };

  class Ball {
    pos: Position
    vel: Speed
    radius: number
    mass: number
    color: string
    constructor({x, y}: Position) {
      this.pos = {
        x: x,
        y: y,
      }
      this.vel = {
        x: 0,
        y: 0,
      }
      this.radius = 30
      this.mass = 0.02
      this.color = '#ff1100'
    }
    draw(context: CanvasRenderingContext2D) {
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

      context.fillStyle = context.strokeStyle = this.color;
      context.beginPath();
      context.arc(this.pos.x, this.pos.y, this.radius, 0, TWO_PI);
      context.closePath();
      context.fill(); // всегда закрашивать
    }
  }

  function setPos(e: MouseEvent<HTMLCanvasElement>) {
    [mouse.prevPos.x, mouse.prevPos.y] = [mouse.currentPos.x, mouse.currentPos.y];
    [mouse.currentPos.x, mouse.currentPos.y] = [e.clientX, e.clientY];
  }

/*   function updateBalls()  {
    for (let i = 0; i < ballsRef.current.length; i++) {
      let acceleration = {x: 0, y: 0};
      for (let j = 0; j < ballsRef.current.length; j++) {
        if (i === j) continue;
        let [a, b] = [ballsRef.current[i], ballsRef.current[j]];

        let delta = {x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y};
        let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
        let force = (dist - 300) / dist * b.mass;

        acceleration.x += delta.x * force;
        acceleration.y += delta.y * force;
      }

      ballsRef.current[i].vel.x = ballsRef.current[i].vel.x * 0.98 + acceleration.x * ballsRef.current[i].mass;
      ballsRef.current[i].vel.y = ballsRef.current[i].vel.y * 0.98 + acceleration.y * ballsRef.current[i].mass;
    }
  } */

  function isDown() {
    mouse.buttonState = mouse.buttonState === 'up' ? 'down' : 'up';
  }

  function isUp() {
    mouse.buttonState = mouse.buttonState === 'down' ? 'up' : 'down';
  }

  useEffect(() => {
    function drawCanvas(context: CanvasRenderingContext2D){
      if (context) {
        context.fillStyle = '#03002E';
        context.fillRect(0, 0, width, height);

        if (mouse.buttonState === 'down') {
          const movedBall = ballsRef.current.find((el) => {
            const maxElPosX = el.pos.x + el.radius;
            const minElPosX = el.pos.x - el.radius;
            const maxElPosY = el.pos.y + el.radius;
            const minElPosY = el.pos.y - el.radius;

            return mouse.currentPos.x >= minElPosX && mouse.currentPos.x <= maxElPosX && mouse.currentPos.y >= minElPosY && mouse.currentPos.y <= maxElPosY;
          });

          if (movedBall) {
            movedBall.pos.x = mouse.currentPos.x;
            movedBall.pos.y = mouse.currentPos.y;
          }
        }

        /* updateBalls(); */
        ballsRef.current.map(e => e.draw(context));

        frameRef.current = requestAnimationFrame(() => {
          drawCanvas(context);
        });
      }
    }

    if (ref.current) {
      const context = ref.current.getContext('2d');
      ballsRef.current = [new Ball({x: width / 2 , y: height / 2})];
      for (let i = 1; i <= 5; i++) {
        ballsRef.current.push(
          new Ball(
            {
              x: ballsRef.current[ballsRef.current.length - i].pos.x - ballsRef.current[ballsRef.current.length - i].radius,
              y: ballsRef.current[ballsRef.current.length - i].pos.y - ballsRef.current[ballsRef.current.length - i].radius * Math.sqrt(3)}
            )
          )
        for (let j = 0; j < i ; j++) {
          ballsRef.current.push
          (new Ball(
            {
              x: ballsRef.current[ballsRef.current.length - 1].pos.x + 2 * ballsRef.current[ballsRef.current.length - 1].radius,
              y: ballsRef.current[ballsRef.current.length - 1].pos.y
            })
          )
        }
      }

      if (context) {
        context.canvas.width = width;
        context.canvas.height = height;

        frameRef.current = requestAnimationFrame(() => {
          drawCanvas(context);
        });
      }
    }

    return () => cancelAnimationFrame(frameRef.current);
  }, [height, width]);

  return <canvas onMouseMove={setPos} onMouseUp={isUp} onMouseDown={isDown} ref={ref} width={width} height={height}/>;
};

Canvas.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight
};

export default Canvas;