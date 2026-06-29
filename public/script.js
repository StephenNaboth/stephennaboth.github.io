(function () {
  // copy-to-clipboard for the contact snippet
  document.querySelectorAll(".copy[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const text = btn.getAttribute("data-copy");
      navigator.clipboard.writeText(text).then(function () {
        const original = btn.textContent;
        btn.textContent = "copied";
        setTimeout(function () { btn.textContent = original; }, 1400);
      });
    });
  });

  // hero canvas: a rough sketch line settles into a clean line and back,
  // representing "draft -> ship". Pure vanilla canvas, no dependencies.
  const canvas = document.getElementById("sketchCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const readout = document.getElementById("noiseVal");
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width, H = canvas.height;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.scale(dpr, dpr);

  const points = 64;
  let t = 0;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // noise amount sweeps 1 -> 0 -> 1 (rough sketch -> clean line -> rough)
    const phase = (Math.sin(t) + 1) / 2; // 0..1
    const noise = phase;

    ctx.strokeStyle = "#a8341f";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * W;
      const base = H * 0.62 - Math.sin((i / points) * Math.PI) * H * 0.28;
      const jitter = Math.sin(i * 12.9 + t * 3) * 14 * noise + Math.sin(i * 5.3 - t * 2) * 8 * noise;
      const y = base + jitter;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // faint baseline
    ctx.strokeStyle = "#d5c8a4";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.62);
    ctx.lineTo(W, H * 0.62);
    ctx.stroke();

    if (readout) readout.textContent = "noise: " + noise.toFixed(2);

    t += 0.018;
    if (!prefersReduced) requestAnimationFrame(draw);
  }

  if (prefersReduced) {
    // draw a single clean static frame
    t = Math.PI; // noise = 0
    draw();
  } else {
    requestAnimationFrame(draw);
  }
})();
