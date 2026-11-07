import { FileItem } from "@/types/ide";
import { INITIAL_WORKSPACE_FILES } from "./initialFiles";

export const PROJECT_TEMPLATES: Record<string, { name: string; description: string; files: FileItem[] }> = {
  react: {
    name: "React + TypeScript App",
    description: "Modern interactive React application with Tailwind CSS and hooks",
    files: INITIAL_WORKSPACE_FILES,
  },
  python: {
    name: "Python Data & Algorithms",
    description: "Data analysis script, statistics utilities, and algorithmic solvers",
    files: [
      {
        id: "py-main",
        name: "main.py",
        path: "/main.py",
        type: "file",
        language: "python",
        content: `"""
Ela Python Machine Learning & Analytics Engine
"""
import math

def run_simulation(samples=100):
    print(f"Generating {samples} stochastic distribution points...")
    data = [math.sin(i / 10.0) * 100 for i in range(samples)]
    avg = sum(data) / len(data)
    variance = sum((x - avg) ** 2 for x in data) / len(data)
    
    print("-" * 45)
    print("      SIMULATION RESULTS")
    print("-" * 45)
    print(f"Sample Count:     {len(data)}")
    print(f"Mean Value:       {avg:.4f}")
    print(f"Variance:         {variance:.4f}")
    print(f"Std Deviation:    {math.sqrt(variance):.4f}")
    print("-" * 45)
    print("Simulation finished successfully!")

if __name__ == "__main__":
    run_simulation()
`,
      },
      {
        id: "py-utils",
        name: "math_utils.py",
        path: "/math_utils.py",
        type: "file",
        language: "python",
        content: `def fibonacci(n: int):
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[-1] + fib[-2])
    return fib[:n]

def is_prime(num: int) -> bool:
    if num <= 1:
        return False
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    return True
`,
      },
      {
        id: "py-readme",
        name: "README.md",
        path: "/README.md",
        type: "file",
        language: "markdown",
        content: `# Python Data & Algorithms Workspace

Run \`python main.py\` in the integrated terminal to execute this project.
`,
      },
    ],
  },
  html: {
    name: "HTML5 / Canvas Cyber Game",
    description: "Interactive real-time HTML5 2D canvas particle visualizer with hot reloading",
    files: [
      {
        id: "html-index",
        name: "index.html",
        path: "/index.html",
        type: "file",
        language: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyber Canvas Particles</title>
  <style>
    body {
      margin: 0;
      background: #09090b;
      overflow: hidden;
      color: #fafafa;
      font-family: sans-serif;
    }
    canvas {
      display: block;
    }
    .hud {
      position: absolute;
      top: 20px;
      left: 20px;
      pointer-events: none;
      background: rgba(18, 18, 22, 0.8);
      border: 1px solid #27272a;
      padding: 12px 18px;
      border-radius: 8px;
    }
    h1 {
      margin: 0 0 6px;
      font-size: 16px;
      color: #38bdf8;
    }
    p {
      margin: 0;
      font-size: 12px;
      color: #a1a1aa;
    }
  </style>
</head>
<body>
  <div class="hud">
    <h1>Cyber Particle Simulation</h1>
    <p>Move mouse to attract particles. Built in Ela IDE.</p>
  </div>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const particles = [];
    const mouse = { x: w / 2, y: h / 2 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? '#38bdf8' : '#818cf8',
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(9, 9, 11, 0.2)';
      ctx.fillRect(0, 0, w, h);

      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.vx += (dx / dist) * 0.2;
          p.vy += (dy / dist) * 0.2;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();
  </script>
</body>
</html>
`,
      },
    ],
  },
};
