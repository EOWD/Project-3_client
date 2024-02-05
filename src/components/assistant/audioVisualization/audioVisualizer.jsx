import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as SimplexNoise from 'simplex-noise';
import './audio.css';

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  const noise = new SimplexNoise.default(); // Adjusted usage here
  const dpi = window.devicePixelRatio > 1.5 ? 2 : 1;
  const scale = 120;

  class Line {
    constructor(dots) {
      this.dots = dots;
      this.offset = Math.random();
      this.speed = (Math.random() + 0.2) * 0.006 * (Math.random() > 0.5 ? 1 : -1);
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.dots[0][0], this.dots[0][1]);
      for (let i = 0; i < this.dots.length; i++) {
        let x = this.dots[i][0];
        let y = this.dots[i][1] + noise.noise2D(x * 0.01, this.offset) * 40;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      this.offset += this.speed;
    }
  }

  const draw = (ctx, lines) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    lines.forEach(line => line.draw(ctx));
    requestAnimationFrame(() => draw(ctx, lines));
  };

  const init = (ctx, canvas) => {
    let width = canvas.offsetWidth * dpi;
    let height = canvas.offsetHeight * dpi;

    canvas.width = width;
    canvas.height = height;

    let rows = Math.floor(height / scale);
    let offsetTop = (height - (rows * scale)) / 2;

    const lines = [];
    for (let y = 0; y < rows; y++) {
      let dots = [];
      for (let x = 0; x <= width; x += scale) {
        dots.push([x, y * scale + offsetTop]);
      }
      lines.push(new Line(dots));
    }

    return lines;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let lines = init(ctx, canvas);

    draw(ctx, lines);

    const handleResize = () => {
      lines = init(ctx, canvas); // Re-initialize lines on resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures effect runs only once at mount

  return (
    <div className="canvasContainer">
      <canvas ref={canvasRef} className="artCanvas"></canvas>
    </div>
  );
};

export default CanvasAnimation;
