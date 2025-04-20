<script lang="ts">
  import { trademarkRadarActive, markedWords, safeMode } from '$lib/stores';
  import { onMount, onDestroy } from 'svelte';
  
  let scanIntervalId: ReturnType<typeof setInterval>;
  let isScanning = false;
  
  // Aktiviert oder deaktiviert den TrademarkRadar
  function toggleTrademarkRadar() {
    $trademarkRadarActive = !$trademarkRadarActive;
    
    if ($trademarkRadarActive) {
      startScanning();
    } else {
      stopScanning();
      // Alle markierten Wörter zurücksetzen
      resetMarkedWords();
    }
  }
  
  // Startet den Scan-Prozess für Markenrechte
  function startScanning() {
    if (isScanning) return;
    
    isScanning = true;
    
    // Erste Prüfung sofort durchführen
    scanForTrademarkWords();
    
    // Regelmäßig nach weiteren Markenwörtern suchen (alle 3 Sekunden)
    scanIntervalId = setInterval(() => {
      if ($trademarkRadarActive) {
        scanForTrademarkWords();
      }
    }, 3000);
  }
  
  // Stoppt den Scan-Prozess
  function stopScanning() {
    isScanning = false;
    clearInterval(scanIntervalId);
  }
  
  // Durchsucht das DOM nach potenziell geschützten Wörtern
  function scanForTrademarkWords() {
    // Liste der zu überwachenden Wörter aus dem Store holen
    const wordsToScan = $markedWords.map(item => item.word.toLowerCase());
    
    // Text-Knoten im DOM finden
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    let foundWords = new Set();
    
    while ((node = walker.nextNode())) {
      // Ignoriere Script- und Style-Elemente
      const parentElement = node.parentElement;
      if (
        parentElement && 
        (
          parentElement.tagName === 'SCRIPT' || 
          parentElement.tagName === 'STYLE' || 
          parentElement.classList.contains('trademark-radar-marked') ||
          parentElement.hasAttribute('data-no-trademark-scan')
        )
      ) {
        continue;
      }
      
      const text = node.textContent?.toLowerCase() || '';
      
      // Prüfe jedes Wort in unserer Liste
      wordsToScan.forEach((word, index) => {
        if (text.includes(word)) {
          foundWords.add(index);
        }
      });
    }
    
    // Wörter als gefunden markieren
    $markedWords = $markedWords.map((item, index) => {
      return { ...item, marked: foundWords.has(index) };
    });
  }
  
  // Setzt alle markierten Wörter zurück
  function resetMarkedWords() {
    $markedWords = $markedWords.map(item => ({ ...item, marked: false }));
  }
  
  // Als Reaktion auf Änderungen am safeMode
  $: {
    if ($safeMode && !$trademarkRadarActive) {
      // SafeMode aktiviert automatisch den Trademark Radar
      $trademarkRadarActive = true;
      startScanning();
    } else if (!$safeMode && $trademarkRadarActive) {
      // Wenn SafeMode deaktiviert wird, Radar Status nicht ändern, aber Benutzer kann ihn manuell deaktivieren
    }
  }
  
  onMount(() => {
    // Automatisch starten, wenn der TrademarkRadar bereits aktiv ist
    if ($trademarkRadarActive) {
      startScanning();
    }
    
    // Auf DOM-Änderungen reagieren, um neue Inhalte zu scannen
    const observer = new MutationObserver((mutations) => {
      if ($trademarkRadarActive) {
        scanForTrademarkWords();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    return () => {
      observer.disconnect();
    };
  });
  
  onDestroy(() => {
    stopScanning();
  });
</script>

<div class="trademark-radar">
  <div class="tooltip">
    <span class="tooltip-text">Aktiviert oder deaktiviert den Markenwort-Radar</span>
    <button class="btn" on:click={toggleTrademarkRadar}>
      {$trademarkRadarActive ? 'Deaktivieren' : 'Aktivieren'}
    </button>
  </div>
</div>

{#if $trademarkRadarActive}
  <div class="trademark-findings">
    {#each $markedWords.filter(word => word.marked) as word (word.word)}
      <div class="trademark-word">
        "{word.word}" gefunden ™
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  .trademark-findings {
    margin-top: 10px;
    max-height: 100px;
    overflow-y: auto;
    background-color: rgba(30, 30, 30, 0.6);
    border-radius: 4px;
    padding: 5px 8px;
  }
  
  .trademark-word {
    font-size: 0.8rem;
    color: #ff9800;
    margin: 2px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .btn {
    background-color: #0078d4;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #006abc;
    }
    
    &:disabled {
      background-color: #555;
      cursor: not-allowed;
    }
  }
  
  .tooltip {
    position: relative;
    display: inline-block;
    
    .tooltip-text {
      visibility: hidden;
      width: 200px;
      background-color: #333;
      color: #fff;
      text-align: center;
      border-radius: 4px;
      padding: 0.5rem;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s;
      font-size: 0.8rem;
    }
    
    &:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
  }
</style>