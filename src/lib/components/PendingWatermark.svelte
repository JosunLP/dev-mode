<script lang="ts">
  import { watermarkEnabled } from '$lib/stores';
  import { onMount, onDestroy } from 'svelte';
  
  let watermarkElement: HTMLDivElement;
  let x = 20;
  let y = 20;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let moveIntervalId: ReturnType<typeof setInterval>;
  
  // Automatische Bewegung des Wasserzeichens in zufälligen Intervallen
  function setupRandomMovement() {
    // Zufällige Bewegung alle 5-10 Sekunden
    moveIntervalId = setInterval(() => {
      if ($watermarkEnabled && !isDragging) {
        moveToRandomPosition();
      }
    }, Math.random() * 5000 + 5000); // 5-10s
  }
  
  function moveToRandomPosition() {
    // Maximale Koordinaten basierend auf Viewport
    const maxX = window.innerWidth - 200; // Abzüglich Wasserzeichen-Breite
    const maxY = window.innerHeight - 100; // Abzüglich Wasserzeichen-Höhe
    
    // Neue Position berechnen
    const newX = Math.max(0, Math.min(Math.random() * maxX, maxX));
    const newY = Math.max(0, Math.min(Math.random() * maxY, maxY));
    
    // Animation zur neuen Position
    animateMove(newX, newY);
  }
  
  function animateMove(targetX: number, targetY: number) {
    const startX = x;
    const startY = y;
    const distance = Math.sqrt(Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2));
    const duration = Math.min(Math.max(distance * 10, 500), 2000); // 0.5-2s basierend auf Entfernung
    const startTime = performance.now();
    
    function step(currentTime: number) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing-Funktion für sanfte Bewegung
      const easedProgress = easeInOutQuad(progress);
      
      x = startX + (targetX - startX) * easedProgress;
      y = startY + (targetY - startY) * easedProgress;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    
    requestAnimationFrame(step);
  }
  
  // Easing-Funktion für sanfte Animation
  function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  
  // Drag & Drop Funktionen
  function handleMouseDown(event: MouseEvent) {
    if (!$watermarkEnabled) return;
    
    isDragging = true;
    offsetX = event.clientX - x;
    offsetY = event.clientY - y;
    
    // Stiländerung während des Ziehens
    if (watermarkElement) {
      watermarkElement.style.cursor = 'grabbing';
      watermarkElement.style.opacity = '0.8';
    }
    
    event.preventDefault();
  }
  
  function handleMouseMove(event: MouseEvent) {
    if (!isDragging) return;
    
    x = event.clientX - offsetX;
    y = event.clientY - offsetY;
    
    event.preventDefault();
  }
  
  function handleMouseUp() {
    if (!isDragging) return;
    
    isDragging = false;
    
    // Stil zurücksetzen
    if (watermarkElement) {
      watermarkElement.style.cursor = 'grab';
      watermarkElement.style.opacity = '1';
    }
  }
  
  onMount(() => {
    // Event-Handler für Drag & Drop
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Automatische Bewegung starten
    setupRandomMovement();
    
    // Initiale Position zufällig setzen
    moveToRandomPosition();
  });
  
  onDestroy(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    clearInterval(moveIntervalId);
  });
</script>

{#if $watermarkEnabled}
  <div 
    bind:this={watermarkElement}
    class="patent-pending-watermark"
    style="left: {x}px; top: {y}px;"
    on:mousedown={handleMouseDown}
  >
    <div class="watermark-text">
      PATENT<br>PENDING
    </div>
    <div class="watermark-subtext">
      STRENG PATENTRECHTLICH GESCHÜTZT
    </div>
  </div>
{/if}

<style lang="scss">
  .patent-pending-watermark {
    position: fixed;
    z-index: 9999;
    padding: 15px;
    background-color: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(4px);
    border: 2px dashed rgba(255, 64, 129, 0.6);
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    cursor: grab;
    user-select: none;
    text-align: center;
    transform: rotate(-5deg);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: rotate(-5deg) scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }
  }
  
  .watermark-text {
    font-family: "Impact", "Arial Black", sans-serif;
    font-size: 32px;
    line-height: 0.9;
    font-weight: bold;
    color: rgba(255, 64, 129, 0.8);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: 1px;
  }
  
  .watermark-subtext {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.7);
    margin-top: 8px;
    font-weight: bold;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .patent-pending-watermark {
      transition: none;
    }
  }
</style>