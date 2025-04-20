<script lang="ts">
  import { onMount } from 'svelte';

  let active = false;
  let overlayElement: HTMLDivElement;

  export function triggerEffect() {
    if (active) return;
    
    active = true;
    setTimeout(() => {
      active = false;
    }, 800); // Animation dauert 0.8 Sekunden
  }
</script>

<div 
  class="pixel-overlay" 
  class:active
  bind:this={overlayElement}
></div>