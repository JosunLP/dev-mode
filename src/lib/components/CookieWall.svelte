<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
  // Local store for cookie consent
  const cookieConsentGiven = writable<boolean>(false);
  
  // Cookie options with various satirical categories
  const cookieOptions = [
    { 
      id: 'essential', 
      name: 'Essential Cookies™', 
      description: 'These cookies are absolutely necessary because we defined them that way.',
      required: true,
      checked: true 
    },
    { 
      id: 'marketing', 
      name: 'Marketing Cookies®', 
      description: 'Collects data about your entire online presence, including your thoughts about marketing.',
      required: false,
      checked: false 
    },
    { 
      id: 'partner', 
      name: 'Partner Cookies™', 
      description: 'Shares your data with 248 "trusted" partners whose names we cannot disclose for legal reasons.',
      required: false,
      checked: false 
    },
    { 
      id: 'tracking', 
      name: 'IP-Tracking©', 
      description: 'Tracks your IP address and estimates the distance to your refrigerator with an accuracy of 3 meters.',
      required: false,
      checked: false 
    },
    { 
      id: 'trademark', 
      name: 'Trademark-Tracking℠', 
      description: 'Detects when you speak protected trademarks, even when your microphone is turned off.',
      required: false,
      checked: false 
    },
    { 
      id: 'performance', 
      name: 'Performance Cookies☐', 
      description: 'Makes your website slower so you have time to get coffee while waiting for it to load.',
      required: false,
      checked: false 
    },
    { 
      id: 'analytics', 
      name: 'Analytics Cookies®', 
      description: 'Analyzes your clicks and tries to guess what you had for breakfast.',
      required: false,
      checked: false 
    },
    { 
      id: 'ai', 
      name: 'AI Data Collection™', 
      description: 'Trains an AI that mimics your online personality and occasionally shops on your behalf.',
      required: false,
      checked: false 
    },
    { 
      id: 'sound', 
      name: 'Acoustic Analysis™', 
      description: 'Analyzes background noises to determine your music preferences and local weather.',
      required: false,
      checked: false 
    },
    { 
      id: 'psychology', 
      name: 'Psychological Profiles®', 
      description: 'Creates a psychological profile based on your cursor movement and the time it takes you to read this text.',
      required: false,
      checked: false 
    },
    { 
      id: 'future', 
      name: 'Future Cookies²', 
      description: 'Reserves the right to retroactively activate tracking methods yet to be developed.',
      required: false,
      checked: false 
    },
    { 
      id: 'gdpr', 
      name: 'GDPR-Bypass Cookies™', 
      description: 'Technically sophisticated cookies that allow us to say we are GDPR compliant without actually being so.',
      required: false,
      checked: false 
    },
    { 
      id: 'font', 
      name: 'Font Preference Cookies®', 
      description: 'Stores which fonts you look at to draw conclusions about your character.',
      required: false,
      checked: false 
    },
    { 
      id: 'dreams', 
      name: 'Dream-Analytics™', 
      description: 'Attempts to reconstruct your dreams from last night by analyzing your browsing behavior.',
      required: false,
      checked: false 
    },
    { 
      id: 'legal', 
      name: 'Legal-Disclaimer-Cookies©', 
      description: 'Makes all other cookies legal by simply writing "legal" in the label.',
      required: false,
      checked: false 
    }
  ];
  
  // States for all checkboxes
  let allChecked = false;
  let options = [...cookieOptions];
  
  // Check if all checkboxes are checked
  $: {
    allChecked = options.every(option => option.checked);
  }
  
  // Toggle all checkboxes
  function toggleAll() {
    options = options.map(option => ({
      ...option,
      checked: !allChecked
    }));
    allChecked = !allChecked;
  }
  
  // Save cookie consent and close wall
  function acceptCookies() {
    // Check if all required cookies are enabled
    const requiredChecked = options.every(option => !option.required || option.checked);
    
    if (!requiredChecked) {
      alert("Please consent to the required cookies!");
      return;
    }
    
    // Save consent in localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cookie-consent-given', 'true');
      cookieConsentGiven.set(true);
    }
  }
  
  // Reject cookie consent (disable all except required)
  function rejectCookies() {
    options = options.map(option => ({
      ...option,
      checked: option.required
    }));
  }
  
  // Check if consent has already been given on load
  onMount(() => {
    if (typeof localStorage !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent-given');
      if (consent === 'true') {
        cookieConsentGiven.set(true);
      }
    }
    
    // For testing: Reset cookie consent with Ctrl+Alt+R
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
        <h2>Cookie Consent Required</h2>
        <p>Please consent to the use of at least 15 different types of cookies before you can proceed.</p>
      </div>
      
      <div class="cookie-options">
        <div class="select-all-option">
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={allChecked} on:change={toggleAll}>
            <span class="checkbox-text">Select all</span>
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
              <div class="option-name">{option.name} {option.required ? '(Required)' : ''}</div>
              <div class="option-description">{option.description}</div>
            </div>
          </div>
        {/each}
      </div>
      
      <div class="cookie-notice">
        <p>By clicking "Accept", you agree to the use of these cookies, as well as any future cookies we might think of. The cookie policy may change at any time, especially after clicking "Accept".</p>
      </div>
      
      <div class="cookie-buttons">
        <button class="btn btn-secondary" on:click={rejectCookies}>Required Only</button>
        <button class="btn btn-primary" on:click={acceptCookies}>Accept</button>
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