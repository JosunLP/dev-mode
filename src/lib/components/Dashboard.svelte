<script lang="ts">
  import { safeMode, complianceMode, modalStore, scanResults, watermarkEnabled, trademarkRadarActive } from '$lib/stores';
  import Modal from './Modal.svelte';
  import PixelOverlay from './PixelOverlay.svelte';
  import PendingWatermark from './PendingWatermark.svelte';
  import LicenseWhisperer from './LicenseWhisperer.svelte';
  import TrademarkRadar from './TrademarkRadar.svelte';
  import PRQueue from './PRQueue.svelte';
  import BuildOverlord from './BuildOverlord.svelte';
  import DependencyMapper from './DependencyMapper.svelte';
  import { onMount } from 'svelte';
  
  let pixelOverlayComponent: { triggerEffect: () => void };
  let scanning = false;
  
  // Format text according to Safe Mode
  function formatText(text: string): string {
    return text;
  }
  
  // Start Offender scan
  function startScan() {
    scanning = true;
    
    // Mock results for the Open-Source Offender
    const possibleResults = [
      "Found: Unauthorized use of an MIT license on line 42!",
      "Warning: GPL virus detected in dependency 'svelte-awesome'!",
      "Critical: Undetected NPM packages violate Corporate Guidelines",
      "Notice: License conflict - Coffee not GPL-compatible.",
      "Error: SvelteKit 'product-grade' license not found",
      "Alert: Unlicensed code sections identified in directory '/src/lib'",
      "Conflict: Use of Open-Source with proprietary code",
      "Critical: Undocumented dependencies without license information"
    ];
    
    // Randomly select 3-5 results
    const resultCount = Math.floor(Math.random() * 3) + 3;
    const shuffled = [...possibleResults].sort(() => 0.5 - Math.random());
    const selectedResults = shuffled.slice(0, resultCount);
    
    // After a short delay, show the results
    setTimeout(() => {
      scanning = false;
      scanResults.set(selectedResults);
    }, 1500);
  }
  
  function triggerPixelRandomizer() {
    if (pixelOverlayComponent) {
      pixelOverlayComponent.triggerEffect();
    }
  }
  
  function triggerCeaseAndDesist() {
    modalStore.open(
      'Cease & Desist!', 
      'Unauthorized activity detected. You are illegally using innovative features. Please cease all further innovation and contact the legal department.', 
      false
    );
  }
  
  function toggleWatermark() {
    $watermarkEnabled = !$watermarkEnabled;
  }
  
  let trademarkEnabled = false; // Local variable to control trademark display
  
  $: {
    // Update Safe Mode
    if ($safeMode) {
      trademarkEnabled = true;
    } else {
      trademarkEnabled = false;
    }
  }
</script>

