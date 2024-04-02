import { useEffect, useRef, MouseEvent } from "react";

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

interface Mouse extends Position {
  buttonState: buttonState
}

const Canvas = ({ width, height }: CanvasProps) => {
  const TWO_PI = 2 * Math.PI;
  const ref = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const ballsRef = useRef<Ball[]>([]);

  let mouse : Mouse = {
    x: width / 2,
    y: height / 2,
    buttonState: 'down',
  };

  class Ball {
    pos: Position
    vel: Speed
    radius: number
    mass: number
    color: string
    constructor() {
      this.pos = {
        x: mouse.x,
        y: mouse.y,
      }
      this.vel = {
        x: 0,
        y: 0,
      }
      this.radius = 10
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
    [mouse.x, mouse.y] = [e.clientX, e.clientY];
  }

  function updateBalls()  {
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
  }

  function isDown() {
    mouse.buttonState = mouse.buttonState === 'down' ? 'up' : 'down';
  }

  useEffect(() => {
    function drawCanvas(context: CanvasRenderingContext2D){
      if (context) {
        context.fillStyle = '#03002E';
        context.fillRect(0, 0, width, height);

        if (mouse.buttonState === 'up') {
          ballsRef.current.push(new Ball())
        }

        updateBalls();
        ballsRef.current.map(e => e.draw(context));

        frameRef.current = requestAnimationFrame(() => {
          drawCanvas(context);
        });
      }
    }

    if (ref.current) {
      const context = ref.current.getContext('2d');
      ballsRef.current = [];

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

  return <canvas onMouseMove={setPos} onMouseUp={isDown} onMouseDown={isDown} ref={ref} width={width} height={height}/>;
};

Canvas.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight
};

export default Canvas;