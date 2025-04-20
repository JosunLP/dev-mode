<script lang="ts">
  import { licenseWhispers, currentWhisper, complianceMode } from '$lib/stores';
  import { onMount, onDestroy } from 'svelte';
  
  let whisperIntervalId: ReturnType<typeof setInterval>;
  let notificationElement: HTMLDivElement;
  let isVisible = false;
  let previousWhisperIndex = -1;
  
  // Zeigt einen zufälligen "Flüster"-Hinweis an
  function showRandomWhisper() {
    if ($complianceMode) return; // Im Compliance-Modus keine Hinweise anzeigen
    
    // Zufälligen Hinweis auswählen (nicht den gleichen wie zuvor)
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * $licenseWhispers.length);
    } while (randomIndex === previousWhisperIndex && $licenseWhispers.length > 1);
    
    previousWhisperIndex = randomIndex;
    $currentWhisper = $licenseWhispers[randomIndex];
    
    // Hinweis anzeigen
    isVisible = true;
    
    // Nach einigen Sekunden ausblenden
    setTimeout(() => {
      isVisible = false;
    }, 5000);
  }
  
  onMount(() => {
    // In zufälligen Intervallen (20-40s) Hinweise anzeigen
    whisperIntervalId = setInterval(() => {
      // Nur wenn die App nicht im Compliance-Modus ist
      if (!$complianceMode) {
        showRandomWhisper();
      }
    }, Math.random() * 20000 + 20000); // 20-40s
    
    // Ersten Hinweis nach kurzer Verzögerung anzeigen
    setTimeout(() => {
      if (!$complianceMode) {
        showRandomWhisper();
      }
    }, 5000);
  });
  
  onDestroy(() => {
    clearInterval(whisperIntervalId);
  });
</script>

{#if isVisible && !$complianceMode}
  <div 
    bind:this={notificationElement}
    class="license-whisper"
    class:active={isVisible}
  >
    <div class="license-whisper-content">
      <div class="license-icon">⚖️</div>
      <div class="license-message">{$currentWhisper}</div>
    </div>
  </div>
{/if}

<style lang="scss">
  .license-whisper {
    position: fixed;
    bottom: 20px;
    right: 20px;
    max-width: 350px;
    background-color: rgba(30, 30, 30, 0.95);
    color: #ccc;
    border-left: 4px solid #0078d4;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    padding: 0;
    z-index: 9990;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    
    &.active {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .license-whisper-content {
    display: flex;
    padding: 15px;
  }
  
  .license-icon {
    font-size: 24px;
    margin-right: 15px;
    flex-shrink: 0;
  }
  
  .license-message {
    font-size: 0.9rem;
    line-height: 1.4;
    font-style: italic;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .license-whisper {
      transition: none;
    }
  }
</style>