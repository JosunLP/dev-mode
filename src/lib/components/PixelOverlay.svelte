<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  let canvasElement: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationId: number;
  let effectActive = false;
  let isBrowser = false;
  
  // For export as component API
  export function triggerEffect() {
    if (!isBrowser || effectActive) return;
    startEffect();
    
    // Automatically end effect after a few seconds
    setTimeout(() => {
      if (effectActive) {
        stopEffect();
      }
    }, 3000);
  }
  
  function startEffect() {
    if (!isBrowser || effectActive) return;
    effectActive = true;
    
    // Adjust canvas size to viewport
    resizeCanvas();
    
    // Start the animation
    animatePixels();
  }
  
  function stopEffect() {
    effectActive = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    // Clear canvas
    if (ctx) {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
  }
  
  function resizeCanvas() {
    if (!isBrowser || !canvasElement) return;
    
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
  }
  
  function animatePixels() {
    if (!isBrowser || !canvasElement || !ctx || !effectActive) return;
    
    // Clear current canvas
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // AI-based pixel randomization (satirical)
    const pixelSize = 5;
    const cols = Math.ceil(canvasElement.width / pixelSize);
    const rows = Math.ceil(canvasElement.height / pixelSize);
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Show only about 15% of pixels for a subtle effect
        if (Math.random() > 0.85) {
          // AI-generated colors (satirical)
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          const a = Math.random() * 0.7; // semi-transparent
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }
    
    // Next frame if effect is still active
    if (effectActive) {
      animationId = requestAnimationFrame(animatePixels);
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    // ESC key stops the effect
    if (e.key === "Escape" && effectActive) {
      stopEffect();
    }
  }
  
  onMount(() => {
    // Set the browser flag, as onMount is only executed in the browser
    isBrowser = true;
    
    if (canvasElement) {
      ctx = canvasElement.getContext('2d')!;
      
      // Initially set canvas size
      resizeCanvas();
      
      // Event listener for window resize
      window.addEventListener('resize', resizeCanvas);
      
      // Keyboard listener for ESC key
      window.addEventListener('keydown', handleKeydown);
    }
  });
  
  onDestroy(() => {
    if (!isBrowser) return;
    
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    window.removeEventListener('resize', resizeCanvas);
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<canvas
  bind:this={canvasElement}
  class="pixel-overlay"
  class:active={effectActive}
></canvas>

<style lang="scss">
  .pixel-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9000;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    &.active {
      opacity: 1;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .pixel-overlay {
      transition: none;
    }
  }
</style>