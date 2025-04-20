<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
  // Lokaler Store für die Cookie-Zustimmung
  const cookieConsentGiven = writable<boolean>(false);
  
  // Cookie-Optionen mit verschiedenen satirischen Kategorien
  const cookieOptions = [
    { 
      id: 'essential', 
      name: 'Essentielle Cookies™', 
      description: 'Diese Cookies sind absolut notwendig, weil wir es so definiert haben.',
      required: true,
      checked: true 
    },
    { 
      id: 'marketing', 
      name: 'Marketing Cookies®', 
      description: 'Sammelt Daten über Ihre gesamte Online-Präsenz, einschließlich Ihrer Gedanken über Marketing.',
      required: false,
      checked: false 
    },
    { 
      id: 'partner', 
      name: 'Partner Cookies™', 
      description: 'Teilt Ihre Daten mit 248 "vertrauenswürdigen" Partnern, deren Namen wir aus rechtlichen Gründen nicht nennen können.',
      required: false,
      checked: false 
    },
    { 
      id: 'tracking', 
      name: 'IP-Tracking©', 
      description: 'Verfolgt Ihre IP-Adresse und schätzt den Abstand zu Ihrem Kühlschrank auf 3 Meter genau.',
      required: false,
      checked: false 
    },
    { 
      id: 'trademark', 
      name: 'Trademark-Tracking℠', 
      description: 'Erkennt, wenn Sie geschützte Marken aussprechen, auch wenn Ihr Mikrofon ausgeschaltet ist.',
      required: false,
      checked: false 
    },
    { 
      id: 'performance', 
      name: 'Performance Cookies☐', 
      description: 'Macht Ihre Website langsamer, damit Sie Zeit haben, Kaffee zu holen, während Sie auf das Laden warten.',
      required: false,
      checked: false 
    },
    { 
      id: 'analytics', 
      name: 'Analytics Cookies®', 
      description: 'Analysiert Ihre Klicks und versucht zu erraten, was Sie zum Frühstück hatten.',
      required: false,
      checked: false 
    },
    { 
      id: 'ai', 
      name: 'KI-Datensammlung™', 
      description: 'Trainiert eine KI, die Ihre Online-Persönlichkeit nachahmt und gelegentlich in Ihrem Namen einkauft.',
      required: false,
      checked: false 
    },
    { 
      id: 'sound', 
      name: 'Akustische Analyse™', 
      description: 'Analysiert Hintergrundgeräusche, um Ihre Musikvorlieben und das Wetter bei Ihnen zu bestimmen.',
      required: false,
      checked: false 
    },
    { 
      id: 'psychology', 
      name: 'Psychologische Profile®', 
      description: 'Erstellt ein psychologisches Profil basierend auf Ihrer Cursor-Bewegung und der Zeit, die Sie zum Lesen dieses Textes brauchen.',
      required: false,
      checked: false 
    },
    { 
      id: 'future', 
      name: 'Zukunfts-Cookies²', 
      description: 'Reserviert das Recht, in der Zukunft entwickelte Tracking-Methoden nachträglich zu aktivieren.',
      required: false,
      checked: false 
    },
    { 
      id: 'gdpr', 
      name: 'GDPR-Umgehungscookies™', 
      description: 'Technisch ausgefeilte Cookies, die es uns erlauben zu sagen, dass wir DSGVO-konform sind, ohne es zu sein.',
      required: false,
      checked: false 
    },
    { 
      id: 'font', 
      name: 'Font-Präferenz-Cookies®', 
      description: 'Speichert, welche Schriftarten Sie anschauen, um Rückschlüsse auf Ihren Charakter zu ziehen.',
      required: false,
      checked: false 
    },
    { 
      id: 'dreams', 
      name: 'Dream-Analytics™', 
      description: 'Versucht durch Analyse Ihres Browserverhaltens Ihre Träume der letzten Nacht zu rekonstruieren.',
      required: false,
      checked: false 
    },
    { 
      id: 'legal', 
      name: 'Legal-Disclaimer-Cookies©', 
      description: 'Macht alle anderen Cookies legal, indem einfach "legal" ins Label geschrieben wird.',
      required: false,
      checked: false 
    }
  ];
  
  // Zustände für alle Checkboxen
  let allChecked = false;
  let options = [...cookieOptions];
  
  // Prüft, ob alle Checkboxen angekreuzt sind
  $: {
    allChecked = options.every(option => option.checked);
  }
  
  // Alle Checkboxen umschalten
  function toggleAll() {
    options = options.map(option => ({
      ...option,
      checked: !allChecked
    }));
    allChecked = !allChecked;
  }
  
  // Cookie-Zustimmung speichern und Wall schließen
  function acceptCookies() {
    // Prüfen, ob alle erforderlichen Cookies aktiviert sind
    const requiredChecked = options.every(option => !option.required || option.checked);
    
    if (!requiredChecked) {
      alert("Bitte stimmen Sie den erforderlichen Cookies zu!");
      return;
    }
    
    // Speichern der Einwilligung im localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cookie-consent-given', 'true');
      cookieConsentGiven.set(true);
    }
  }
  
  // Cookie-Zustimmung ablehnen (alle deaktivieren außer erforderliche)
  function rejectCookies() {
    options = options.map(option => ({
      ...option,
      checked: option.required
    }));
  }
  
  // Überprüfe beim Laden, ob die Zustimmung bereits gegeben wurde
  onMount(() => {
    if (typeof localStorage !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent-given');
      if (consent === 'true') {
        cookieConsentGiven.set(true);
      }
    }
    
    // Für Testzwecke: Cookie-Einwilligung zurücksetzen mit Strg+Alt+R
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'r') {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('cookie-consent-given');
          cookieConsentGiven.set(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

{#if !$cookieConsentGiven}
  <div class="cookie-wall">
    <div class="cookie-container">
      <div class="cookie-header">
        <h2>Cookie-Einwilligung erforderlich</h2>
        <p>Bitte stimmen Sie der Verwendung von mindestens 15 verschiedenen Arten von Cookies zu, bevor Sie fortfahren können.</p>
      </div>
      
      <div class="cookie-options">
        <div class="select-all-option">
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={allChecked} on:change={toggleAll}>
            <span class="checkbox-text">Alle auswählen</span>
          </label>
        </div>
        
        {#each options as option}
          <div class="cookie-option" class:required={option.required}>
            <div class="option-checkbox">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  bind:checked={option.checked} 
                  disabled={option.required}
                >
                <span class="checkbox-text visually-hidden">{option.name}</span>
              </label>
            </div>
            <div class="option-details">
              <div class="option-name">{option.name} {option.required ? '(Erforderlich)' : ''}</div>
              <div class="option-description">{option.description}</div>
            </div>
          </div>
        {/each}
      </div>
      
      <div class="cookie-notice">
        <p>Durch Klicken auf "Akzeptieren" stimmen Sie der Verwendung dieser Cookies zu, sowie allen zukünftigen Cookies, die wir uns ausdenken könnten. Die Cookie-Richtlinien können sich jederzeit ändern, insbesondere nach dem Klicken auf "Akzeptieren".</p>
      </div>
      
      <div class="cookie-buttons">
        <button class="btn btn-secondary" on:click={rejectCookies}>Nur Erforderliche</button>
        <button class="btn btn-primary" on:click={acceptCookies}>Akzeptieren</button>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .cookie-wall {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 1rem;
  }
  
  .cookie-container {
    background-color: #252526;
    border: 1px solid #474747;
    border-radius: 8px;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    
    .cookie-header {
      margin-bottom: 1.5rem;
      text-align: center;
      
      h2 {
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
        color: #e0e0e0;
      }
      
      p {
        color: #a0a0a0;
      }
    }
    
    .cookie-options {
      margin-bottom: 1.5rem;
      max-height: 400px;
      overflow-y: auto;
      padding-right: 0.5rem;
      
      .select-all-option {
        padding: 0.5rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid #474747;
      }
      
      .cookie-option {
        display: flex;
        padding: 1rem;
        border: 1px solid #474747;
        border-radius: 4px;
        margin-bottom: 0.5rem;
        transition: background-color 0.2s;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        &.required {
          background-color: rgba(0, 120, 212, 0.05);
          border-color: rgba(0, 120, 212, 0.3);
        }
        
        .option-checkbox {
          margin-right: 1rem;
          display: flex;
          align-items: flex-start;
          padding-top: 0.2rem;
        }
        
        .option-details {
          flex: 1;
          
          .option-name {
            font-weight: 600;
            margin-bottom: 0.25rem;
            color: #e0e0e0;
          }
          
          .option-description {
            font-size: 0.9rem;
            color: #a0a0a0;
          }
        }
      }
    }
    
    .cookie-notice {
      margin: 1.5rem 0;
      padding: 1rem;
      border-left: 3px solid #0078d4;
      background-color: rgba(0, 120, 212, 0.05);
      font-size: 0.9rem;
      color: #a0a0a0;
    }
    
    .cookie-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      
      .btn {
        min-width: 150px;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease;
        
        &.btn-primary {
          background-color: #0078d4;
          color: white;
          
          &:hover {
            background-color: #0086ef;
          }
        }
        
        &.btn-secondary {
          background-color: #333333;
          color: #e0e0e0;
          
          &:hover {
            background-color: #444444;
          }
        }
      }
    }
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    
    input[type="checkbox"] {
      margin-right: 0.5rem;
      cursor: pointer;
    }
  }
  
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>