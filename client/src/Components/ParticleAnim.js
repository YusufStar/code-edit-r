import React, { useRef, useEffect } from 'react';

const ParticleAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    const colors = ["#1A1A1A", "#FFFFFF", "#2E77B8", "#F2C029", "#E84C3D"];
  
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.radius = Math.random() * 10 + 5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
  
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
  
      update() {
        this.x += this.vx;
        this.y += this.vy;
  
        if (this.x < -this.radius || this.x > canvas.width + this.radius) {
          this.vx = -this.vx;
        }
  
        if (this.y < -this.radius || this.y > canvas.height + this.radius) {
          this.vy = -this.vy;
        }
      }
    }
  
    const particles = [];
  
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }
  
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
    }
  
    animate();
  
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  
    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  
    return () => {
      window.removeEventListener('resize');
    };
  }, []);
  

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

export default ParticleAnimation;
