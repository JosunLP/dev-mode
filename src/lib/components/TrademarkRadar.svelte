<script lang="ts">
  import { trademarkRadarActive, markedWords, safeMode } from '$lib/stores';
  import { onMount, onDestroy } from 'svelte';
  
  let scanIntervalId: ReturnType<typeof setInterval>;
  let isScanning = false;
  
  // Activates or deactivates the TrademarkRadar
  function toggleTrademarkRadar() {
    $trademarkRadarActive = !$trademarkRadarActive;
    
    if ($trademarkRadarActive) {
      startScanning();
    } else {
      stopScanning();
      // Reset all marked words
      resetMarkedWords();
    }
  }
  
  // Starts the scanning process for trademark rights
  function startScanning() {
    if (isScanning) return;
    
    isScanning = true;
    
    // Perform first check immediately
    scanForTrademarkWords();
    
    // Regularly search for more trademarked words (every 3 seconds)
    scanIntervalId = setInterval(() => {
      if ($trademarkRadarActive) {
        scanForTrademarkWords();
      }
    }, 3000);
  }
  
  // Stops the scanning process
  function stopScanning() {
    isScanning = false;
    clearInterval(scanIntervalId);
  }
  
  // Searches the DOM for potentially protected words
  function scanForTrademarkWords() {
    // Get the list of words to monitor from the store
    const wordsToScan = $markedWords.map(item => item.word.toLowerCase());
    
    // Find text nodes in the DOM
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    let foundWords = new Set();
    
    while ((node = walker.nextNode())) {
      // Ignore script and style elements
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
      
      // Check each word in our list
      wordsToScan.forEach((word, index) => {
        if (text.includes(word)) {
          foundWords.add(index);
        }
      });
    }
    
    // Mark words as found
    $markedWords = $markedWords.map((item, index) => {
      return { ...item, marked: foundWords.has(index) };
    });
  }
  
  // Resets all marked words
  function resetMarkedWords() {
    $markedWords = $markedWords.map(item => ({ ...item, marked: false }));
  }
  
  // As a reaction to changes in safeMode
  $: {
    if ($safeMode && !$trademarkRadarActive) {
      // SafeMode automatically activates the Trademark Radar
      $trademarkRadarActive = true;
      startScanning();
    } else if (!$safeMode && $trademarkRadarActive) {
      // If SafeMode is deactivated, don't change Radar status, but user can manually deactivate it
    }
  }
  
  onMount(() => {
    // Automatically start if the TrademarkRadar is already active
    if ($trademarkRadarActive) {
      startScanning();
    }
    
    // React to DOM changes to scan new content
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
    <span class="tooltip-text">Activates or deactivates the trademark word radar</span>
    <button class="btn" on:click={toggleTrademarkRadar}>
      {$trademarkRadarActive ? 'Deactivate' : 'Activate'}
    </button>
  </div>
</div>

{#if $trademarkRadarActive}
  <div class="trademark-findings">
    {#each $markedWords.filter(word => word.marked) as word (word.word)}
      <div class="trademark-word">
        "{word.word}" found ™
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