<div class="dashboard">
  <header class="dashboard-header panel">
    <div class="logo-section">
      <h1 class="trademark-text">Dev Mode</h1>
      <p>Innovative Development Tools for Maximum Productivity</p>
    </div>
  </header>
  
  <section class="panel">
    <h2 class="trademark-text">Feature Dashboard</h2>
    
    <!-- ™ Safe Mode -->
    <div class="feature-section">
      <div class="feature-info">
        <h3 class="trademark-text">™ Safe Mode</h3>
        <p>Protects your texts from unauthorized use</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Enables trademark mode (™ everywhere)</span>
          <label class="switch">
            <input type="checkbox" bind:checked={$safeMode}>
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
    
    <!-- Experimental Feature Link -->
    <div class="feature-section" class:disabled-by-compliance={$complianceMode}>
      <div class="feature-info">
        <h3 class="trademark-text">Experimental Features</h3>
        <p>Discover our latest developments in experimental areas</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Navigates to experimental features (may not be available)</span>
          <a href="/experimental" class="btn">Discover</a>
        </div>
      </div>
    </div>
    
    <!-- Patent-Pending Watermark -->
    <div class="feature-section" class:disabled-by-compliance={$complianceMode}>
      <div class="feature-info">
        <h3 class="trademark-text">Patent-Pending Watermark</h3>
        <p>Displays a moving Patent-Pending watermark</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Enables or disables the Patent-Pending watermark</span>
          <button class="btn" on:click={toggleWatermark} disabled={$complianceMode}>
            {$watermarkEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Trademark Radar -->
    <div class="feature-section" class:disabled-by-compliance={$complianceMode}>
      <div class="feature-info">
        <h3 class="trademark-text">Trademark Radar</h3>
        <p>Identifies potentially protected words on the page</p>
      </div>
      <div class="feature-control">
        <TrademarkRadar />
      </div>
    </div>
    
    <!-- AI Pixel Randomizer -->
    <div class="feature-section" class:disabled-by-compliance={$complianceMode}>
      <div class="feature-info">
        <h3 class="trademark-text">AI Pixel Randomizer</h3>
        <p>Create groundbreaking visual effects with our AI technology</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Randomizes all pixels on the screen</span>
          <button class="btn" on:click={triggerPixelRandomizer} disabled={$complianceMode}>
            Randomize
          </button>
        </div>
      </div>
    </div>
    
    <!-- Cease & Desist Alert (Manual Trigger) -->
    <div class="feature-section" class:disabled-by-compliance={$complianceMode}>
      <div class="feature-info">
        <h3 class="trademark-text">Cease & Desist Alert</h3>
        <p>Test our automatic warning notifications</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Shows a manually triggered warning dialog</span>
          <button class="btn" on:click={triggerCeaseAndDesist} disabled={$complianceMode}>
            Trigger Alert
          </button>
        </div>
      </div>
    </div>
    
    <!-- Corporate Compliance Mode -->
    <div class="feature-section">
      <div class="feature-info">
        <h3 class="trademark-text">Corporate Compliance Mode</h3>
        <p>Ensure compliance with company policies</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Activates the corporate compliant mode</span>
          <label class="switch">
            <input type="checkbox" bind:checked={$complianceMode}>
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
    
    <!-- Open-Source Offender -->
    <div class="feature-section" class:disabled-by-compliance={$complianceMode}>
      <div class="feature-info">
        <h3 class="trademark-text">Open-Source Offender</h3>
        <p>Identify open-source violations in your project</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Scans your project for license violations</span>
          <button class="btn" on:click={startScan} disabled={$complianceMode || scanning}>
            {scanning ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Scan Results -->
    {#if $scanResults.length > 0 && !$complianceMode}
      <div class="scan-results">
        {#each $scanResults as result}
          <div class="scan-result-item">{result}</div>
        {/each}
      </div>
    {/if}
  </section>
  
  <!-- Build Overlord Feature -->
  {#if !$complianceMode}
    <BuildOverlord />
  {/if}
  
  <!-- PR Queue Feature -->
  {#if !$complianceMode}
    <PRQueue />
  {/if}
  
  <!-- Dependency Patent Mapper Feature -->
  {#if !$complianceMode}
    <DependencyMapper />
  {/if}
  
  <footer class="panel dashboard-footer">
    <p>© 2025 Dev Mode - All Rights Reserved</p>
    <p>Version 0.0.1</p>
  </footer>
</div>

<PixelOverlay bind:this={pixelOverlayComponent} />
<Modal />
<PendingWatermark />
<LicenseWhisperer />

<style lang="scss">
  .dashboard {
    padding: 2rem 1rem;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .dashboard-header {
    margin-bottom: 2rem;
    padding: 2rem;
    text-align: center;
    
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: #0078d4;
    }
    
    p {
      color: #a0a0a0;
      font-size: 1.1rem;
    }
  }
  
  .dashboard-footer {
    margin-top: 2rem;
    text-align: center;
    color: #a0a0a0;
    font-size: 0.9rem;
    
    p {
      margin: 0.25rem 0;
    }
  }
  
  h2 {
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #474747;
  }
  
  .feature-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: 1px solid #2a2a2a;
    
    &:last-child {
      border-bottom: none;
    }
    
    &.disabled-by-compliance {
      opacity: 0.5;
      pointer-events: none;
    }
  }
  
  .feature-info {
    flex: 1;
    
    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      color: #0078d4;
    }
    
    p {
      margin: 0;
      font-size: 0.9rem;
      color: #a0a0a0;
    }
  }
  
  .feature-control {
    min-width: 120px;
    text-align: right;
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
  
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    
    input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 34px;
      
      &:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
    }
    
    input:checked + .slider {
      background-color: #0078d4;
    }
    
    input:checked + .slider:before {
      transform: translateX(26px);
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
  
  .scan-results {
    margin-top: 1rem;
    background-color: #1e1e1e;
    border-radius: 4px;
    padding: 1rem;
  }
  
  .scan-result-item {
    padding: 0.5rem;
    border-bottom: 1px solid #333;
    font-size: 0.9rem;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .panel {
    background-color: #1c1c1c;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    padding: 2rem;
    margin-bottom: 2rem;
  }
</style>