<script lang="ts">
  import { buildProgress } from '$lib/stores';
  import { onMount, onDestroy } from 'svelte';
  
  let intervalId: ReturnType<typeof setInterval>;
  let tooltipVisible = false;
  let tooltipTimeout: ReturnType<typeof setTimeout>;
  
  // Diese Funktion sorgt dafür, dass der Build-Fortschritt nie 100% erreicht
  function updateBuildProgress() {
    $buildProgress += Math.random() * 2;
    
    // Wenn der Fortschritt zu nahe an 100% kommt, setzen wir ihn zurück
    if ($buildProgress > 98) {
      $buildProgress = Math.max(90, $buildProgress - Math.random() * 15);
    }
  }
  
  function showTooltip() {
    tooltipVisible = true;
    
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => {
      tooltipVisible = false;
    }, 3000);
  }
  
  function resetBuild() {
    $buildProgress = 45 + Math.random() * 20;
  }
  
  onMount(() => {
    // Initialer Fortschritt
    $buildProgress = 45 + Math.random() * 20;
    
    // Fortschritt langsam erhöhen
    intervalId = setInterval(updateBuildProgress, 2000);
  });
  
  onDestroy(() => {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    clearInterval(intervalId);
  });
</script>

<!-- Build Overlord UI -->
<div class="build-overlord">
  <div class="build-title">
    <span class="build-icon">🏗️</span> Build Status
  </div>
  
  <div class="progress-container" on:mouseenter={showTooltip}>
    <div class="progress-bar" style="width: {$buildProgress}%"></div>
    {#if tooltipVisible}
      <div class="tooltip-text">Der Build wird niemals abgeschlossen.</div>
    {/if}
  </div>
  
  <div class="build-info">
    <div class="build-label">
      {#if $buildProgress < 60}
        Baue Abhängigkeiten...
      {:else if $buildProgress < 75}
        Transformiere Code...
      {:else if $buildProgress < 90}
        Optimiere Bundle...
      {:else}
        Abschlussarbeiten... (noch ein paar Minuten)
      {/if}
    </div>
    <div class="build-percent">{$buildProgress.toFixed(1)}%</div>
  </div>
  
  <div style="margin-top: 1rem; text-align: center;">
    <button class="btn" on:click={resetBuild}>Build neu starten</button>
  </div>
</div>

<style lang="scss">
  .build-overlord {
    background-color: #1e1e1e;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 1rem;
    margin-top: 1rem;
  }
  
  .build-title {
    font-weight: bold;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .build-icon {
    font-size: 1.2rem;
  }
  
  .build-info {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
  
  .progress-container {
    height: 8px;
    background-color: #333;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
    position: relative;
  }
  
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #0078d4, #0091ff);
    transition: width 0.5s ease;
  }
  
  .tooltip-text {
    position: absolute;
    background-color: #333;
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    z-index: 10;
    
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #333 transparent transparent transparent;
    }
  }
</style>