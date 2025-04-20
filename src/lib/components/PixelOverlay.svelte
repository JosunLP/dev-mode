<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  let canvasElement: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationId: number;
  let effectActive = false;
  let isBrowser = false;
  
  // Für den Export als Komponenten-API
  export function triggerEffect() {
    if (!isBrowser || effectActive) return;
    startEffect();
    
    // Effekt nach einigen Sekunden automatisch beenden
    setTimeout(() => {
      if (effectActive) {
        stopEffect();
      }
    }, 3000);
  }
  
  function startEffect() {
    if (!isBrowser || effectActive) return;
    effectActive = true;
    
    // Canvas Größe an Viewport anpassen
    resizeCanvas();
    
    // Start der Animation
    animatePixels();
  }
  
  function stopEffect() {
    effectActive = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    // Canvas löschen
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
    
    // Aktuelles Canvas leeren
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // KI-basierte Pixel-Randomisierung (satirisch)
    const pixelSize = 5;
    const cols = Math.ceil(canvasElement.width / pixelSize);
    const rows = Math.ceil(canvasElement.height / pixelSize);
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Nur etwa 15% der Pixel anzeigen für einen subtilen Effekt
        if (Math.random() > 0.85) {
          // KI-generierte Farben (satirisch)
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          const a = Math.random() * 0.7; // halbtransparent
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }
    
    // Nächster Frame, wenn Effekt noch aktiv
    if (effectActive) {
      animationId = requestAnimationFrame(animatePixels);
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    // ESC-Taste beendet den Effekt
    if (e.key === "Escape" && effectActive) {
      stopEffect();
    }
  }
  
  onMount(() => {
    // Setzen wir den Browser-Flag, da onMount nur im Browser ausgeführt wird
    isBrowser = true;
    
    if (canvasElement) {
      ctx = canvasElement.getContext('2d')!;
      
      // Initial Canvas-Größe setzen
      resizeCanvas();
      
      // Event-Listener für Fenstergrößenänderungen
      window.addEventListener('resize', resizeCanvas);
      
      // Keyboard-Listener für ESC-Taste
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