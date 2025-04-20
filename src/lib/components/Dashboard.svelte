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
  
  // Formatiere Text entsprechend dem Safe Mode
  function formatText(text: string): string {
    return text;
  }
  
  // Offender-Scan starten
  function startScan() {
    scanning = true;
    
    // Mock-Ergebnisse für den Open-Source Offender
    const possibleResults = [
      "Gefunden: Unautorisierte Verwendung einer MIT-Lizenz in Zeile 42!",
      "Warnung: GPL-Virus in Abhängigkeit 'svelte-awesome' entdeckt!",
      "Kritisch: Unentdeckte NPM-Pakete verletzen die Corporate Guidelines",
      "Hinweis: Lizenzkonflikt – Kaffee nicht GPL-kompatibel.",
      "Fehler: SvelteKit 'product-grade'-Lizenz nicht gefunden",
      "Alert: Unlizenzierte Codeabschnitte im Verzeichnis '/src/lib' identifiziert",
      "Konflikt: Verwendung von Open-Source mit proprietärem Code",
      "Kritisch: Undokumentierte Abhängigkeiten ohne Lizenzinformationen"
    ];
    
    // Wähle zufällig 3-5 Ergebnisse aus
    const resultCount = Math.floor(Math.random() * 3) + 3;
    const shuffled = [...possibleResults].sort(() => 0.5 - Math.random());
    const selectedResults = shuffled.slice(0, resultCount);
    
    // Nach einer kurzen Verzögerung die Ergebnisse anzeigen
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
      'Ungenehmigte Aktivität erkannt. Sie verwenden unrechtmäßig innovative Funktionen. Bitte unterlassen Sie jede weitere Innovation und wenden Sie sich an die Rechtsabteilung.', 
      false
    );
  }
  
  function toggleWatermark() {
    $watermarkEnabled = !$watermarkEnabled;
  }
  
  let trademarkEnabled = false; // Lokale Variable zur Steuerung der Trademark-Anzeige
  
  $: {
    // Aktualisiere Safe Mode
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
      <p>Innovative Entwicklungstools für maximale Produktivität</p>
    </div>
  </header>
  
  <section class="panel">
    <h2 class="trademark-text">Feature Dashboard</h2>
    
    <!-- ™ Safe Mode -->
    <div class="feature-section">
      <div class="feature-info">
        <h3 class="trademark-text">™ Safe Mode</h3>
        <p>Schützt Ihre Texte vor unbefugter Verwendung</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Schaltet Markenmodus ein (überall ™)</span>
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
        <h3 class="trademark-text">Experimentelle Features</h3>
        <p>Entdecken Sie unsere neuesten Entwicklungen im experimentellen Bereich</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Navigiert zu experimentellen Features (möglicherweise nicht verfügbar)</span>
          <a href="/experimental" class="btn">Entdecken</a>
        </div>
      </div>
    </div>
    
    <!-- Patent-Pending Watermark -->
    <div class="feature-section" class:disabled-by-compliance={$complianceMode}>
      <div class="feature-info">
        <h3 class="trademark-text">Patent-Pending Watermark</h3>
        <p>Zeigt ein bewegliches Patent-Pending Wasserzeichen an</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Aktiviert oder deaktiviert das Patent-Pending Wasserzeichen</span>
          <button class="btn" on:click={toggleWatermark} disabled={$complianceMode}>
            {$watermarkEnabled ? 'Deaktivieren' : 'Aktivieren'}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Trademark Radar -->
    <div class="feature-section" class:disabled-by-compliance={$complianceMode}>
      <div class="feature-info">
        <h3 class="trademark-text">Trademark Radar</h3>
        <p>Identifiziert potenziell geschützte Wörter auf der Seite</p>
      </div>
      <div class="feature-control">
        <TrademarkRadar />
      </div>
    </div>
    
    <!-- AI Pixel Randomizer -->
    <div class="feature-section" class:disabled-by-compliance={$complianceMode}>
      <div class="feature-info">
        <h3 class="trademark-text">AI Pixel Randomizer</h3>
        <p>Erstellen Sie bahnbrechende visuelle Effekte mit unserer KI-Technologie</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Randomisiert alle Pixel auf dem Bildschirm</span>
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
        <p>Testen Sie unsere automatischen Warnmeldungen</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Zeigt einen manuell ausgelösten Warn-Dialog an</span>
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
        <p>Konformität mit Unternehmensrichtlinien gewährleisten</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Aktiviert den unternehmenskonformen Modus</span>
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
        <p>Identifizieren Sie Open-Source-Verstöße in Ihrem Projekt</p>
      </div>
      <div class="feature-control">
        <div class="tooltip">
          <span class="tooltip-text">Scannt Ihr Projekt auf Lizenzverstöße</span>
          <button class="btn" on:click={startScan} disabled={$complianceMode || scanning}>
            {scanning ? 'Scanning...' : 'Scan starten'}
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
    <p>© 2025 Dev Mode - Alle Rechte vorbehalten</p>
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